import { getNativeCoords } from './office.js';
import { calculateUsage } from '../core/powerManager.js';

export const doorState = {
    left: { door: false, light: false, animating: false },
    right: { door: false, light: false, animating: false }
};
const doorFrames = {
    left: [
        'assets/images/88.png', 'assets/images/105.png', 'assets/images/89.png',
        'assets/images/91.png', 'assets/images/92.png', 'assets/images/93.png',
        'assets/images/94.png', 'assets/images/95.png', 'assets/images/96.png',
        'assets/images/97.png', 'assets/images/98.png', 'assets/images/99.png',
        'assets/images/100.png', 'assets/images/101.png', 'assets/images/102.png'
    ],
    right: [
        'assets/images/104.png', 'assets/images/121.png', 'assets/images/196.png',
        'assets/images/106.png', 'assets/images/107.png', 'assets/images/108.png',
        'assets/images/109.png', 'assets/images/110.png', 'assets/images/111.png',
        'assets/images/112.png', 'assets/images/113.png', 'assets/images/114.png',
        'assets/images/115.png', 'assets/images/116.png', 'assets/images/117.png',
        'assets/images/118.png'
    ]
};

export function initDoors() {
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const officeBg = document.getElementById('office-bg');

    leftBtn.addEventListener('mousedown', (e) => handleBtnMousedown(e, 'left', officeBg));
    leftBtn.addEventListener('mouseup', (e) => handleBtnRelease(e, 'left'));
    leftBtn.addEventListener('mouseleave', (e) => handleBtnRelease(e, 'left'));

    rightBtn.addEventListener('mousedown', (e) => handleBtnMousedown(e, 'right', officeBg));
    rightBtn.addEventListener('mouseup', (e) => handleBtnRelease(e, 'right'));
    rightBtn.addEventListener('mouseleave', (e) => handleBtnRelease(e, 'right'));
}

function handleBtnMousedown(e, side, officeBg) {
    // ONLY ignore the click if we are in dev mode AND holding Ctrl
    if (document.body.classList.contains('dev-mode') && e.ctrlKey) return;
    
    if (doorState[side].animating) return;

    const coords = getNativeCoords(e.clientX, e.clientY, officeBg);

    if (coords.y < 410) {
        toggleDoor(side);
    } else {
        doorState[side].light = true;
        updateButtons();
    }
    calculateUsage();
}

function handleBtnRelease(e, side) {
    // ONLY ignore the release if we are in dev mode AND holding Ctrl
    if (document.body.classList.contains('dev-mode') && e && e.ctrlKey) return;
    
    doorState[side].light = false;
    updateButtons();
    calculateUsage();
}

function toggleDoor(side) {
    doorState[side].door = !doorState[side].door;
    updateButtons();
    
    const sound = document.getElementById('door-sound');
    sound.currentTime = 0;
    sound.play();

    animateDoor(side, doorState[side].door);
}

function animateDoor(side, isClosing) {
    const doorElement = document.getElementById(`${side}-door`);
    const frames = doorFrames[side];
    doorState[side].animating = true;

    let currentFrame = isClosing ? 0 : frames.length - 1;
    
    const animInterval = setInterval(() => {
        doorElement.src = frames[currentFrame];
        
        if (isClosing) {
            currentFrame++;
            if (currentFrame >= frames.length) {
                clearInterval(animInterval);
                doorState[side].animating = false;
            }
        } else {
            currentFrame--;
            if (currentFrame < 0) {
                clearInterval(animInterval);
                doorElement.src = frames[0]; // Lock to the first frame instead of hiding
                doorState[side].animating = false;
            }
        }
    }, 30);
}

function updateButtons() {
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');

    // Left Button
    if (doorState.left.door && doorState.left.light) leftBtn.src = 'assets/images/130.png';
    else if (doorState.left.door) leftBtn.src = 'assets/images/124.png';
    else if (doorState.left.light) leftBtn.src = 'assets/images/125.png';
    else leftBtn.src = 'assets/images/122.png';

    // Right Button
    if (doorState.right.door && doorState.right.light) rightBtn.src = 'assets/images/47.png';
    else if (doorState.right.door) rightBtn.src = 'assets/images/135.png';
    else if (doorState.right.light) rightBtn.src = 'assets/images/131.png';
    else rightBtn.src = 'assets/images/134.png';
}
