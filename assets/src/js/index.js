const chroma = require('chroma-js');

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
	// TODO
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
 * Returns a boolean representing whether the given element has the given CSS class.
 */
function hasClass(element, classStr) {
	return (' ' + element.className + ' ').indexOf(' ' + classStr + ' ') >= 0;
}

/**
 * Adds the given CSS class to the given element.
 */
function addClass(element, classStr) {
	if(hasClass(element, classStr)) {
		return;
	}

	element.className = (element.className + ' ' + classStr).trim();
}

/**
 * Removes the given CSS class from the given element.
 */
function removeClass(element, classStr) {
	const regex = new RegExp('(^| )' + classStr + '($| )', 'g');
	element.className = element.className.replace(regex, ' ').trim();
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
