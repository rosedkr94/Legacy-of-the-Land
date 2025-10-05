const pantallaInicio = document.getElementById('pantalla-inicio');
const pantallaJuego = document.getElementById('pantalla-juego');

const botonIniciar = document.getElementById('boton-iniciar');


botonIniciar.addEventListener('click', function() {

    pantallaInicio.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
})

document.getElementById('boton-iniciar').addEventListener('click', function() {
    window.location.href= 'html/narrativa.html';
})