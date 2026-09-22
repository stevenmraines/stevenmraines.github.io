import { getThemeVariable, remToPx } from './util';

// Just going to inline script this since it's pretty simple
const CONFIG = {
    transitionDuration: 350,
};

let cards_container,
    splat_viewer_container,
    splat_viewer_close,
    splat_viewer;

document.addEventListener('DOMContentLoaded', function () {
    cards_container = document.getElementById('cards-container');
    splat_viewer_container = document.getElementById('splat-viewer-container');
    splat_viewer_close = document.getElementById('splat-viewer-close');
    splat_viewer = document.getElementById('splat-viewer');
    addEventListeners();
    setSplatViewerDimensions();
});

function addEventListeners() {
    for (let button of document.getElementsByClassName('load-splat-button')) {
        button.addEventListener('click', function (event) {
            expandViewer(event.target.dataset.src);

            if (window.innerWidth < remToPx(getThemeVariable('--breakpoint-2xl'))) {
                scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    splat_viewer_close.addEventListener('click', collapseViewer);

    window.addEventListener('resize', function () {
        setSplatViewerDimensions();
    });
}

function expandViewer(src) {
    if (splat_viewer_container.style.display === 'block') {
        splat_viewer.src = src;
        return;
    }

    cards_container.classList.add('cards-container-expanded');
    cards_container.classList.remove('cards-container-collapsed');
    splat_viewer_container.style.display = 'block';
    splat_viewer_container.classList.remove('viewer-w-collapsed');
    splat_viewer_container.classList.add('viewer-w-expanded');

    setTimeout(function () {
        splat_viewer_container.classList.remove('viewer-h-collapsed');
        splat_viewer_container.classList.add('viewer-h-expanded');

        setTimeout(function () {
            splat_viewer_close.style.display = 'block';
            splat_viewer.src = src;
        }, CONFIG.transitionDuration * 1.5);
    }, CONFIG.transitionDuration * 0.5);
}

function collapseViewer() {
    splat_viewer.src = '';
    splat_viewer_close.style.display = 'none';
    splat_viewer_container.classList.remove('viewer-h-expanded');
    splat_viewer_container.classList.add('viewer-h-collapsed');

    setTimeout(function () {
        splat_viewer_container.classList.remove('viewer-w-expanded');
        splat_viewer_container.classList.add('viewer-w-collapsed');

        setTimeout(function () {
            splat_viewer_container.style.display = 'none';
            cards_container.classList.remove('cards-container-expanded');
            cards_container.classList.add('cards-container-collapsed');
        }, CONFIG.transitionDuration * 1.5);
    }, CONFIG.transitionDuration * 0.5);
}

function setSplatViewerDimensions() {
    let viewer_width = remToPx(getThemeVariable('--viewer-w-xs'));
    let viewer_height = remToPx(getThemeVariable('--viewer-h-xs'));

    if (window.innerWidth >= remToPx(getThemeVariable('--breakpoint-sm'))) {
        viewer_width = remToPx(getThemeVariable('--viewer-w-sm'));
        viewer_height = remToPx(getThemeVariable('--viewer-h-sm'));
    }

    if (window.innerWidth >= remToPx(getThemeVariable('--breakpoint-md'))) {
        viewer_width = remToPx(getThemeVariable('--viewer-w-md'));
        viewer_height = remToPx(getThemeVariable('--viewer-h-md'));
    }

    if (window.innerWidth >= remToPx(getThemeVariable('--breakpoint-lg'))) {
        viewer_width = remToPx(getThemeVariable('--viewer-w-lg'));
        viewer_height = remToPx(getThemeVariable('--viewer-h-lg'));
    }

    if (window.innerWidth >= remToPx(getThemeVariable('--breakpoint-xl'))) {
        viewer_width = remToPx(getThemeVariable('--viewer-w-xl'));
        viewer_height = remToPx(getThemeVariable('--viewer-h-xl'));
    }

    splat_viewer.width = viewer_width;
    splat_viewer.height = viewer_height;
}
