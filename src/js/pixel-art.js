const CONFIG = {
    transitionDuration: 350,
};

let cards_container,
    full_view_container,
    full_view_container_content,
    full_view_container_overlay,
    full_view_container_close,
    prev_image,
    next_image,
    pixel_art_full_view;

let clicked_card_sources = [];
let current_source_index = 0;

document.addEventListener('DOMContentLoaded', function () {
    cards_container = document.getElementById('cards-container');
    full_view_container = document.getElementById('full-view-container');
    full_view_container_content = document.getElementById('full-view-container-content');
    full_view_container_overlay = document.getElementById('full-view-container-overlay');
    full_view_container_close = document.getElementById('full-view-container-close');
    prev_image = document.getElementById('prev-image');
    next_image = document.getElementById('next-image');
    pixel_art_full_view = document.getElementById('pixel-art-full-view');
    addEventListeners();
});

function addEventListeners() {
    for (let button of document.getElementsByClassName('load-art-button')) {
        button.addEventListener('click', function (e) {
            clicked_card_sources = [];
            current_source_index = 0;
            let i = 1;
            while (e.target.dataset.hasOwnProperty(`src-${i}`)) {
                if (i === 1) {
                    expandViewer(e.target.dataset['src-1']);
                }
                clicked_card_sources.push(e.target.dataset[`src-${i}`]);
                i++;
            }
            prev_image.style.display = i === 2 ? 'none' : 'block';
            next_image.style.display = i === 2 ? 'none' : 'block';
            console.log(clicked_card_sources)
        });
    }

    full_view_container_close.addEventListener('click', function () {
        collapseViewer();
    });

    prev_image.addEventListener('click', function () {
        current_source_index = Math.max(0, current_source_index - 1);
        pixel_art_full_view.src = clicked_card_sources[current_source_index];
        console.log(current_source_index)
    });

    next_image.addEventListener('click', function () {
        current_source_index = Math.min(current_source_index + 1, clicked_card_sources.length - 1);
        pixel_art_full_view.src = clicked_card_sources[current_source_index];
        console.log(current_source_index)
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
            full_view_container_overlay.style.display = 'block';
        }, CONFIG.transitionDuration * 1.5);
    }, CONFIG.transitionDuration * 0.5);
}

function collapseViewer() {
    full_view_container_overlay.style.display = 'none';

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
