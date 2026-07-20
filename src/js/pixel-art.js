const CONFIG = {
    transitionDuration: 350,
};

let cards_container, full_view_container, full_view_container_content, pixel_art_full_view, full_view_container_close;

document.addEventListener('DOMContentLoaded', function () {
    cards_container = document.getElementById('cards-container');
    full_view_container = document.getElementById('full-view-container');
    full_view_container_content = document.getElementById('full-view-container-content');
    pixel_art_full_view = document.getElementById('pixel-art-full-view');
    full_view_container_close = document.getElementById('full-view-container-close');
    addEventListeners();
});

function addEventListeners() {
    const buttons = document.getElementsByClassName('load-art-button');
    for (let button of buttons) {
        button.addEventListener('click', function (e) {
            expandViewer(e.target.dataset.src);
        });
    }

    full_view_container_close.addEventListener('click', function () {
        collapseViewer();
    });
}

function expandViewer(src) {
    pixel_art_full_view.src = src;

    cards_container.classList.remove('flex-row');
    cards_container.classList.add('flex-col');

    full_view_container.style.display = 'block';
    // Trigger a forced reflow so that the initial width: 0 state is respected and the width transition works properly
    full_view_container.offsetWidth;
    full_view_container.classList.remove('viewer-w-collapsed');
    full_view_container.classList.add('viewer-w-expanded');

    full_view_container_content.classList.remove('viewer-w-collapsed');
    full_view_container_content.classList.add('viewer-w-expanded');

    setTimeout(function () {
        full_view_container.classList.remove('viewer-h-collapsed');
        full_view_container.classList.add('viewer-h-expanded');

        full_view_container_content.classList.remove('viewer-h-collapsed');
        full_view_container_content.classList.add('viewer-h-expanded');

        setTimeout(function () {
            full_view_container_close.style.display = 'block';
        }, CONFIG.transitionDuration * 1.5);
    }, CONFIG.transitionDuration * 0.5);
}

function collapseViewer() {
    full_view_container_close.style.display = 'none';

    full_view_container.classList.add('viewer-h-collapsed');
    full_view_container.classList.remove('viewer-h-expanded');

    full_view_container_content.classList.add('viewer-h-collapsed');
    full_view_container_content.classList.remove('viewer-h-expanded');

    setTimeout(function () {
        full_view_container.classList.add('viewer-w-collapsed');
        full_view_container.classList.remove('viewer-w-expanded');

        full_view_container_content.classList.add('viewer-w-collapsed');
        full_view_container_content.classList.remove('viewer-w-expanded');

        setTimeout(function () {
            full_view_container.style.display = 'none';

            pixel_art_full_view.src = '#';

            cards_container.classList.add('flex-row');
            cards_container.classList.remove('flex-col');
        }, CONFIG.transitionDuration * 1.5);
    }, CONFIG.transitionDuration * 0.5);
}
