# ✨ Shiny Dex Multi - Challenge Pokémon Chromatiques

Un Pokédex interactif et moderne pour suivre votre collection de Pokémon chromatiques (shiny) dans votre challenge multijoueur !

## 🌐 VERSION PROGRESSION COMMUNE

**NOUVEAU !** Ce Shiny Dex utilise Firebase pour une **progression synchronisée en temps réel** :
- ✅ Tous les joueurs partagent la même progression
- ✅ Les captures apparaissent instantanément pour tout le monde
- ✅ Synchronisation automatique entre tous les appareils
- ✅ Sauvegarde sécurisée dans le cloud

> 📖 **[Guide de configuration Firebase détaillé](FIREBASE_SETUP.md)** - 5 minutes pour configurer !

## 🎮 Fonctionnalités

### 📊 Suivi de Progression
- **230 Pokémon** à collectionner
- Barre de progression en temps réel
- Pourcentage de complétion
- Sauvegarde automatique dans le navigateur

### 🔍 Filtres et Recherche
- **Recherche rapide** par nom (français/anglais) ou numéro
- **Filtre par type** (18 types de Pokémon)
- **Filtre par statut** (capturés/non capturés)
- Raccourci clavier : `Ctrl/Cmd + K` pour rechercher

### 🎨 Interface Moderne
- Design inspiré de l'univers Pokémon
- Animations fluides et interactives
- Badges de types colorés
- Indicateurs visuels pour les Pokémon capturés
- Responsive (adapté mobile et tablette)

### 💾 Gestion des Données
- Sauvegarde automatique locale (localStorage)
- Synchronisation multi-onglets
- Bouton de réinitialisation (avec confirmation)
- Export/Import de progression (bonus dans le code)

## 🚀 Installation et Utilisation

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Un compte Google (pour Firebase - gratuit)
- Les fichiers doivent être sur un serveur web (même local)

### ⚡ Configuration Rapide Firebase

**🔥 IMPORTANT** : Pour activer la synchronisation multi-joueurs, suivez le guide :
👉 **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** 👈

Sans configuration Firebase, le site fonctionnera en mode local uniquement (chacun a sa propre progression).

### Méthode 1 : Serveur local simple

#### Avec Python 3 :
```bash
# Dans le dossier du projet
python -m http.server 8000
```
Puis ouvrez : http://localhost:8000

#### Avec Node.js (npx) :
```bash
# Dans le dossier du projet
npx serve
```

#### Avec PHP :
```bash
php -S localhost:8000
```

### Méthode 2 : Extension Live Server (VS Code)
1. Installez l'extension "Live Server" dans VS Code
2. Clic droit sur `index.html` → "Open with Live Server"

### Méthode 3 : Double-clic (peut ne pas fonctionner)
⚠️ Le double-clic sur `index.html` peut ne pas fonctionner à cause des restrictions CORS lors du chargement du fichier JSON. Utilisez plutôt un serveur local.

## 📁 Structure des Fichiers

```
Shiny Dex Multi/
├── index.html          # Page principale
├── style.css           # Styles et animations
├── script.js           # Logique et interactions
├── pokemon_data.json   # Base de données des 230 Pokémon
├── liste_pokemon.txt   # Liste originale (référence)
└── README.md           # Ce fichier
```

## 🎯 Comment Utiliser

### 🌐 Mode Multi-Joueurs (avec Firebase configuré)

**Quand quelqu'un capture un Pokémon** :
1. Il clique sur la carte du Pokémon
2. La carte se met en surbrillance dorée ✨
3. **TOUS les joueurs** voient la capture instantanément !
4. Le compteur se met à jour pour tout le monde

**Vérifier que Firebase fonctionne** :
- Ouvrez la console du navigateur (F12)
- Vous devriez voir : `🔥 Firebase connecté - Mode synchronisé`
- Testez avec 2 navigateurs ouverts sur le site

### 💾 Mode Local (sans Firebase)

Si Firebase n'est pas configuré :
- Chacun a sa propre progression
- Sauvegarde dans le navigateur (localStorage)
- Ne se synchronise pas entre les joueurs

### Marquer un Pokémon comme capturé
1. Cliquez simplement sur la carte du Pokémon
2. La carte se met en surbrillance dorée ✨
3. Le compteur se met à jour automatiquement

### Rechercher un Pokémon
- Tapez dans la barre de recherche
- Recherche par nom français, anglais ou numéro
- Raccourci : `Ctrl/Cmd + K`

