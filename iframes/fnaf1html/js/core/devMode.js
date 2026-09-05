import { getNativeCoords } from '../ui/office.js';

export let selectedElement = null;

export function initDevMover() {
    const gameScreen = document.getElementById('game-screen');
    const officeBg = document.getElementById('office-bg');
    
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    // Handle Clicking to Select & Drag
    gameScreen.addEventListener('mousedown', (e) => {
        if (!document.body.classList.contains('dev-mode')) return;

        // If Ctrl is NOT held, deselect and abort dragging
        if (!e.ctrlKey) {
            if (selectedElement) {
                selectedElement.classList.remove('dev-selected');
                selectedElement = null;
            }
            return;
        }

        const target = e.target.closest('.draggable');
        
        if (selectedElement) {
            selectedElement.classList.remove('dev-selected');
            selectedElement = null;
        }

        if (target) {
            selectedElement = target;
            selectedElement.classList.add('dev-selected');
            isDragging = true;

            const coords = getNativeCoords(e.clientX, e.clientY, officeBg);
            
            const currentLeftMatch = target.style.left.match(/(\d+)\s*\//);
            const currentTopMatch = target.style.top.match(/(\d+)\s*\//);
            
            const elementX = currentLeftMatch ? parseFloat(currentLeftMatch[1]) : 0;
            const elementY = currentTopMatch ? parseFloat(currentTopMatch[1]) : 0;

            dragOffsetX = coords.x - elementX;
            dragOffsetY = coords.y - elementY;
            e.preventDefault();
        }
    });

    // Handle Mouse Movement for Dragging
    window.addEventListener('mousemove', (e) => {
        if (!isDragging || !selectedElement) return;

        const coords = getNativeCoords(e.clientX, e.clientY, officeBg);
        let newX = coords.x - dragOffsetX;
        let newY = coords.y - dragOffsetY;

        updateElementPosition(selectedElement, newX, newY);
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Handle Keyboard Nudging
    window.addEventListener('keydown', (e) => {
        if (!document.body.classList.contains('dev-mode') || !selectedElement) return;

        // Prevent default scrolling for arrow keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            
            const currentLeftMatch = selectedElement.style.left.match(/(\d+)\s*\//);
            const currentTopMatch = selectedElement.style.top.match(/(\d+)\s*\//);
            
            let x = currentLeftMatch ? parseFloat(currentLeftMatch[1]) : 0;
            let y = currentTopMatch ? parseFloat(currentTopMatch[1]) : 0;

            const speed = e.shiftKey ? 10 : 1;

            if (e.key === 'ArrowUp') y -= speed;
            if (e.key === 'ArrowDown') y += speed;
            if (e.key === 'ArrowLeft') x -= speed;
            if (e.key === 'ArrowRight') x += speed;

            updateElementPosition(selectedElement, x, y);
        }
    });
}

function updateElementPosition(el, x, y) {
    // Save as calc percentages so it remains responsive
    el.style.left = `calc((${x} / 1600) * 100%)`;
    el.style.top = `calc((${y} / 720) * 100%)`;
    console.log(`${el.id} moved to -> X: ${x}, Y: ${y}`);
}
