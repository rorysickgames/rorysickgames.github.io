import { doorState } from '../ui/doors.js';

export const powerState = {
    power: 100.0,
    usage: 1
};

export function initPowerManager() {
    // Tick power usage every second
    setInterval(() => {
        calculateUsage();
        if (powerState.power > 0) {
            powerState.power = Math.max(0, powerState.power - (powerState.usage * 0.1));
            updatePowerUI();
        }
    }, 1000);
}

export function calculateUsage() {
    let currentUsage = 1; // Base office usage (fan/monitors)

    if (doorState.left.door) currentUsage++;
    if (doorState.left.light) currentUsage++;
    if (doorState.right.door) currentUsage++;
    if (doorState.right.light) currentUsage++;

    powerState.usage = currentUsage;
    updatePowerUI();
}

function updatePowerUI() {
    const powerDisplay = document.getElementById('power-display');
    const usageDisplay = document.getElementById('usage-display');

    if (powerDisplay) powerDisplay.textContent = `Power: ${Math.round(powerState.power)}%`;
    if (usageDisplay) usageDisplay.textContent = `Usage: ${powerState.usage}`;
}
