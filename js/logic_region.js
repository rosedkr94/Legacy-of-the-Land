// ⚠️ RUTA CRÍTICA: Verifica que la ruta de tu JSON sea correcta
const DATA_FILE_PATH = '../assets/region.json'; 

let currentSlideIndex = 0;
let quizCompleted = false;
let currentRegionData = null; 

// =========================================================================
// 2. LÓGICA PRINCIPAL: Carga ASÍNCRONA del JSON ÚNICO
// =========================================================================

async function loadRegion() { 
    // Muestra el loading al inicio
    document.getElementById('slide-text').textContent = "Loading..."; 

    try {
        // 1. FETCH: Carga el JSON 
        const response = await fetch(DATA_FILE_PATH); 
        
        if (!response.ok) {
            document.getElementById('slide-text').textContent = `ERROR: No se cargó el archivo. Código ${response.status}. Revisa la ruta.`;
            return;
        }

        // 2. PARSE: La data cargada es directamente nuestro objeto de región
        currentRegionData = await response.json(); 
        
        if (currentRegionData) {
            // 3. Ejecuta el juego
            applyStyles(currentRegionData);
            showSlide(currentRegionData.slides[currentSlideIndex]);
            document.getElementById('next-slide-btn').addEventListener('click', handleNextSlide);
        }

    } catch (error) {
        document.getElementById('slide-text').textContent = "ERROR CRÍTICO. Sintaxis mala en el JSON.";
        console.error("Error en la carga o el JSON:", error);
    }
}

// =========================================================================
// 3. FUNCIONES DE INYECCIÓN DE ESTILOS Y CONTENIDO
// =========================================================================

function applyStyles(data) {
    // Inyección de Colores y Fondo
    document.documentElement.style.setProperty('--region-theme-color', data.themeColor);
    document.documentElement.style.setProperty('--region-secondary-color', data.secondaryColor);
    document.documentElement.style.setProperty('--region-bg-url', `url('${data.backgroundUrl}')`);
}


function handleNextSlide() {
    if (!currentRegionData) return;
    
    if (currentSlideIndex < currentRegionData.slides.length - 1) {
        currentSlideIndex++;
        showSlide(currentRegionData.slides[currentSlideIndex]);
    } else {
        // Pasa al Quiz
        
        // 🛑 CORRECCIÓN: Ocultamos solo los elementos de narrativa
        document.getElementById('narrative-area').classList.add('oculto');
        document.getElementById('evidence-area').classList.add('oculto'); 
        document.getElementById('control-buttons').classList.add('oculto');
        
        // Nos aseguramos que el contenedor principal esté visible
        document.getElementById('slide-content-area').classList.remove('oculto'); 

        showQuiz(currentRegionData.quiz);
    }
}

function showSlide(slide) {
    // 1. Ocultar quiz y controlar evidencia
    document.getElementById('quiz-area').classList.add('oculto');
    const evidenceArea = document.getElementById('evidence-area');
    evidenceArea.classList.toggle('oculto', slide.type !== 'evidence');
    
    // 2. Inyectar texto (mostrando el área de narrativa)
    document.getElementById('narrative-area').classList.remove('oculto');
    document.getElementById('slide-text').textContent = slide.text;
    
    // 3. Controlar botón
    const nextBtn = document.getElementById('next-slide-btn');
    nextBtn.classList.remove('oculto'); 
    if (slide.type === 'quiz_prompt') {
        nextBtn.textContent = "Quiz Time!";
    } else {
        nextBtn.textContent = "Next";
    }
    
    // 4. Inyectar evidencia
    if (slide.type === 'evidence') {
        document.getElementById('dynamic-evidence').src = slide.dynamicContent;
    }
    
    // 5. Asegurar visibilidad del área principal y controles
    document.getElementById('slide-content-area').classList.remove('oculto');
    document.getElementById('control-buttons').classList.remove('oculto');
}

// =========================================================================
// 4. FUNCIONES DE QUIZ
// =========================================================================

function showQuiz(quizData) {
    // 🛑 CORRECCIÓN: Asegura que el área del quiz se muestre (sin ocultar el padre)
    document.getElementById('quiz-area').classList.remove('oculto');
    
    document.getElementById('quiz-question').textContent = quizData.question;
    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.innerHTML = ''; 

    quizData.options.forEach((optionText, index) => {
        const button = document.createElement('button');
        button.className = 'btn quiz-option-btn';
        button.textContent = optionText;
        button.onclick = () => checkAnswer(index, quizData);
        optionsDiv.appendChild(button);
    });
}

function checkAnswer(selectedIndex, quizData) {
    if (quizCompleted) return; 
    quizCompleted = true;

    const options = document.querySelectorAll('.quiz-option-btn');
    options.forEach((btn, index) => {
        btn.disabled = true;
        if (index === quizData.correctAnswerIndex) {
            btn.classList.add('correct-answer');
        } else if (index === selectedIndex) {
            btn.classList.add('wrong-answer');
        }
    });

    const resultText = selectedIndex === quizData.correctAnswerIndex ? quizData.winMessage : quizData.loseMessage;
    const nextAction = selectedIndex === quizData.correctAnswerIndex ? quizData.winAction : quizData.loseAction;

    setTimeout(() => {
        document.getElementById('quiz-area').innerHTML = `<p class="result-message">${resultText}</p>`;
        
        const finishBtn = document.createElement('button');
        finishBtn.className = 'btn finish-btn';
        finishBtn.textContent = "Mission Complete";
        finishBtn.onclick = () => finishRegion(nextAction);
        
        document.getElementById('quiz-area').appendChild(finishBtn);

    }, 1500);
}

function finishRegion(action) {
    if (action === "return_to_selection") {
        window.location.href = '../html/seleccion.html';
    } else if (action === "return_to_main_menu") {
        window.location.href = '../index.html';
    }
}

// --- INICIO DE LA APLICACIÓN ---
window.onload = loadRegion;