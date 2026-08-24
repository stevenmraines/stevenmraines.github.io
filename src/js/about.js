let blur_container, recommendation;

document.addEventListener('DOMContentLoaded', function() {
    blur_container = document.getElementById('blur-container');
    recommendation = document.getElementById('recommendation');
    blur_container.scrollTop = 0;
    addEventListeners();
});

function addEventListeners() {
    blur_container.addEventListener('scroll', onBlurContainerScroll, { passive: false });
}

function onBlurContainerScroll(e) {
    if (blur_container.scrollTop === 0) {
        // TODO Figure out how to make this fade back in?
        recommendation.classList.remove('animate-fade-in');
        recommendation.classList.remove('[animation-direction:reverse]');
        recommendation.classList.remove('[animation-fill-mode:forwards]');
    } else {
        recommendation.classList.add('animate-fade-in');
        recommendation.classList.add('[animation-direction:reverse]');
        recommendation.classList.add('[animation-fill-mode:forwards]');
    }
}