### Filtrer par Type
- Utilisez le menu déroulant "Tous les types"
- Sélectionnez le type souhaité
- La grille se met à jour instantanément

### Voir uniquement les Pokémon capturés/non capturés
- Utilisez le filtre "Statut"
- Choisissez "Capturés" ou "Non capturés"

### Réinitialiser la Progression
- Cliquez sur le bouton "🔄 Réinitialiser"
- Confirmez votre choix
- ⚠️ Cette action est irréversible !

## 🎨 Couleurs des Types

| Type       | Couleur    |
|------------|------------|
| Normal     | #A8A77A    |
| Feu        | #EE8130    |
| Eau        | #6390F0    |
| Plante     | #7AC74C    |
| Électrik   | #F7D02C    |
| Glace      | #96D9D6    |
| Combat     | #C22E28    |
| Poison     | #A33EA1    |
| Sol        | #E2BF65    |
| Vol        | #A98FF3    |
| Psy        | #F95587    |
| Insecte    | #A6B91A    |
| Roche      | #B6A136    |
| Spectre    | #735797    |
| Dragon     | #6F35FC    |
| Ténèbres   | #705746    |
| Acier      | #B7B7CE    |
| Fée        | #D685AD    |

## 🔧 Personnalisation

### Modifier les données Pokémon
Éditez le fichier `pokemon_data.json` :
```json
{
  "id": 1,
  "numero": 152,
  "nom": "Germignon",
  "nomEn": "Chikorita",
  "types": ["plante"],
  "location": "Zone sauvage nº 20"
}
```

### Modifier les couleurs
Éditez les variables CSS dans `style.css` :
```css
:root {
    --primary-red: #EE1515;
    --primary-blue: #3B4CCA;
    --primary-yellow: #FFDE00;
}
```

## 💡 Astuces et Raccourcis

- `Ctrl/Cmd + K` : Focus sur la recherche
- `Ctrl/Cmd + Shift + R` : Réinitialiser (avec confirmation)
- La progression est automatiquement sauvegardée
- Fonctionne hors ligne une fois chargé
- Compatible multi-onglets (synchronisation automatique)

## 🐛 Dépannage

### 🔥 Problèmes Firebase

#### "Firebase non configuré - Mode local uniquement"
- Vous devez configurer Firebase pour la synchronisation
- Suivez le guide : [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
- Remplacez les valeurs `VOTRE_API_KEY` dans `script.js`

#### Les captures ne se synchronisent pas entre les joueurs
1. Vérifiez que Firebase est bien configuré (voir console F12)
2. Vérifiez les règles Firestore (voir [FIREBASE_SETUP.md](FIREBASE_SETUP.md))
3. Attendez 5-10 secondes pour la première synchronisation
4. Vérifiez votre connexion internet

#### "Permission denied" ou erreur Firestore
- Les règles de sécurité Firestore ne sont pas correctes
- Allez dans Firebase Console > Firestore Database > Règles
- Utilisez les règles du guide [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

### 📁 Problèmes Généraux

#### Le fichier JSON ne se charge pas
- Assurez-vous d'utiliser un serveur local (pas de double-clic sur index.html)
- Vérifiez que `pokemon_data.json` est dans le même dossier
- Ouvrez la console du navigateur (F12) pour voir les erreurs

#### La progression ne se sauvegarde pas (mode local)
- Vérifiez que localStorage est activé dans votre navigateur
- Mode privé/incognito peut désactiver localStorage
- Essayez de vider le cache du navigateur

#### L'affichage est cassé
- Actualisez la page (F5 ou Ctrl+R)
- Vérifiez que tous les fichiers sont présents (`index.html`, `style.css`, `script.js`, `pokemon_data.json`)
- Testez dans un autre navigateur
- Videz le cache (Ctrl+Shift+Delete)

## 📱 Compatibilité

✅ Chrome/Edge (recommandé)
✅ Firefox
✅ Safari
✅ Mobile iOS
✅ Mobile Android

## 🎉 Crédits

- Données Pokémon basées sur votre liste personnalisée
- Design inspiré de l'univers Pokémon officiel
- Police : Poppins (Google Fonts)

## 📝 Notes

- Les données sont stockées localement dans votre navigateur
- Aucune connexion internet n'est requise après le premier chargement
- Vos données ne sont pas partagées ou envoyées ailleurs

---

**Bon courage pour compléter votre Shiny Dex ! 🍀✨**

