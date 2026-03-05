# Documentation API Dexcom - Authentification OAuth2

Source: [developer.dexcom.com/docs/dexcom/authentication](https://developer.dexcom.com/docs/dexcom/authentication/)

## Vue d'ensemble

L'API Dexcom utilise **OAuth 2.0** : l'utilisateur s'authentifie sur Dexcom (pas dans votre app), autorise l'accès aux données, et peut révoquer l'autorisation à tout moment.

---

## Étape 1 : Credentials applicatif

Sur [developer.dexcom.com](https://developer.dexcom.com/) :
- S'inscrire comme développeur
- Créer une application
- Récupérer `client_id` et `client_secret`

Le `client_secret` ne doit **jamais** être exposé côté client (mobile/web public).

---

## Étape 2 : URL d'autorisation

Rediriger l'utilisateur vers la page de login Dexcom :

**Production (US):**
```
https://api.dexcom.com/v3/oauth2/login?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code&scope=offline_access&state={state}
```

**Sandbox:**
```
https://sandbox-api.dexcom.com/v3/oauth2/login?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code&scope=offline_access&state={state}
```

| Paramètre      | Obligatoire | Description                                                                 |
|----------------|-------------|-----------------------------------------------------------------------------|
| client_id      | Oui         | ID de l'application                                                         |
| redirect_uri   | Oui         | Doit correspondre **exactement** à l'URI enregistrée sur le portail Dexcom |
| response_type  | Oui         | Toujours `code`                                                             |
| scope          | Oui         | Toujours `offline_access`                                                   |
| state          | Optionnel   | Token CSRF — recommandé pour la sécurité                                    |

**Sandbox :** aucun mot de passe requis à l'écran de login (menu déroulant pour choisir l'utilisateur simulé).

---

## Étape 3 : Callback avec code

Après autorisation, Dexcom redirige vers votre `redirect_uri` avec :

**Succès:**
```
{redirect_uri}?code={authorization_code}&state={state}
```

**Refus:**
```
{redirect_uri}?error=access_denied
```

- Le `code` est à usage unique et expire après **1 minute**
- Le `state` n'est renvoyé que si envoyé à l'étape 2

---

## Étape 4 : Échanger le code contre les tokens

**Endpoint :** `POST /v3/oauth2/token`

**Headers :** `Content-Type: application/x-www-form-urlencoded`

**Body (form):**

| Paramètre      | Description                          |
|----------------|--------------------------------------|
| client_id      | ID de l'application                  |
| client_secret  | Secret de l'application              |
| code           | Authorization code de l'étape 3      |
| redirect_uri   | **Même URI** qu'à l'étape 2         |
| grant_type     | `authorization_code`                 |

**Réponse (200):**
```json
{
  "access_token": "...",
  "expires_in": 7200,
  "token_type": "Bearer",
  "refresh_token": "...",
  "refresh_expires_in": 0
}
```

`expires_in` = durée de vie en secondes (2 h).

---

## Étape 5 : Appels API avec Bearer token

**Header :** `Authorization: Bearer {access_token}`

Exemple EGV :
```
GET /v3/users/self/egvs?startDate=2025-02-06T09:12:35&endDate=2025-02-06T10:12:35
```

---

## Étape 6 : Rafraîchir le token

**Endpoint :** `POST /v3/oauth2/token` (même que l'étape 4)

**Body (form):**

| Paramètre      | Description                    |
|----------------|--------------------------------|
| client_id      | ID de l'application            |
| client_secret  | Secret de l'application        |
| refresh_token  | Refresh token actuel           |
| grant_type     | `refresh_token`                |

- Chaque `refresh_token` ne peut être utilisé **qu'une seule fois**
- Dexcom renvoie un nouveau `refresh_token` à chaque refresh
- Valide maximum **1 an**

---

## Sandbox : utilisateurs simulés

| Username | Données                         |
|----------|----------------------------------|
| User7    | G7 Mobile App                   |
| User8    | ONE+ Mobile App                 |
| User6    | G6 Mobile App                   |
| User4    | G6 Touchscreen Receiver         |

Utiliser `/dataRange` pour connaître les plages de données disponibles par utilisateur.

---

## Gestion des erreurs

- **401** sur un appel API : utiliser le `refresh_token` pour obtenir un nouvel `access_token`
- **400** sur refresh : refresh_token invalide (expiré, utilisé, révoqué, ou mot de passe changé) → redemander l'autorisation OAuth

---

## URLs par environnement

| Environnement | Base URL                      |
|---------------|-------------------------------|
| Sandbox       | https://sandbox-api.dexcom.com |
| US Production | https://api.dexcom.com        |
| EU            | https://api.dexcom.eu         |
| Japan         | https://api.dexcom.jp         |

---

## Dépannage : "The client application is not known or is not authorized"

1. **Page diagnostic** : En développement, allez sur `/dexcom/check` (connecté) pour voir l’URI et la config utilisées.

2. **Redirect URI** : Elle doit être **identique** à celle configurée sur developer.dexcom.com (My Apps → votre app → Redirect URIs). Aucun espace, pas de slash final. Si l’app tourne sur un port variable, définissez `DEXCOM_REDIRECT_URI` dans `.env`.

3. **Credentials** : Vérifiez `DEXCOM_CLIENT_ID` et `DEXCOM_CLIENT_SECRET` — copiez-les depuis le portail sans espace ni retour à la ligne. Les valeurs sont automatiquement trimmées.

4. **Sandbox** : Pour les tests, utilisez `DEXCOM_SANDBOX=true` et la base URL `https://sandbox-api.dexcom.com`. L’accès Sandbox est automatique pour toute app enregistrée.
