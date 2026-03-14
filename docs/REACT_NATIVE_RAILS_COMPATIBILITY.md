# Compatibilité React Native et Ruby on Rails 8

Ce document décrit comment **vérifier la compatibilité** entre une application **React Native** (ou Expo) et un backend **Ruby on Rails 8**, lorsque l’app mobile consomme une API Rails.

---

## 1. Vue d’ensemble

| Rôle | Technologie | Rôle |
|------|-------------|------|
| **Client (app mobile)** | React Native / Expo | Affiche l’UI, envoie des requêtes HTTP à l’API |
| **Serveur (API)** | Ruby on Rails 8 | Expose des endpoints (JSON), gère la logique métier et les données |

Il n’existe **pas de dépendance de version directe** entre React Native et Rails : ils communiquent par **HTTP** et **JSON**. La compatibilité se vérifie sur le **contrat d’API** (formats, authentification, erreurs) et sur les **outils** utilisés côté client (bibliothèques compatibles React Native).

---

## 2. Compatibilité technique

### 2.1 Communication

- **Rails 8** expose une API REST (ou GraphQL) qui renvoie du **JSON** (`render json: ...`, `as_json`, ou serializers).
- **React Native** envoie des requêtes **HTTP/HTTPS** (fetch, axios, etc.) et consomme du JSON.

Tant que Rails 8 renvoie du JSON et que le client envoie des requêtes HTTP standard, les deux sont compatibles. Rails 8 améliore le rendu JSON (fast path, moins d’appels inutiles) ; veille à ce que tes réponses n’aient pas de clés dupliquées (string vs symbol), ce qui peut arriver avec certaines sérialisations.

### 2.2 CORS (Cross-Origin)

- **App native (Expo / React Native)** : les requêtes ne sont pas soumises à la politique CORS du navigateur. CORS concerne uniquement le **navigateur**. Tu n’as rien à configurer côté Rails 8 pour CORS si seul le client est l’app mobile.
- **Si tu as aussi un front web** (ex. Vite + React) qui appelle la même API Rails depuis un autre domaine : configure **CORS** côté Rails 8 (gem `rack-cors`, en-têtes `Access-Control-Allow-Origin`, etc.). Rails 8 supporte les mêmes mécanismes que les versions précédentes.

### 2.3 Authentification

- **Rails** : sessions (cookies), ou token (JWT, Bearer, API key) dans les en-têtes.
- **React Native** : pas de cookies partagés comme dans un navigateur ; en pratique on utilise souvent un **token** (JWT ou similaire) stocké localement (ex. `expo-secure-store`) et envoyé dans l’en-tête `Authorization`.

Pour que ce soit compatible :

- Rails doit accepter l’authentification par **token** (en-tête `Authorization: Bearer <token>`) pour les endpoints utilisés par l’app mobile.
- L’app mobile doit envoyer ce token sur chaque requête authentifiée.

---

## 3. Checklist de vérification

Utilise cette liste pour valider que ton stack React Native + Rails fonctionne bien ensemble.

### Côté Rails (API)

| Point | Vérification |
|-------|--------------|
| **Format de réponse** | Les contrôleurs renvoient du JSON (`render json: ...` ou format JSON par défaut). |
| **Authentification** | Un mécanisme token (JWT, Bearer) ou session est prévu et documenté pour l’API. |
| **CORS** | Si l’API est aussi appelée depuis un site web (autre origine), CORS est configuré (origines autorisées, méthodes, en-têtes). |
| **Version Rails** | **Rails 8** (8.0, 8.1, 8.2) recommandé pour les nouveaux projets. Pas de lien strict avec la version de React Native. |
| **Documentation API** | Les endpoints, paramètres et réponses (ex. structure JSON) sont décrits (README, OpenAPI, Postman, etc.). |

### Côté React Native / Expo

