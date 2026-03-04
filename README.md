# DiabetCare

Application de gestion du diabète. Suivi glycémique, repas (glucides + bolus), objectifs et intégration Dexcom G7.

## Prérequis

- Ruby 3.4+
- Rails 8.1+

## Installation

```bash
# Installer les dépendances (à exécuter en tant qu'utilisateur, pas root)
bundle install

# Créer et migrer la base de données
rails db:create db:migrate

# Lancer l'application
rails server
```

Ouvre http://localhost:3000

## Première utilisation

1. Créer un compte via **S'inscrire** (page de connexion)
2. Définir vos objectifs glycémiques (Paramètres / Objectifs)
3. Ajouter des glycémies et repas

## Dexcom

Pour connecter Dexcom G7 :

1. Créer une app sur [developer.dexcom.com](https://developer.dexcom.com/)
2. Configurer la redirect URI : `http://localhost:3000/dexcom/callback`
3. Définir les variables d'environnement :
   - `DEXCOM_CLIENT_ID`
   - `DEXCOM_CLIENT_SECRET`
   - `DEXCOM_SANDBOX=true` (pour le sandbox)

Ou ajouter dans `config/credentials.yml.enc` :
```yaml
dexcom:
  client_id: "xxx"
  client_secret: "xxx"
```

## Fonctionnalités

- **Authentification** : inscription, connexion
- **Glycémies** : saisie manuelle + import Dexcom
- **Repas** : glucides (g) et bolus insuline (U) par repas
- **Objectifs** : plage cible personnalisée (défaut 70-180 mg/dL)
- **Rapports** : courbe glycémique, temps en cible
- **RGPD** : export données, suppression compte, politique confidentialité
