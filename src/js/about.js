import { getBreakpoint, remToPx } from './util';

let blur_container, profile_photo, recommendation;

document.addEventListener('DOMContentLoaded', function() {
    blur_container = document.getElementById('blur-container');
    profile_photo = document.getElementById('profile-photo');
    recommendation = document.getElementById('recommendation');
    blur_container.scrollTop = 0;
    addEventListeners();
});

function addEventListeners() {
    blur_container.addEventListener('scroll', onBlurContainerScroll, { passive: false });
}

function onBlurContainerScroll(e) {
    if (blur_container.scrollTop === 0) {
        if (window.innerWidth < remToPx(getBreakpoint('xl'))) {
            profile_photo.classList.remove('animate-fade-in');
            profile_photo.classList.remove('[animation-direction:reverse]');
            profile_photo.classList.remove('[animation-fill-mode:forwards]');
        }
        // TODO Figure out how to make this fade back in?
        recommendation.classList.remove('animate-fade-in');
        recommendation.classList.remove('[animation-direction:reverse]');
        recommendation.classList.remove('[animation-fill-mode:forwards]');
    } else {
        if (window.innerWidth < remToPx(getBreakpoint('xl'))) {
            profile_photo.classList.add('animate-fade-in');
            profile_photo.classList.add('[animation-direction:reverse]');
            profile_photo.classList.add('[animation-fill-mode:forwards]');
        }
        recommendation.classList.add('animate-fade-in');
        recommendation.classList.add('[animation-direction:reverse]');
        recommendation.classList.add('[animation-fill-mode:forwards]');
    }
}
