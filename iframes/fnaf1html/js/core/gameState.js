export const gameState = {
    night: 1,
    time: 0, // 0 AM (12 AM)
    isGameOver: false,
    isDevMode: false
};

export function toggleDevMode() {
    gameState.isDevMode = !gameState.isDevMode;
    document.body.classList.toggle('dev-mode', gameState.isDevMode);
}