| Point | Vérification |
|-------|--------------|
| **Appels HTTP** | Utilisation de `fetch` ou d’une librairie compatible React Native (ex. `axios`) — pas de code dépendant de `react-dom` ou du navigateur. |
| **Bibliothèques** | Les paquets npm sont compatibles React Native (pas de libs “web only” comme `react-select` ciblant le DOM). Voir [React Native – Libraries](https://reactnative.dev/docs/libraries). |
| **Version React Native** | Version supportée par les librairies que tu utilises (Expo SDK 54 = React Native 0.81.x). |
| **Stockage sécurisé** | Pour les tokens, utilisation d’un stockage adapté au mobile (ex. `expo-secure-store`) et pas uniquement AsyncStorage pour les secrets. |
| **Réseau** | En dev, l’app peut joindre l’API (adresse IP de la machine ou tunnel) ; en prod, URL d’API HTTPS claire et configurée. |

### Contrat d’API (Rails ↔ client)

| Point | Vérification |
|-------|--------------|
| **Structure JSON** | Les réponses Rails (noms de champs, types, imbrication) correspondent à ce que l’app mobile attend (types TypeScript, modèles, etc.). |
| **Codes HTTP** | Gestion des 4xx/5xx côté client (messages d’erreur, déconnexion si 401, etc.). |
| **Pagination** | Si les listes sont paginées, le format (offset/limit, cursor, etc.) est le même côté Rails et côté client. |

---

## 4. Bibliothèques React Native compatibles

- Les librairies qui ciblent **uniquement le web** (ex. `react-dom`, libs de sélecteur web) ne sont en général **pas** compatibles React Native.
- Pour savoir si une lib fonctionne avec React Native : voir sa doc, le [React Native Directory](https://reactnative.directory/) (filtres par plateforme), ou tester dans le projet et désinstaller si besoin (`npm uninstall <package>`).

Référence : [Determining Library Compatibility – React Native](https://reactnative.dev/docs/libraries).

---

## 5. Rails 8 côté API

- **Application API** : avec Rails 8, tu peux créer une app uniquement API (`rails new my_api --api`) ou exposer des endpoints JSON dans une app complète. Les contrôleurs utilisent `render json: ...` ou des serializers (Active Model Serializers, Jbuilder, etc.).
- **JSON et performances** : Rails 8 optimise le rendu JSON. Assure-toi que les réponses n’ont pas de **clés dupliquées** (même clé en string et en symbol), ce qui peut poser problème côté client et a été source de changements de comportement en 8.
- **Documentation officielle Rails 8** : [Guides Rails](https://guides.rubyonrails.org/), [API Rails](https://api.rubyonrails.org/) (choisir la version 8.x dans le sélecteur).

---

## 6. Versions et écosystèmes

- **Ruby on Rails 8** : [Guides Rails](https://guides.rubyonrails.org/), [API Rails](https://api.rubyonrails.org/) (v8). La version de Rails n’a pas à “matcher” une version de React Native.
- **React Native** : [Documentation React Native](https://reactnative.dev/docs/getting-started). Vérifier la compatibilité des librairies avec **ta** version de React Native (ex. 0.81 pour Expo SDK 54).
- **Expo** : le projet `mobile/` utilise Expo SDK 54 ; les paquets doivent être compatibles avec ce SDK (et donc avec la version de React Native fournie par Expo).

---

## 7. Résumé

| Question | Réponse |
|----------|---------|
| React Native et Rails 8 sont-ils compatibles ? | Oui, via une API HTTP/JSON. |
| Faut-il des versions précises de l’un pour l’autre ? | Non. Il faut une API Rails 8 en JSON et un client React Native qui envoie des requêtes HTTP. |
| Que vérifier en priorité ? | Contrat d’API (JSON sans clés dupliquées), authentification (token), choix de librairies compatibles React Native, et (si applicable) CORS pour le front web. |

En suivant cette doc et la checklist, tu peux valider que ton app React Native/Expo et ton backend **Ruby on Rails 8** sont bien compatibles et prêts à travailler ensemble.
