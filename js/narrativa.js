// La duración de cada diapositiva en milisegundos
const SLIDE_DURATION = 6000; 

const story = [
    { text: "Argentina is facing an unprecedented climate crisis...", type: 'narrative' },
    { text: "Drought and Blazes Ravage Argentine Farmlands...", type: 'narrative' },
    { text: "La Niña is expected to depart soon, but the damage could worsen with the arrival of El Niño", type: 'narrative' },
    // Esta es la diapositiva de PREGUNTA donde el flujo automático debe detenerse.
    { text: "Will you be able to save the agricultural sector using science and technology?", type: 'question' }, 
    { text: "Excellent! Science is our best weapon. Now, choose the challenge you will face...", type: 'transition' } 
];

let currentSlide = 0;

// Elementos de la narrativa dinámica
// Nota: 'narrative-slides' no es necesario en este JS, pero lo mantengo
const narrativeText = document.getElementById('narrative-text');
const controlsDiv = document.getElementById('controls'); // El div que contiene los botones
const questionBtns = document.querySelector('.question-btns');
// [1. MODIFICACIÓN]: Traemos el botón de transición final
const chooseRegionBtn = document.getElementById('choose-region-btn'); 

// --- Función para actualizar y avanzar automáticamente ---
function updateSlide() {
    
    // Al inicio de cada diapositiva, asumimos que todos los controles están ocultos
    controlsDiv.classList.add('oculto'); 
    questionBtns.classList.add('oculto');
    chooseRegionBtn.classList.add('hidden'); // Clase CSS para ocultar el botón final
    
    if (currentSlide >= story.length) {
        
        return; 
    }

    const current = story[currentSlide];
    narrativeText.textContent = current.text;
    
    
    // 2. Control de los botones y el flujo
    if (current.type === 'question') {
        // Detener el flujo automático y mostrar los botones de Sí/No
        controlsDiv.classList.remove('oculto'); 
        questionBtns.classList.remove('oculto');
        // El flujo automático se detiene aquí.

    } else if (current.type === 'transition') {
        // Mostrar el botón final ('Choose Region')
        controlsDiv.classList.remove('oculto'); 
        chooseRegionBtn.classList.remove('hidden'); 
        
        // El flujo automático se detiene aquí.

    } else {
        // Es una diapositiva de narrativa normal: avanzar automáticamente.
        
        // Avanzar automáticamente a la siguiente diapositiva después del tiempo definido
        setTimeout(() => {
            currentSlide++;
            updateSlide();
        }, SLIDE_DURATION);
    }
}

// --- Función para manejar el clic y la redirección final ---
function handleNext() {
    // Esta función solo es llamada por los botones 'Yes' y 'No'
    // que simplemente pasan a la siguiente diapositiva, sin redirección final.
    currentSlide++;
    updateSlide();
}

function handleChooseRegion() {
 
    window.location.href = 'seleccion.html'; 
}


// Event Listeners (lo que hace que los botones funcionen)
document.getElementById('yes-btn').addEventListener('click', () => {
    // Si dice SÍ, avanza a la siguiente diapositiva (la de "Excellent! Science...")
    currentSlide++;
    updateSlide();
});


document.getElementById('no-btn').addEventListener('click', () => {
    // Reemplaza '../index.html' con la URL de tu pantalla de inicio si es diferente
    window.location.href = '../index.html'; 
});
// Asociamos la función de redirección al botón final
chooseRegionBtn.addEventListener('click', handleChooseRegion);


// Iniciar la narrativa
updateSlide();