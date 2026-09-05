import { toggleDevMode } from '../core/gameState.js';

export const NATIVE_WIDTH = 1600;
export const NATIVE_HEIGHT = 720;

let currentImgX = 0;
let currentImgY = 0;

export function initOffice() {
    const gameScreen = document.getElementById('game-screen');
    const officeContainer = document.getElementById('office-container');
    const officeBg = document.getElementById('office-bg');
    const coordDisplay = document.getElementById('coord-display');
    const savedCoords = document.getElementById('saved-coords');

    // Mouse Tracking & Office Panning
    gameScreen.addEventListener('mousemove', (e) => {
        const screenRect = gameScreen.getBoundingClientRect();
        const screenX = e.clientX - screenRect.left;

        const percent = Math.max(0, Math.min(1, screenX / screenRect.width));
        const maxScroll = screenRect.width - officeBg.clientWidth;
        officeContainer.style.transform = `translateX(${percent * maxScroll}px)`;

        const coords = getNativeCoords(e.clientX, e.clientY, officeBg);
        currentImgX = coords.x;
        currentImgY = coords.y;
        coordDisplay.textContent = `Mouse: X: ${currentImgX} | Y: ${currentImgY}`;
    });

    // Keyboard Hotkeys
    window.addEventListener('keydown', (e) => {
        if (e.key === '8') {
            toggleDevMode();
        }

        if ((e.key === 'p' || e.key === 'P') && document.body.classList.contains('dev-mode')) {
            const entry = document.createElement('div');
            entry.textContent = `Point ${savedCoords.children.length}: X: ${currentImgX}, Y: ${currentImgY}`;
            savedCoords.appendChild(entry);
            savedCoords.scrollTop = savedCoords.scrollHeight;
        }
    });

    initFanAnimation();
}

export function getNativeCoords(clientX, clientY, officeBgElement) {
    const bgRect = officeBgElement.getBoundingClientRect();
    const scale = bgRect.height / NATIVE_HEIGHT;

    const imgX = Math.round((clientX - bgRect.left) / scale);
    const imgY = Math.round((clientY - bgRect.top) / scale);

    return {
        x: Math.max(0, Math.min(NATIVE_WIDTH, imgX)),
        y: Math.max(0, Math.min(NATIVE_HEIGHT, imgY))
    };
}

function initFanAnimation() {
    const fanImg = document.getElementById('fan-img');
    const fanFrames = ['assets/images/57.png', 'assets/images/59.png', 'assets/images/60.png'];
    let currentFrame = 0;

    setInterval(() => {
        currentFrame = (currentFrame + 1) % fanFrames.length;
        fanImg.src = fanFrames[currentFrame];
    }, 60);
}
