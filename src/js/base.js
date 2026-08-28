let windowHeight = 0;
let screenTopY = 0;
let screenBottomY = 0;

const BG_SETTINGS_TOGGLE_ID = 'bg-settings-toggle';
const BG_SETTINGS_CLOSE_ID = 'bg-settings-close';
const BG_SETTINGS_ID = 'bg-settings';
const SETTINGS_MESSAGE_ID = 'settings-message';
const PROJECTS_MESSAGE_ID = 'projects-message';
const MAIN_MENU_ID = 'main-menu';
const FULLSCREEN_WRAPPER_ID = 'fullscreen-wrapper';
const FULLSCREEN_IMG_ID = 'fullscreen-img';
const FULLSCREEN_CLOSE_ID = 'fullscreen-close';
const SUB_MENU_CLASS = 'sub-menu';
const FULLSCREEN_PREVIEW_CLASS = 'fullscreen-preview';
const OPACITY_TRANSITION_DURATION = 300;

/*
 ***********************************************************************************************************************
 * PAGE SETUP
 ***********************************************************************************************************************
 */
// TODO Wrap other js code in this
document.addEventListener('DOMContentLoaded', function() {
	addEventListeners();
});

/**
 * Adds the various event listeners to the page.
 */
function addEventListeners() {
	window.addEventListener('resize', onWindowResize);

	const bgToggle = document.getElementById(BG_SETTINGS_TOGGLE_ID);

	if (bgToggle) {
		bgToggle.addEventListener('click', onBgSettingsToggleClick);
		document.getElementById(BG_SETTINGS_CLOSE_ID).addEventListener('click', onBgSettingsCloseClick);
	}

	const mainMenu = document.getElementById(MAIN_MENU_ID);

	for (let i = 0; i < mainMenu.children.length; i++) {
		const li = mainMenu.children[i];
		const a = li.querySelector('a');
		const subMenu = li.querySelector('ul.' + SUB_MENU_CLASS);

		if (! subMenu) {
			continue;
		}

		a.addEventListener('mouseenter', function(event) {
			document.getElementById(SETTINGS_MESSAGE_ID).classList.add('hidden');
			document.getElementById(PROJECTS_MESSAGE_ID).classList.add('hidden');
			subMenu.style.pointerEvents = 'auto';
			subMenu.style.opacity = 1;
		});

		li.addEventListener('mouseleave', function(event) {
			subMenu.style.pointerEvents = 'none';
			subMenu.style.opacity = 0;
		});
	}

	// Set an interval to check for dynamically created fullscreen-preview images and attach the necessary click handler
	setInterval(function () {
		for (let img of document.getElementsByClassName(FULLSCREEN_PREVIEW_CLASS)) {
			if (! img.dataset.hasOwnProperty('clickBound')) {
				img.addEventListener('click', onFullscreenPreviewClicked);
				img.title = 'Click for fullscreen view';
				img.dataset.clickBound = 'true';
			}
		}
	}, 1000);


	document.getElementById(FULLSCREEN_CLOSE_ID).addEventListener('click', onFullscreenCloseClicked);

	document.addEventListener('keyup', onKeyUp);
}

function onWindowResize(event) {

}

function onBgSettingsToggleClick(event) {
	document.getElementById(SETTINGS_MESSAGE_ID).classList.add('hidden');
	document.getElementById(PROJECTS_MESSAGE_ID).classList.add('hidden');
	document.getElementById(BG_SETTINGS_ID).classList.toggle('-translate-x-1/1');
}

function onBgSettingsCloseClick(event) {
	document.getElementById(BG_SETTINGS_ID).classList.add('-translate-x-1/1');
}

function onKeyUp(event) {
	if ((event.key && event.key.toLocaleLowerCase() === 'escape') || (event.code && event.code.toLocaleLowerCase() === 'escape')) {
		onFullscreenCloseClicked();
	}
}

function onFullscreenPreviewClicked(event) {
	let src = '';

	if (event.target.src) {
		src = event.target.src;
	}

	if (! src) {
		let bg = window.getComputedStyle(event.target).backgroundImage;

		if (bg && bg !== 'none') {
			if (bg.startsWith('url(')) {
				const regex = /url\(["']?([^"')]+)["']?\)/i;
				const result = regex.exec(bg);
				if (result && result.length > 1) {
					bg = result[1];
				}
			}

			src = bg;
		}
	}

	if (! src) {
		return;
	}

	const fullscreen_wrapper = document.getElementById(FULLSCREEN_WRAPPER_ID);
	const fullscreen_img = document.getElementById(FULLSCREEN_IMG_ID);

	if (! fullscreen_img || ! fullscreen_wrapper) {
		return;
	}

	fullscreen_img.src = src;
	fullscreen_wrapper.style.display = 'block';

	// Force a reflow so the browser commits the current opacity-0 state
	void fullscreen_wrapper.offsetHeight;

	fullscreen_wrapper.classList.remove('opacity-0');
}

function onFullscreenCloseClicked(event = null) {
	const fullscreen_wrapper = document.getElementById(FULLSCREEN_WRAPPER_ID);
	const fullscreen_img = document.getElementById(FULLSCREEN_IMG_ID);

	if (! fullscreen_img || ! fullscreen_wrapper) {
		return;
	}

	fullscreen_wrapper.classList.add('opacity-0');
	setTimeout(function () {
		fullscreen_wrapper.style.display = 'none';
		fullscreen_img.src = '#';
	}, OPACITY_TRANSITION_DURATION);
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
