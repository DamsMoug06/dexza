// Configuration et variables globales
let pokemonData = [];
let caughtPokemon = new Set();
const STORAGE_KEY = 'shinyDexProgress';

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadPokemonData();
    loadProgress();
    initializeEventListeners();
});

// Charger les données des Pokémon
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

// Charger la progression depuis localStorage
function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const savedIds = JSON.parse(saved);
            caughtPokemon = new Set(savedIds);
        } catch (error) {
            console.error('Erreur lors du chargement de la progression:', error);
            caughtPokemon = new Set();
        }
    }
}

// Sauvegarder la progression
function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...caughtPokemon]));
}

// Initialiser les écouteurs d'événements
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

// Fonction debounce pour optimiser la recherche
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

// Afficher les Pokémon
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

    // Ajouter les écouteurs de clic sur les cartes
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

// Basculer l'état d'un Pokémon (capturé/non capturé)
function togglePokemon(id) {
    if (caughtPokemon.has(id)) {
        caughtPokemon.delete(id);
    } else {
        caughtPokemon.add(id);
        // Effet sonore ou animation si besoin
        celebrateCapture(id);
    }
    
    saveProgress();
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

// Célébrer une capture
function celebrateCapture(id) {
    const card = document.querySelector(`[data-id="${id}"]`);
    if (card) {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = 'fadeIn 0.5s ease-out';
        }, 10);
    }
}

// Mettre à jour les statistiques
function updateStats() {
    const total = pokemonData.length;
    const caught = caughtPokemon.size;
    const percentage = total > 0 ? Math.round((caught / total) * 100) : 0;

    document.getElementById('caught-count').textContent = caught;
    document.getElementById('percentage').textContent = `${percentage}%`;
    
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${percentage}%`;
}

// Filtrer les Pokémon
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

// Réinitialiser la progression
function resetProgress() {
    const confirmed = confirm(
        '⚠️ Êtes-vous sûr de vouloir réinitialiser toute votre progression ?\n\n' +
        'Cette action est irréversible et supprimera tous vos Pokémon capturés.'
    );

    if (confirmed) {
        caughtPokemon.clear();
        saveProgress();
        renderPokemon();
        updateStats();
        
        // Message de confirmation
        alert('✅ Progression réinitialisée avec succès !');
    }
}

// Afficher une erreur
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

// Export des données (bonus - pour sauvegarder ailleurs)
function exportProgress() {
    const data = {
        date: new Date().toISOString(),
        total: pokemonData.length,
        caught: caughtPokemon.size,
        percentage: Math.round((caughtPokemon.size / pokemonData.length) * 100),
        pokemonIds: [...caughtPokemon]
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `shiny-dex-progress-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Import des données (bonus - pour restaurer une sauvegarde)
function importProgress(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.pokemonIds && Array.isArray(data.pokemonIds)) {
                caughtPokemon = new Set(data.pokemonIds);
                saveProgress();
                renderPokemon();
                updateStats();
                alert('✅ Progression importée avec succès !');
            } else {
                throw new Error('Format de fichier invalide');
            }
        } catch (error) {
            alert('❌ Erreur lors de l\'import : ' + error.message);
        }
    };
    reader.readAsText(file);
}

// Raccourcis clavier (bonus)
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K pour focus sur la recherche
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input').focus();
    }
    
    // Ctrl/Cmd + R pour réinitialiser (avec confirmation)
    if ((e.ctrlKey || e.metaKey) && e.key === 'r' && e.shiftKey) {
        e.preventDefault();
        resetProgress();
    }
});

// Détection de changements multi-onglets
window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
        loadProgress();
        renderPokemon();
        updateStats();
    }
});

console.log('🎮 Shiny Dex Multi initialisé !');
console.log('💡 Astuce : Ctrl/Cmd + K pour rechercher rapidement');

