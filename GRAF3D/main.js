async function loadScript(url) {
    const code = await fetch(url).then(r => {
        if (!r.ok) throw new Error(`Nie można wczytać pliku: ${url}`);
        return r.text();
    });
    eval(code);
}

(async () => {
    const scripts = [
        'game/utils.js',
        'game/canvas.js',
        'game/constants.js',
        'game/data.js',
        'game/input.js',
        'game/textures.js',
        'game/citigen.js',
        'game/raycast.js',
        'game/floorcast.js',
        'game/render.js',
        'game/sprites.js',
        'game/minimap.js',
        'game/mechanicsandai.js',
        'game/player.js',
        'game/hud.js',
        'game/endofthecode.js'
    ];

    for (const file of scripts) {
        console.log(`Ładowanie: ${file}`);
        await loadScript(file);
    }

    console.log('Wszystkie pliki gry załadowane.');
    if (typeof init === 'function') {
        init();
    } else {
        console.warn('Nie znaleziono funkcji init() w kodzie gry.');
    }
})();