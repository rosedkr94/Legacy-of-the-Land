// Obtener elementos del DOM
const modal = document.getElementById('game-modal');
const modalContent = document.querySelector('.modal-content');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close-button');
const cards = document.querySelectorAll('.card');

// Cargar datos de regiones desde el archivo JSON
let regions;

async function fetchRegionsData() {
    try {
        const response = await fetch('../assets/data.json'); 
        const data = await response.json();
        regions = data.regions;
        
        addCardEventListeners();
    } catch (error) {
        console.error('Error al cargar los datos de las regiones:', error);
    }
}

function addCardEventListeners() {
    // Función para mostrar el modal con el contenido y estilo de la región
    function showModal(regionKey) {
        const region = regions[regionKey];
        if (region) {
            modalContent.style.border = region.border;
            modalBody.innerHTML = `
                <div class="modal-card">
                    <h3 style="color: ${region.color}">${region.title}</h3>
                    <p>${region.description}</p>
                    <p class="hero">${region.hero}</p>
                    <button class="modal-button" style="${region.buttonColor}">${region.buttonText}</button>
                </div>
            `;
            modal.style.display = 'flex';
            const modalButton = modalBody.querySelector('.modal-button');
            modalButton.addEventListener('click', () => {
                if (regionKey === 'north') {
                    window.location.href = '../html/north.html'; 
                } else if (regionKey === 'central') {
                    window.location.href = '../html/central.html'; 
                } else if (regionKey === 'south') {
                    window.location.href = '../html/south.html'; 
                }
            });
        }
    }

    // Escuchar clics en las tarjetas
    cards.forEach(card => {
        card.addEventListener('click', (event) => {
            const cardId = event.currentTarget.id;
            let regionKey = '';
            if (cardId === 'card-north') {
                regionKey = 'north';
            } else if (cardId === 'card-central') {
                regionKey = 'central';
            } else if (cardId === 'card-south') {
                regionKey = 'south';
            }
            showModal(regionKey);
        });
    });

    // Cerrar el modal al hacer clic en el botón de cerrar
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar el modal al hacer clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
} // <-- Correcto cierre de la función addCardEventListeners

// Iniciar la carga de los datos
fetchRegionsData();