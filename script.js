const trump = document.querySelector('.trump');
const pato = document.querySelector('.pato');
const nuvem = document.querySelector('.nuvem');
const gameOver = document.querySelector('.game-over');
const restartButton = document.querySelector('.restart');
const contador = document.querySelector('#contador');

let loop;
let contadorPulos = 0;

const pulo = () => {
    if (!trump.classList.contains('pulo') && !trump.classList.contains('morto')) {
        trump.classList.add('pulo');
        contadorPulos++;
        contador.textContent = contadorPulos;
        setTimeout(() => { 
            trump.classList.remove('pulo');
        }, 650);
    }
}

const checkCollision = () => {
    const trumpRect = trump.getBoundingClientRect();
    const patoRect = pato.getBoundingClientRect();

    const paddingX = 25; 
    const paddingY = 15;

    const hitX = trumpRect.right - paddingX > patoRect.left + paddingX && 
                 trumpRect.left + paddingX < patoRect.right - paddingX;
    
    const hitY = trumpRect.bottom - paddingY > patoRect.top + paddingY && 
                 trumpRect.top + paddingY < patoRect.bottom - paddingY;

    if (hitX && hitY) {
        const patoLeft = window.getComputedStyle(pato).left;
        const trumpBottom = window.getComputedStyle(trump).bottom;
        const nuvemLeft = window.getComputedStyle(nuvem).left;

        pato.style.animation = 'none';
        pato.style.left = patoLeft;

        trump.style.animation = 'none';
        trump.style.bottom = trumpBottom;
        trump.classList.add('morto');

        nuvem.style.animation = 'none';
        nuvem.style.left = nuvemLeft;

        gameOver.style.visibility = 'visible';
        clearInterval(loop);
    }
};

const restart = () => {
    gameOver.style.visibility = 'hidden';
    
    contadorPulos = 0;
    contador.textContent = contadorPulos;

    pato.style.left = '';
    pato.style.animation = 'pato-animacao 1.5s infinite linear';

    trump.classList.remove('morto');
    trump.style.animation = '';
    trump.style.bottom = '35px';

    nuvem.style.left = '';
    nuvem.style.animation = 'nuvem-animacao 25s infinite linear';

    clearInterval(loop);
    loop = setInterval(checkCollision, 10);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        pulo();
    }
});
document.addEventListener('touchstart', pulo);
restartButton.addEventListener('click', restart);

loop = setInterval(checkCollision, 10);