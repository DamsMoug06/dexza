// ============================================
// SHINY DEX MULTI - VERSION PROGRESSION COMMUNE
// Synchronisation en temps réel avec Firebase
// ============================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, doc, setDoc, onSnapshot, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// ============================================
// CONFIGURATION FIREBASE
// ============================================
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialisation Firebase
let app, db;
let isFirebaseConfigured = false;

try {
    // Vérifier si la config est valide
    if (firebaseConfig.apiKey !== "VOTRE_API_KEY") {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        isFirebaseConfigured = true;
        console.log('🔥 Firebase connecté - Mode synchronisé');
    } else {
        console.warn('⚠️ Firebase non configuré - Mode local uniquement');
        console.log('📖 Consultez le README.md pour configurer Firebase');
    }
} catch (error) {
    console.error('❌ Erreur Firebase:', error);
    console.log('📖 Vérifiez votre configuration Firebase');
}

// ============================================
// VARIABLES GLOBALES
// ============================================
let pokemonData = [];
let caughtPokemon = new Set();
const STORAGE_KEY = 'shinyDexProgress';
const FIREBASE_DOC_ID = 'shared-progress'; // Document unique pour la progression commune

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadPokemonData();
    initializeEventListeners();
    
    if (isFirebaseConfigured) {
        setupFirebaseListener();
    } else {
        loadLocalProgress();
    }
});

// ============================================
// CHARGEMENT DES DONNÉES POKÉMON
// ============================================
async function loadPokemonData() {
    try {
        const response = await fetch('pokemon_data.json');
        pokemonData = await response.json();
        renderPokemon();
        updateStats();
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        showError();
    }
}

// ============================================
// FIREBASE - SYNCHRONISATION TEMPS RÉEL
// ============================================

// Écouter les changements en temps réel
function setupFirebaseListener() {
    const docRef = doc(db, 'shinyDex', FIREBASE_DOC_ID);
    
    // Écouter les mises à jour en temps réel
    onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.caughtPokemon) {
                caughtPokemon = new Set(data.caughtPokemon);
                renderPokemon();
                updateStats();
                console.log('🔄 Progression synchronisée');
            }
        } else {
            // Premier lancement - créer le document
            console.log('📝 Création du document de progression commune');
            saveToFirebase();
        }
    }, (error) => {
        console.error('❌ Erreur de synchronisation:', error);
        showConnectionError();
    });
}

// Sauvegarder dans Firebase
async function saveToFirebase() {
    if (!isFirebaseConfigured) {
        saveLocalProgress();
        return;
    }

    try {
        const docRef = doc(db, 'shinyDex', FIREBASE_DOC_ID);
        await setDoc(docRef, {
            caughtPokemon: [...caughtPokemon],
            lastUpdate: new Date().toISOString(),
            totalPokemon: pokemonData.length
        }, { merge: true });
        
        console.log('✅ Progression sauvegardée');
    } catch (error) {
        console.error('❌ Erreur de sauvegarde:', error);
        // Fallback vers localStorage
        saveLocalProgress();
    }
}

// ============================================
// FALLBACK - SAUVEGARDE LOCALE
// ============================================

function loadLocalProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const savedIds = JSON.parse(saved);
            caughtPokemon = new Set(savedIds);
            renderPokemon();
            updateStats();
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            caughtPokemon = new Set();
        }
    }
}

function saveLocalProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...caughtPokemon]));
}

// ============================================
// ÉVÉNEMENTS
// ============================================
function initializeEventListeners() {
    // Recherche
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', debounce(filterPokemon, 300));

    // Filtres
    const typeFilter = document.getElementById('type-filter');
    const statusFilter = document.getElementById('status-filter');
    typeFilter.addEventListener('change', filterPokemon);
    statusFilter.addEventListener('change', filterPokemon);

    // Bouton réinitialiser
    const resetBtn = document.getElementById('reset-btn');
    resetBtn.addEventListener('click', resetProgress);
}

