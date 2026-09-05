import { getNativeCoords } from './office.js';
import { calculateUsage } from '../core/powerManager.js';

export const doorState = {
    left: { door: false, light: false, animating: false },
    right: { door: false, light: false, animating: false }
};

const doorFrames = {
    left: ['assets/images/88.png', 'assets/images/105.png', 'assets/images/89.png', 'assets/images/91.png', 'assets/images/102.png'],
    right: ['assets/images/104.png', 'assets/images/121.png', 'assets/images/196.png', 'assets/images/106.png', 'assets/images/118.png']
};

export function initDoors() {
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const officeBg = document.getElementById('office-bg');

    leftBtn.addEventListener('mousedown', (e) => handleBtnMousedown(e, 'left', officeBg));
    leftBtn.addEventListener('mouseup', () => handleBtnRelease('left'));
    leftBtn.addEventListener('mouseleave', () => handleBtnRelease('left'));

    rightBtn.addEventListener('mousedown', (e) => handleBtnMousedown(e, 'right', officeBg));
    rightBtn.addEventListener('mouseup', () => handleBtnRelease('right'));
    rightBtn.addEventListener('mouseleave', () => handleBtnRelease('right'));
}

function handleBtnMousedown(e, side, officeBg) {
    // Prevent interaction if dev mode is moving things
    if (document.body.classList.contains('dev-mode') && e.target.closest('.draggable')) return;
    if (doorState[side].animating) return; // Don't interrupt animation

    const coords = getNativeCoords(e.clientX, e.clientY, officeBg);

    if (coords.y < 410) {
        toggleDoor(side);
    } else {
        doorState[side].light = true;
        updateButtons();
    }
    calculateUsage();
}

function handleBtnRelease(side) {
    if (document.body.classList.contains('dev-mode')) return;
    
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
    doorElement.style.display = 'block';

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
                doorElement.style.display = 'none'; // Hide door completely when open
                doorState[side].animating = false;
            }
        }
    }, 30); // 30ms per frame
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
