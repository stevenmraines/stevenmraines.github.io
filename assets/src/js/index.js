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
	initSkillsCloud();
});

/**
 * Adds the various event listeners to the page.
 */
function addEventListeners() {
	document.getElementById('mobile-nav-toggle').addEventListener('click', onMobileNavToggleClick);
	document.addEventListener('scroll', onDocumentScroll);
}

function onMobileNavToggleClick(event) {
	document.getElementById('mobile-nav').classList.toggle('hidden');
}

function onDocumentScroll(event) {
	console.log('scrolling');
	windowHeight = window.innerHeight;
	screenTopY = window.scrollY;
	screenBottomY = screenTopY + windowHeight;
}

function initSkillsCloud() {
	const skillsContainer = document.getElementById('skills-container');
	const skills = Array.from(skillsContainer.children);
	const maxSkillSize = 150;

	// Skill level -> pixel size
	const sizeMap = {
		1: maxSkillSize * 0.25,
		2: maxSkillSize * 0.3,
		3: maxSkillSize * 0.45,
		4: maxSkillSize * 0.6,
		5: maxSkillSize * 0.75,
		6: maxSkillSize * 0.9,
		7: maxSkillSize,
	};

	// Resize skills
	for (const skill of skills) {
		const size = sizeMap[parseInt(skill.dataset.skillLvl)] || 40;
		skill.style.width = size + 'px';
		skill.style.height = size + 'px';
		skill.style.position = 'absolute';
	}

	// Highest level skills go closest to center
	skills.sort((a, b) => parseInt(b.dataset.skillLvl) - parseInt(a.dataset.skillLvl));

	skillsContainer.style.position = 'relative';
	const w = skillsContainer.offsetWidth;
	skillsContainer.style.height = w + 'px';

	const cx = w / 2;
	const cy = w / 2;
	const pad = 4;
	const placed = [];

	function rectsOverlap(x1, y1, s1, x2, y2, s2) {
		return x1 < x2 + s2 + pad && x1 + s1 + pad > x2 && y1 < y2 + s2 + pad && y1 + s1 + pad > y2;
	}

	for (const skill of skills) {
		const size = sizeMap[parseInt(skill.dataset.skillLvl)] || 40;
		let angle = 0;
		let x, y;

		// Archimedean spiral outward from center until a valid position is found
		for (let i = 0; i < 10000; i++) {
			const r = 8 * angle;
			x = cx + r * Math.cos(angle) - size / 2;
			y = cy + r * Math.sin(angle) - size / 2;

			const inBounds = x >= 0 && y >= 0 && x + size <= w && y + size <= w;
			const free = !placed.some(p => rectsOverlap(x, y, size, p.x, p.y, p.size));

			if (inBounds && free) break;
			angle += 0.1;
		}

		skill.style.left = x + 'px';
		skill.style.top = y + 'px';
		placed.push({x, y, size});
	}
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