// Fonction debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// AFFICHAGE DES POKÉMON
// ============================================
function renderPokemon(filteredData = pokemonData) {
    const grid = document.getElementById('pokemon-grid');
    
    if (filteredData.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">😢</div>
                <p class="empty-state-text">Aucun Pokémon trouvé</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredData.map(pokemon => createPokemonCard(pokemon)).join('');

    // Ajouter les écouteurs de clic
    document.querySelectorAll('.pokemon-card').forEach(card => {
        card.addEventListener('click', () => togglePokemon(parseInt(card.dataset.id)));
    });
}

// Créer une carte Pokémon
function createPokemonCard(pokemon) {
    const isCaught = caughtPokemon.has(pokemon.id);
    const types = pokemon.types.map(type => 
        `<span class="type-badge type-${type}">${type}</span>`
    ).join('');

    return `
        <div class="pokemon-card ${isCaught ? 'caught' : ''}" data-id="${pokemon.id}">
            <div class="card-header">
                <span class="pokemon-number">#${String(pokemon.numero).padStart(3, '0')}</span>
                <span class="shiny-indicator">✨</span>
            </div>
            <div class="card-body">
                <h2 class="pokemon-name">${pokemon.nom}</h2>
                <p class="pokemon-name-en">${pokemon.nomEn}</p>
                <div class="pokemon-types">
                    ${types}
                </div>
            </div>
            <div class="card-footer">
                <p class="pokemon-location">📍 ${pokemon.location}</p>
            </div>
        </div>
    `;
}

// ============================================
// GESTION DES CAPTURES
// ============================================
function togglePokemon(id) {
    if (caughtPokemon.has(id)) {
        caughtPokemon.delete(id);
    } else {
        caughtPokemon.add(id);
        celebrateCapture(id);
    }
    
    // Sauvegarder (Firebase ou local)
    saveToFirebase();
    
    // Mise à jour immédiate de l'interface
    updateCardState(id);
    updateStats();
}

// Mettre à jour l'état visuel d'une carte
function updateCardState(id) {
    const card = document.querySelector(`[data-id="${id}"]`);
    if (card) {
        if (caughtPokemon.has(id)) {
            card.classList.add('caught');
        } else {
            card.classList.remove('caught');
        }
    }
}

// Animation de capture
function celebrateCapture(id) {
    const card = document.querySelector(`[data-id="${id}"]`);
    if (card) {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = 'fadeIn 0.5s ease-out';
        }, 10);
    }
}

// ============================================
// STATISTIQUES
// ============================================
function updateStats() {
    const total = pokemonData.length;
    const caught = caughtPokemon.size;
    const percentage = total > 0 ? Math.round((caught / total) * 100) : 0;

    document.getElementById('caught-count').textContent = caught;
    document.getElementById('percentage').textContent = `${percentage}%`;
    
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${percentage}%`;
}

// ============================================
// FILTRES
// ============================================
function filterPokemon() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const typeFilter = document.getElementById('type-filter').value;
    const statusFilter = document.getElementById('status-filter').value;

    let filtered = pokemonData.filter(pokemon => {
        // Filtre de recherche
        const matchesSearch = 
            pokemon.nom.toLowerCase().includes(searchTerm) ||
            pokemon.nomEn.toLowerCase().includes(searchTerm) ||
            pokemon.numero.toString().includes(searchTerm);

        // Filtre de type
        const matchesType = 
            typeFilter === 'all' || 
            pokemon.types.includes(typeFilter);

        // Filtre de statut
        let matchesStatus = true;
        if (statusFilter === 'caught') {
            matchesStatus = caughtPokemon.has(pokemon.id);
        } else if (statusFilter === 'uncaught') {
            matchesStatus = !caughtPokemon.has(pokemon.id);
        }

        return matchesSearch && matchesType && matchesStatus;
    });

    renderPokemon(filtered);
}

// ============================================
// RÉINITIALISATION
// ============================================
async function resetProgress() {
    const mode = isFirebaseConfigured ? 'partagée' : 'locale';
    const confirmed = confirm(
        `⚠️ ATTENTION : Vous allez réinitialiser la progression ${mode} !\n\n` +
        (isFirebaseConfigured ? 
            '🌐 Cela affectera TOUS les joueurs du challenge !\n\n' : 
            '💾 Cela ne réinitialisera que votre progression locale.\n\n') +
        'Cette action est irréversible. Continuer ?'
    );

    if (confirmed) {
        caughtPokemon.clear();
        
        if (isFirebaseConfigured) {
            await saveToFirebase();
        } else {
            saveLocalProgress();
        }
        
        renderPokemon();
        updateStats();
        alert('✅ Progression réinitialisée !');
    }
}

// ============================================
// GESTION DES ERREURS
// ============================================
function showError() {
    const grid = document.getElementById('pokemon-grid');
    grid.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">❌</div>
            <p class="empty-state-text">
                Erreur lors du chargement des données.<br>
                Veuillez vérifier que le fichier pokemon_data.json est présent.
            </p>
        </div>
    `;
}

function showConnectionError() {
    console.error('Problème de connexion Firebase');
    // Optionnel : afficher une notification à l'utilisateur
}

// ============================================
// RACCOURCIS CLAVIER
// ============================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K pour focus sur la recherche
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input').focus();
    }
});

// ============================================
// MESSAGES DE DÉMARRAGE
// ============================================
console.log('🎮 Shiny Dex Multi - Progression Commune');
if (isFirebaseConfigured) {
    console.log('🔥 Mode synchronisé activé');
    console.log('🌐 Tous les joueurs partagent la même progression');
} else {
    console.log('💾 Mode local (Firebase non configuré)');
    console.log('📖 Consultez le README.md pour activer la synchronisation');
}
console.log('💡 Astuce : Ctrl/Cmd + K pour rechercher rapidement');
