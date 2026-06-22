const player = document.querySelector('.player');
const pato = document.querySelector('.pato');
const nuvem = document.querySelector('.nuvem');
const gameOver = document.querySelector('.game-over');
const restartButton = document.querySelector('.restart');
const menuButton = document.querySelector('.menu-btn');
const contador = document.querySelector('#contador');
const charSelectScreen = document.querySelector('.char-select-screen');
const startButton = document.querySelector('.start-btn');
const charCards = document.querySelectorAll('.char-card');
const bgCards = document.querySelectorAll('.bg-card');
const gameBoard = document.querySelector('.game-board');

let loop;
let contadorPulos = 0;
let gameStarted = false;


let selectedSrc = 'trump final.gif';
let selectedClass = 'trump-style';


let selectedBgClass = 'bg-urbano';


pato.style.animation = 'none';
nuvem.style.animation = 'none';


charCards.forEach(card => {
    card.addEventListener('click', () => {
        charCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedSrc = card.dataset.src;
        selectedClass = card.dataset.class;
    });
});


bgCards.forEach(card => {
    card.addEventListener('click', () => {
        bgCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedBgClass = card.dataset.class;
    });
});

const updateFloorHeight = () => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const R_cont = W / H;

    let floorY = 35;
    let jumpHeight = 195;

    if (selectedBgClass === 'bg-floresta') {
        const W_orig = 499;
        const H_orig = 345;
        const R_img = W_orig / H_orig;
        const originalFloor = 32;

        if (R_cont > R_img) {
            floorY = originalFloor * (W / W_orig);
        } else {
            floorY = originalFloor * (H / H_orig);
        }
        jumpHeight = 195;
    } else if (selectedBgClass === 'bg-montanha') {
        const W_orig = 1416;
        const H_orig = 980;
        const R_img = W_orig / H_orig;
        const originalFloor = 105;

        if (R_cont > R_img) {
            floorY = originalFloor * (W / W_orig);
        } else {
            floorY = originalFloor * (H / H_orig);
        }
        jumpHeight = 210;
    } else {
        const W_orig = 600;
        const H_orig = 337;
        const R_img = W_orig / H_orig;
        const originalFloor = 35;

        if (R_cont > R_img) {
            floorY = originalFloor * (W / W_orig);
        } else {
            floorY = originalFloor * (H / H_orig);
        }
        jumpHeight = 195;
    }

    gameBoard.style.setProperty('--floor-y', `${Math.round(floorY)}px`);
    gameBoard.style.setProperty('--jump-height', `${Math.round(jumpHeight)}px`);
};


startButton.addEventListener('click', () => {
    charSelectScreen.classList.add('hidden');


    gameBoard.className = 'game-board ' + selectedBgClass;


    updateFloorHeight();


    player.src = selectedSrc;
    player.className = 'player ' + selectedClass;

    gameStarted = true;
    restart();
});

const pulo = () => {
    if (!gameStarted) return;
    if (!player.classList.contains('pulo') && !player.classList.contains('morto')) {
        player.classList.add('pulo');
        contadorPulos++;
        contador.textContent = contadorPulos;
        setTimeout(() => {
            player.classList.remove('pulo');
        }, 650);
    }
}

const checkCollision = () => {
    const playerRect = player.getBoundingClientRect();
    const patoRect = pato.getBoundingClientRect();

    const paddingX = 25;
    const paddingY = 15;

    const hitX = playerRect.right - paddingX > patoRect.left + paddingX &&
                 playerRect.left + paddingX < patoRect.right - paddingX;

    const hitY = playerRect.bottom - paddingY > patoRect.top + paddingY &&
                 playerRect.top + paddingY < patoRect.bottom - paddingY;

    if (hitX && hitY) {
        const patoLeft = window.getComputedStyle(pato).left;
        const playerBottom = window.getComputedStyle(player).bottom;
        const nuvemLeft = window.getComputedStyle(nuvem).left;

        pato.style.animation = 'none';
        pato.style.left = patoLeft;

        player.style.animation = 'none';
        player.style.bottom = playerBottom;
        player.classList.add('morto');

        nuvem.style.animation = 'none';
        nuvem.style.left = nuvemLeft;

        gameOver.style.visibility = 'visible';
        clearInterval(loop);
    }
};

const restart = () => {
    gameOver.style.visibility = 'hidden';


    updateFloorHeight();

    contadorPulos = 0;
    contador.textContent = contadorPulos;


    pato.style.left = '';
    pato.style.animation = 'none';
    void pato.offsetWidth;
    pato.style.animation = 'pato-animation 1.5s infinite linear';


    player.classList.remove('morto');
    player.classList.remove('pulo');
    player.style.animation = '';
    player.style.bottom = '';


    nuvem.style.left = '';
    nuvem.style.animation = 'none';
    void nuvem.offsetWidth;
    nuvem.style.animation = 'cloud-animation 25s infinite linear';

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
menuButton.addEventListener('click', () => {
    gameOver.style.visibility = 'hidden';
    charSelectScreen.classList.remove('hidden');
    gameStarted = false;
    clearInterval(loop);
});


window.addEventListener('resize', () => {
    if (gameStarted) {
        updateFloorHeight();
    }
});
