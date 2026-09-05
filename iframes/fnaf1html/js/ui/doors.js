import { getNativeCoords } from './office.js';
import { calculateUsage } from '../core/powerManager.js';

export const doorState = {
    left: { door: false, light: false },
    right: { door: false, light: false }
};

export function initDoors() {
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const officeBg = document.getElementById('office-bg');

    renderStateUI();

    leftBtn.addEventListener('mousedown', (e) => handleBtnMousedown(e, 'left', officeBg));
    leftBtn.addEventListener('mouseup', () => handleBtnRelease('left'));
    leftBtn.addEventListener('mouseleave', () => handleBtnRelease('left'));

    rightBtn.addEventListener('mousedown', (e) => handleBtnMousedown(e, 'right', officeBg));
    rightBtn.addEventListener('mouseup', () => handleBtnRelease('right'));
    rightBtn.addEventListener('mouseleave', () => handleBtnRelease('right'));
}

function handleBtnMousedown(e, side, officeBg) {
    const coords = getNativeCoords(e.clientX, e.clientY, officeBg);

    if (coords.y < 410) {
        doorState[side].door = !doorState[side].door;
    } else {
        doorState[side].light = true;
    }

    side === 'left' ? updateLeftBtn() : updateRightBtn();
    calculateUsage();
}

function handleBtnRelease(side) {
    doorState[side].light = false;
    side === 'left' ? updateLeftBtn() : updateRightBtn();
    calculateUsage();
}

function updateLeftBtn() {
    const leftBtn = document.getElementById('left-btn');
    if (doorState.left.door && doorState.left.light) {
        leftBtn.src = 'assets/images/130.png';
    } else if (doorState.left.door) {
        leftBtn.src = 'assets/images/124.png';
    } else if (doorState.left.light) {
        leftBtn.src = 'assets/images/125.png';
    } else {
        leftBtn.src = 'assets/images/122.png';
    }
    renderStateUI();
}

function updateRightBtn() {
    const rightBtn = document.getElementById('right-btn');
    if (doorState.right.door && doorState.right.light) {
        rightBtn.src = 'assets/images/47.png';
    } else if (doorState.right.door) {
        rightBtn.src = 'assets/images/135.png';
    } else if (doorState.right.light) {
        rightBtn.src = 'assets/images/131.png';
    } else {
        rightBtn.src = 'assets/images/134.png';
    }
    renderStateUI();
}

function renderStateUI() {
    const stateContent = document.getElementById('state-content');
    if (!stateContent) return;
    
    stateContent.innerHTML = `
        Left Door: <span>${doorState.left.door}</span><br>
        Left Light: <span>${doorState.left.light}</span><br>
        Right Door: <span>${doorState.right.door}</span><br>
        Right Light: <span>${doorState.right.light}</span>
    `;
}
