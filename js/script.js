let jugador = 'X';
const cells = document.querySelectorAll('.celda');
const mensaje = document.getElementById('mensaje');
const puntajeJugador = document.getElementById('jugador-j');
const puntajeComputadora = document.getElementById('jugador-c');
const matriz = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let ptsJ = localStorage.getItem('ptsJ') ? parseInt(localStorage.getItem('ptsJ')) : 0;
let ptsC = localStorage.getItem('ptsC') ? parseInt(localStorage.getItem('ptsC')) : 0;

puntajeJugador.textContent = ptsJ;
puntajeComputadora.textContent = ptsC;

function click(event) {
    const cell = event.target;
    const indice = cell.getAttribute('data-index');
    const fila = Math.floor(indice / 3);
    const columnas = indice % 3;

    if (cell.textContent !== '' || ganador() || empate()) return;

    cell.textContent = jugador;
    matriz[fila][columnas] = jugador;

    if (ganador()) {
        setTimeout(() => {
            mensaje.innerHTML = (`¡${jugador} jugador ganó!`);
            if (jugador === 'X') {
                ptsJ++;
                localStorage.setItem('ptsJ', ptsJ);
                puntajeJugador.textContent = ptsJ;
            }
        });
        return;
    }

    if (empate()) {
        setTimeout(() => mensaje.innerHTML = '¡Empate!');
        return;
    }

    if (jugador === 'X') {
        jugador = 'O';
        setTimeout(jugarComputadora);
    } else {
        jugador = 'X';
    }
}

function jugarComputadora() {
    let opciones = [];
    for (let fila = 0; fila < 3; fila++) {
        for (let columnas = 0; columnas < 3; columnas++) {
            if (matriz[fila][columnas] === '') {
                opciones.push({ fila, columnas });
            }
        }
    }

    if (opciones.length === 0) return;

    const movimiento = opciones[Math.floor(Math.random() * opciones.length)];
    matriz[movimiento.fila][movimiento.columnas] = 'O';
    const cell = document.querySelector(`.celda[data-index="${movimiento.fila * 3 + movimiento.columnas}"]`);
    cell.textContent = 'O';

    if (ganador()) {
        setTimeout(() => {
            mensaje.innerHTML = '¡Ganó la computadora!';
            ptsC++;
            localStorage.setItem('ptsC', ptsC);
            puntajeComputadora.textContent = ptsC;
        }, 10);
        return;
    }

    if (empate()) {
        setTimeout(() => mensaje.innerHTML = '¡Empate!', 10);
        return;
    }

    jugador = 'X';
}

function ganador() {
    const combinaciones = [
        // filas
        [matriz[0][0], matriz[0][1], matriz[0][2]],
        [matriz[1][0], matriz[1][1], matriz[1][2]],
        [matriz[2][0], matriz[2][1], matriz[2][2]],
        // columnas
        [matriz[0][0], matriz[1][0], matriz[2][0]],
        [matriz[0][1], matriz[1][1], matriz[2][1]],
        [matriz[0][2], matriz[1][2], matriz[2][2]],
        // diagonales
        [matriz[0][0], matriz[1][1], matriz[2][2]],
        [matriz[0][2], matriz[1][1], matriz[2][0]]
    ];

    return combinaciones.some(combo => combo.every(cell => cell === jugador));
}

cells.forEach(cell => cell.addEventListener('click', click));

function empate() {
    for (let fila = 0; fila < 3; fila++) {
        for (let columnas = 0; columnas < 3; columnas++) {
            if (matriz[fila][columnas] === '') {
                return false;
            }
        }
    }
    return !ganador();
}

function reiniciar() {
    cells.forEach(cell => cell.textContent = '');
    for (let fila = 0; fila < 3; fila++) {
        for (let columnas = 0; columnas < 3; columnas++) {
            matriz[fila][columnas] = '';
        }
    }
    mensaje.innerHTML = '';
    jugador = 'X';
}

document.getElementById('boton').addEventListener('click', reiniciar);
