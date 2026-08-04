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
    pixel_art_full_view,
    video_player,
    video_player_source,
    project_text_container,
    project_title,
    project_description_body,
    project_description_footer,
    target;

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
    video_player = document.getElementById('video-player');
    video_player_source = document.getElementById('video-player-source');
    project_text_container = document.getElementById('project-text-container');
    project_title = document.getElementById('project-title');
    project_description_body = document.getElementById('project-description-body');
    project_description_footer = document.getElementById('project-description-footer');
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
                    target = e.target;
                    expandViewer();
                }
                clicked_card_sources.push(target.dataset[`src-${i}`]);
                i++;
            }
            prev_image.style.display = i === 2 ? 'none' : 'block';
            next_image.style.display = i === 2 ? 'none' : 'block';
        });
    }

    full_view_container_close.addEventListener('click', function () {
        collapseViewer();
    });

    prev_image.addEventListener('click', function () {
        current_source_index = Math.max(0, current_source_index - 1);
        const src = clicked_card_sources[current_source_index];
        let srcElement = src.endsWith('mp4') ? video_player_source : pixel_art_full_view;
        let viewerElement = src.endsWith('mp4') ? video_player : pixel_art_full_view;
        let otherElement = src.endsWith('mp4') ? pixel_art_full_view : video_player;
        srcElement.src = src;
        if (otherElement) otherElement.style.display = 'none';
        viewerElement.style.display = 'block';
        if (src.endsWith('mp4')) viewerElement.pause();
        if (src.endsWith('mp4')) viewerElement.load();
        if (src.endsWith('mp4')) viewerElement.play();
    });

    next_image.addEventListener('click', function () {
        current_source_index = Math.min(current_source_index + 1, clicked_card_sources.length - 1);
        const src = clicked_card_sources[current_source_index];
        let srcElement = src.endsWith('mp4') ? video_player_source : pixel_art_full_view;
        let viewerElement = src.endsWith('mp4') ? video_player : pixel_art_full_view;
        let otherElement = src.endsWith('mp4') ? pixel_art_full_view : video_player;
        srcElement.src = src;
        if (otherElement) otherElement.style.display = 'none';
        viewerElement.style.display = 'block';
        if (src.endsWith('mp4')) viewerElement.pause();
        if (src.endsWith('mp4')) viewerElement.load();
        if (src.endsWith('mp4')) viewerElement.play();
    });
}

function showProjectTextContainer() {
    if (! project_text_container || ! target) {
        return;
    }
    project_title.innerText = target.dataset.hasOwnProperty('title') ? target.dataset.title : '';
    project_description_body.replaceChildren();
    if (target.dataset.hasOwnProperty('description')) {
        const description = document.getElementById(target.dataset.description).cloneNode(true);
        description.removeAttribute('id');
        project_description_body.appendChild(description);
        description.style.display = 'block';
    }
    project_description_footer.replaceChildren();
    if (target.dataset.link) {
        const link = document.createElement('a');
        link.href = target.dataset.link;
        /*
         * Very cool that target.dataset['src-1'] is retained as-is,
         * but "data-link-text" becomes target.dataset.linkText.
         * Not annoying at all.
         */
        link.innerText = target.dataset.linkText ? target.dataset.linkText : 'See on GitHub >';
        link.target = '_blank';
        project_description_footer.appendChild(link);
    }
    project_text_container.style.opacity = 1;
}

function hideProjectTextContainer() {
    if (! project_text_container) {
        return;
    }
    project_text_container.style.opacity = 0;
    project_title.innerText = '';
    project_description_body.replaceChildren();
    project_description_footer.replaceChildren();
}

function expandViewer() {
    if (! target) {
        return;
    }

    const src = target.dataset['src-1'];
    let srcElement = src.endsWith('mp4') ? video_player_source : pixel_art_full_view;
    let viewerElement = src.endsWith('mp4') ? video_player : pixel_art_full_view;
    let otherElement = src.endsWith('mp4') ? pixel_art_full_view : video_player;
    let timeouts_finished = false;

    // TODO load event seems to fire before the browser actually displays the image
    viewerElement.addEventListener(src.endsWith('mp4') ? 'loadeddata' : 'load', function () {
        const checkTimeoutInterval = setInterval(function () {
            if (timeouts_finished) {
                showProjectTextContainer(target);
                clearInterval(checkTimeoutInterval);
            }
        }, 100);
    }, { once: true }); // Use once so the listener is not invoked for projects that were previously clicked

    srcElement.src = src;
    if (otherElement) otherElement.style.display = 'none';
    if (src.endsWith('mp4')) viewerElement.load();

    // Viewer was already expanded when target was clicked, no need to actually wait for the timeouts
    if (full_view_container.style.display === 'block') {
        timeouts_finished = true;
    }

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
            viewerElement.style.display = 'block';
            if (src.endsWith('mp4')) viewerElement.play();
            timeouts_finished = true;
        }, CONFIG.transitionDuration * 1.5);
    }, CONFIG.transitionDuration * 0.5);
}

function collapseViewer() {
    if (video_player) video_player.pause();

    hideProjectTextContainer();

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
            if (video_player_source) video_player_source.src = '#';
            pixel_art_full_view.style.display = 'none';
            if (video_player) video_player.style.display = 'none';

            cards_container.classList.add('flex-row');
            cards_container.classList.remove('flex-col');
        }, CONFIG.transitionDuration * 1.5);
    }, CONFIG.transitionDuration * 0.5);
}
