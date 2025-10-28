# ⚡ Guide de Démarrage Rapide

## 🎯 Objectif
Avoir un Shiny Dex avec progression commune synchronisée entre tous les joueurs.

---

## 📋 Checklist Rapide

### ✅ Étape 1 : Créer un projet Firebase (2 min)
1. Allez sur https://console.firebase.google.com/
2. Cliquez "Ajouter un projet"
3. Nommez-le (ex: `shiny-dex-multi`)
4. Créez le projet

### ✅ Étape 2 : Ajouter une app Web (1 min)
1. Cliquez sur l'icône Web `</>`
2. Nommez l'app : `Shiny Dex Multi`
3. **COPIEZ** la configuration `firebaseConfig`
4. Ne cochez pas "Firebase Hosting"

### ✅ Étape 3 : Activer Firestore (1 min)
1. Menu gauche → "Firestore Database"
2. "Créer une base de données"
3. Mode : **"Démarrer en mode test"**
4. Choisissez votre région

### ✅ Étape 4 : Configurer les règles (30 sec)
1. Onglet "Règles" dans Firestore
2. Remplacez par :
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /shinyDex/{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. Cliquez "Publier"

### ✅ Étape 5 : Insérer la config dans le code (1 min)
1. Ouvrez `script.js`
2. Trouvez :
```javascript
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    ...
};
```
3. Remplacez par VOTRE config copiée à l'étape 2
4. Sauvegardez

### ✅ Étape 6 : Déployer (1 min)
```bash
git add .
git commit -m "Config Firebase"
git push
```

Vercel va automatiquement redéployer !

---

## 🧪 Test

1. Ouvrez le site déployé
2. Appuyez sur **F12** (console)
3. Vous devriez voir : `🔥 Firebase connecté - Mode synchronisé`
4. Capturez un Pokémon
5. Ouvrez le site dans un autre navigateur → Le Pokémon apparaît ! ✨

---

## 🆘 Problème ?

- Voir le guide détaillé : [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
- Vérifier les messages dans la console (F12)
- Erreur "Permission denied" → Vérifier les règles Firestore

---

**Temps total : ~5 minutes** ⏱️

Bon courage ! 🍀

