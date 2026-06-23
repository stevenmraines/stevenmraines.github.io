/*
 ***********************************************************************************************************************
 * GLOBAL VARS
 ***********************************************************************************************************************
 */
let windowHeight = 0;
let screenTopY = 0;
let screenBottomY = 0;

/*
 ***********************************************************************************************************************
 * PAGE SETUP
 ***********************************************************************************************************************
 */
document.addEventListener('DOMContentLoaded', function() {
	addEventListeners();
});

/**
 * Adds the various event listeners to the page.
 */
function addEventListeners() {
	window.addEventListener('resize', onWindowResize);
	document.addEventListener('scroll', onDocumentScroll);

	const bgToggle = document.getElementById('bg-settings-toggle');

	if (bgToggle) {
		bgToggle.addEventListener('click', onBgSettingsToggleClick);
		document.getElementById('bg-settings-close').addEventListener('click', onBgSettingsCloseClick);
	}
}

function onWindowResize(event) {

}

function onDocumentScroll(event) {
	console.log('scrolling');
	windowHeight = window.innerHeight;
	screenTopY = window.scrollY;
	screenBottomY = screenTopY + windowHeight;
}

function onBgSettingsToggleClick(event) {
	document.getElementById('settings-message').classList.add('hidden');
	document.getElementById('projects-message').classList.add('hidden');
	document.getElementById('bg-settings').classList.toggle('-translate-x-1/1');
}

function onBgSettingsCloseClick() {
	document.getElementById('bg-settings').classList.add('-translate-x-1/1');
}

/*
 ***********************************************************************************************************************
 * UTILITIES
 ***********************************************************************************************************************
 */

/**
 * Returns the height of the portion of the given section that is currently visible on screen.
 */
function getSectionVisibleHeight(section) {
	if(!section) {
		return 0;
	}

	const sectionHeight = section.clientHeight;
	const sectionTopY = section.offsetTop;
	const sectionBottomY = sectionHeight + sectionTopY;
	let visibleHeight = 0;

	// If the bottom half of the section is visible
	if(sectionTopY < screenTopY && sectionBottomY > screenTopY) {
		visibleHeight = sectionHeight - (screenTopY - sectionTopY);
	}

	// If the top half of the section is visible
	if(sectionTopY >= screenTopY && screenBottomY > sectionTopY) {
		visibleHeight = windowHeight - (sectionTopY - screenTopY);
	}

	return visibleHeight;
}

/**
 * Returns a boolean indicating whether the given element is an img tag.
 */
function isImage(element) {
	return element.tagName.toLowerCase().localeCompare('img') == 0;
}

/**
 * Returns a boolean indicating whether the given element is a video tag.
 */
function isVideo(element) {
	return element.tagName.toLowerCase().localeCompare('video') == 0;
}

/**
 * Returns the height of the given element, or 0 if it's not an img or video.
 */
function getImageOrVideoHeight(element) {
	if(isImage(element)) {
		return element.naturalHeight;
	}

	if(isVideo(element)) {
		return element.videoHeight;
	}

	return 0;
}

/**
 * Returns the width of the given element, or 0 if it's not an img or video.
 */
function getImageOrVideoWidth(element) {
	if(isImage(element)) {
		return element.naturalWidth;
	}

	if(isVideo(element)) {
		return element.videoWidth;
	}

	return 0;
}
