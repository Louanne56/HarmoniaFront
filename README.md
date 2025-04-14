#HarmoniaFront

## Installation et lancement du Frontend

```bash
# Clonez le repository frontend
git clone https://github.com/Louanne56/HarmoniaFront.git
cd HarmoniaFront
```

### Installation de Node.js (si non installé)

Ce projet a été développé avec **Node.js version 22.13.1**.  
Nous vous recommandons d'utiliser cette version pour éviter d'éventuels problèmes de compatibilité.

👉 Téléchargement : [https://nodejs.org/en/download/current](https://nodejs.org/en/download/current)

Vérifiez que Node.js et npm sont bien installés avec les commandes suivantes :

```bash
node -v
npm -v

Installez les dépendances :

```bash
npm install
```

Lancez l'application :

```bash
npm start
```

## Visualisation de l'application

Une fois que l'application frontend est lancée (`npm start`), suivez ces étapes pour la visualiser en format mobile :

1. Ouvrez les **outils de développement** de votre navigateur (généralement avec `F12` ou clic droit → *Inspecter*).
2. Activez le **mode responsive/mobile** (icône représentant un smartphone/tablette en haut de l’inspecteur).
3. Rechargez la page si nécessaire pour afficher correctement l'application dans ce format.

### Connexion 

Utilisez les identifiants suivants pour vous connecter :

- **Pseudo** : `Louanne`  
- **Mot de passe** : `MotDePasseLouanne`

## Visualisation sur mobile avec Expo Go (Android / iOS)

*(optionnel)* Si vous souhaitez tester l'application directement sur votre **smartphone**, vous pouvez utiliser **Expo Go** :

### Étapes à suivre :

1. Téléchargez **Expo Go** depuis le [Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent) ou l'[App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779).
2. Assurez-vous que votre smartphone et votre ordinateur sont connectés au **même réseau Wi-Fi**.
3. Dans le terminal de votre projet frontend, lancez Expo avec la commande :
    ```bash
    npm start
    ```
    Cela ouvrira une page dans votre navigateur avec un **QR code**.
4. Scannez ce QR code avec l'application **Expo Go** depuis votre smartphone.
5. L'application se chargera automatiquement sur votre appareil.

> 💡 Si le QR code ne fonctionne pas ou si vous êtes en environnement restreint, vous pouvez aussi utiliser l'option "Tunnel" dans la page Expo pour une meilleure compatibilité.
