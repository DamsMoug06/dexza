# 🔥 Configuration Firebase pour Shiny Dex Multi

Ce guide vous explique comment configurer Firebase pour avoir une **progression commune synchronisée en temps réel** entre tous les joueurs.

## 📋 Prérequis

- Un compte Google (gratuit)
- 5 minutes de votre temps ⏱️

---

## 🚀 Étape 1 : Créer un projet Firebase

1. **Allez sur** [Firebase Console](https://console.firebase.google.com/)

2. **Cliquez sur** "Ajouter un projet" ou "Create a project"

3. **Nommez votre projet** : 
   - Par exemple : `shiny-dex-multi`
   - Cliquez sur "Continuer"

4. **Google Analytics** (optionnel) :
   - Vous pouvez désactiver si vous voulez
   - Cliquez sur "Créer le projet"

5. **Attendez** que Firebase crée votre projet (30 secondes)

6. **Cliquez sur** "Continuer"

---

## 🌐 Étape 2 : Configurer une application Web

1. **Sur la page d'accueil du projet**, cliquez sur l'icône **Web** `</>`
   - Elle se trouve sous "Commencer en ajoutant Firebase à votre application"

2. **Enregistrez votre application** :
   - Nom de l'application : `Shiny Dex Multi`
   - ⚠️ **NE COCHEZ PAS** "Firebase Hosting" (on utilise Vercel)
   - Cliquez sur "Enregistrer l'application"

3. **Copiez la configuration** :
   - Vous verrez un code JavaScript qui ressemble à ça :
   
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "shiny-dex-multi.firebaseapp.com",
     projectId: "shiny-dex-multi",
     storageBucket: "shiny-dex-multi.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```

4. **⚠️ GARDEZ CETTE FENÊTRE OUVERTE** (vous en aurez besoin à l'étape 4)

5. Cliquez sur "Continuer vers la console"

---

## 🗄️ Étape 3 : Activer Firestore Database

1. **Dans le menu de gauche**, cliquez sur **"Firestore Database"**

2. **Cliquez sur** "Créer une base de données"

3. **Mode de sécurité** :
   - Choisissez **"Démarrer en mode test"** 
   - ⚠️ Important pour que ça fonctionne facilement
   - Cliquez sur "Suivant"

4. **Emplacement** :
   - Choisissez votre région (ex: `europe-west` pour l'Europe)
   - Cliquez sur "Activer"

5. **Attendez** que Firestore soit activé (30 secondes)

---

## ⚙️ Étape 4 : Configurer les règles de sécurité

1. **Dans Firestore**, cliquez sur l'onglet **"Règles"** (en haut)

2. **Remplacez** le contenu par ce code :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Collection shinyDex accessible en lecture/écriture par tous
    match /shinyDex/{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. **Cliquez sur** "Publier"

> ⚠️ **Note de sécurité** : Ces règles permettent à tout le monde de lire/écrire. C'est parfait pour un challenge entre amis, mais pas pour une app publique. Pour une meilleure sécurité, ajoutez l'authentification Firebase plus tard.

---

## 📝 Étape 5 : Insérer la configuration dans votre code

1. **Ouvrez** le fichier `script.js` de votre projet

2. **Trouvez** ces lignes (vers le début du fichier) :

```javascript
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
    projectId: "VOTRE_PROJECT_ID",
    storageBucket: "VOTRE_PROJECT_ID.appspot.com",
    messagingSenderId: "VOTRE_SENDER_ID",
    appId: "VOTRE_APP_ID"
};
```

3. **Remplacez** avec VOTRE configuration copiée à l'étape 2

4. **Exemple** de ce que ça doit donner :

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyABC123xyz789def456ghi",
    authDomain: "shiny-dex-multi.firebaseapp.com",
    projectId: "shiny-dex-multi",
    storageBucket: "shiny-dex-multi.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456"
};
```

5. **Sauvegardez** le fichier

---

## 🚀 Étape 6 : Déployer sur Vercel

1. **Commitez** vos changements :
```bash
git add .
git commit -m "Configuration Firebase pour progression commune"
git push
```

2. **Vercel** va automatiquement redéployer votre site

3. **Attendez** 1-2 minutes que le déploiement soit terminé

4. **Testez** : Ouvrez le site sur deux navigateurs différents
   - Capturez un Pokémon sur le premier
   - Il devrait apparaître automatiquement sur le deuxième ! ✨

---

## ✅ Vérification

Pour vérifier que tout fonctionne :

1. **Ouvrez la console du navigateur** (F12)

2. Vous devriez voir :
   ```
   🔥 Firebase connecté - Mode synchronisé
   🌐 Tous les joueurs partagent la même progression
   ```

3. **Capturez un Pokémon** → Il devrait se sauvegarder

4. **Ouvrez un autre navigateur** (ou mode incognito) avec le même site
   - Vous devriez voir le même Pokémon capturé !

---

## 🐛 Dépannage

### ❌ Erreur : "Firebase non configuré"
- Vérifiez que vous avez bien remplacé `"VOTRE_API_KEY"` par votre vraie clé
- Les guillemets doivent rester : `apiKey: "votre-vraie-clé"`

### ❌ Erreur : "Permission denied"
- Vérifiez les règles Firestore (Étape 4)
- Elles doivent contenir `allow read, write: if true;`

### ❌ La synchronisation ne fonctionne pas
- Ouvrez la console (F12) pour voir les erreurs
- Vérifiez votre connexion internet
- Attendez 5-10 secondes pour la synchronisation

### ❌ "Error initializing Firebase"
- Vérifiez que votre configuration est correcte
- Pas d'espaces ou caractères en trop
- Format JSON respecté (virgules, guillemets)

---

## 💡 Astuces

### Voir les données en direct
1. Allez dans **Firebase Console** > **Firestore Database**
2. Cliquez sur **"Données"**
3. Vous verrez la collection `shinyDex` avec le document `shared-progress`
4. Les captures s'affichent en temps réel !

### Réinitialiser la progression
- Utilisez le bouton "🔄 Réinitialiser" sur le site
- ⚠️ Cela supprimera la progression pour TOUT LE MONDE

### Sauvegarder la progression
1. Dans Firestore Database > Données
2. Cliquez sur le document `shared-progress`
3. Copiez le champ `caughtPokemon`
4. Collez-le dans un fichier texte pour backup

---

## 🎉 C'est tout !

Votre Shiny Dex est maintenant synchronisé en temps réel entre tous les joueurs ! 

Chaque fois que quelqu'un capture un Pokémon :
- ✅ Tout le monde le voit instantanément
- ✅ Sauvegarde automatique dans le cloud
- ✅ Fonctionne sur mobile et desktop
- ✅ Pas de limite de joueurs

**Bon courage pour votre challenge ! 🍀✨**

---

## 📞 Besoin d'aide ?

- [Documentation Firebase](https://firebase.google.com/docs/firestore)
- [Tutoriel vidéo Firestore](https://www.youtube.com/results?search_query=firebase+firestore+tutorial)

