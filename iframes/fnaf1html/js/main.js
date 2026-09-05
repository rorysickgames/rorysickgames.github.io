import { initOffice } from './ui/office.js';
import { initDoors } from './ui/doors.js';
import { initPowerManager } from './core/powerManager.js';
import { initCameras } from './ui/cameras.js';
import { initDevMover } from './core/devMode.js';

document.addEventListener('DOMContentLoaded', () => {
    initOffice();
    initDoors();
    initPowerManager();
    initCameras();
    initDevMover();
});
