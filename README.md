# DiabetCare

## Configuration locale

Le projet supporte un fichier `.env` pour la configuration locale via `dotenv-rails`.

Variables utiles :

- `PORT` : port local de l'application, par defaut `5000`
- `DEXCOM_ENV` : `sandbox` ou `production`
- `DEXCOM_CLIENT_ID` : identifiant OAuth Dexcom
- `DEXCOM_CLIENT_SECRET` : secret OAuth Dexcom
- `DEXCOM_REDIRECT_URI` : URL de callback Dexcom, ex. `http://127.0.0.1:5000/dexcom_connection/callback`

Un fichier `.env.example` est versionne pour servir de modele, et un `.env` local
avec placeholders a ete prepare pour le developpement.
