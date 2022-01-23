const Chart = require('chart.js/auto');
const chroma = require('chroma-js');
const M = require('materialize-css');

// Some constants
const activeClass = 'active';
const hiddenClass = 'hidden';
const white = '#fff';
const whiteTrans3 = chroma(white).alpha(0.3).css('rgba');
const whiteTrans2 = chroma(white).alpha(0.2).css('rgba');
const whiteTrans1 = chroma(white).alpha(0.1).css('rgba');

// Materialize color theme vars
var alabaster;
var cultured;
var darkLiver;
var deepIndigo;
var mediumTurquoise;
var mediumTurquoiseTrans3;
var raisinBlack;
var rajah;
var rajahTrans3;
var royalPurple;
var xiketic;

// Some other global vars
var desktopNav;
var navLinks;
var navMap;
var portfolioCards;
var skillsChart;
var skillsChartContext;
var navHeight = 0;
var windowHeight = 0;
var screenTopY = 0;
var screenBottomY = 0;

/*
 * Initializes all necessary page content.
 */
document.addEventListener('DOMContentLoaded', function() {
	// Materialize's mobile nav needs to be initialized
	initMobileNav();

	addEventListeners();

	// Build a map of the mobile and desktop nav links and their target divs
	buildNavMap();

	// Initialize intro background by manually calling window resize handler
	windowResize();

	// Get colors from the sass defined color palette as JS vars
	getColors();

	// Initialize skills radar chart
	initSkillsChart();
});

/*
 * Initializes the Materialize mobile nav.
 */
function initMobileNav() {
	const elems = document.querySelectorAll('.sidenav');
	M.Sidenav.init(elems, {});
}

/*
 * Adds the various event listeners for the page.
 */
function addEventListeners() {
	// Attach nav onclick event
	navLinks = document.querySelectorAll('ul.nav-link-list li a');

	for(let i = 0; i < navLinks.length; i++) {
		navLinks[i].addEventListener('click', navClick);
    }

	// Attach portfolio project card click event
	portfolioCards = document.querySelectorAll('#portfolio .card.hoverable');

	for(let i = 0; i < portfolioCards.length; i++) {
		portfolioCards[i].addEventListener('click', cardClick);
	}

	// Attach window resize event
	window.addEventListener('resize', windowResize, true);

	// Add scroll event handler
	document.addEventListener('scroll', scrollHandler);
}

/*
 * Builds a map of each navbar link element and their
 * target div and indexes them by the ID of the target div.
 */
function buildNavMap() {
	navMap = {
		'#intro': {
			'desktop': null,
			'mobile': null,
			'section': null,
		},
		'#skills': {
			'desktop': null,
			'mobile': null,
			'section': null,
		},
		'#portfolio': {
			'desktop': null,
			'mobile': null,
			'section': null,
		},
		'#work': {
			'desktop': null,
			'mobile': null,
			'section': null,
		},
		'#education': {
			'desktop': null,
			'mobile': null,
			'section': null,
		},
		'#contact': {
			'desktop': null,
			'mobile': null,
			'section': null,
		},
	};

	for(let i = 0; i < navLinks.length; i++) {
		const id = navLinks[i].attributes.href.value;
		let propertyName = 'desktop';

		if(!isDesktopNavLink(navLinks[i])) {
			propertyName = 'mobile';
		}

		navMap[id][propertyName] = navLinks[i];

		if(!navMap[id].section) {
			navMap[id].section = document.getElementById(id.substring(1));
		}
	}

	// Grabbing these for use later in nav link click and document scroll handler
	desktopNav = document.querySelector('nav');

	// clientHeight = height + padding - height of horizontal scrollbar (if present)
	navHeight = desktopNav.clientHeight;
}

/*
 * Returns a boolean representing whether or not the
 * given navbar link element is part of the
 * desktop nav, as opposed to the mobile version.
 */
function isDesktopNavLink(navLink) {
	/*
	 * If it's a desktop nav link, it'll look like this:
	 * div.nav-wrapper ul.nav-link-list li a
	 */
	const parent1 = navLink.parentElement;  // li
	const parent2 = parent1.parentElement;  // ul.nav-link-list
	const parent3 = parent2.parentElement;  // div.nav-wrapper
	return hasClass(parent3, 'nav-wrapper');
}

/*
 * Scrolls to the target section and adds the
 * active class to the clicked nav link element.
 */
function navClick(event) {
	event.preventDefault();

	const element = event.srcElement;
	const href = element.attributes.href.value.toLowerCase();
	const offsetTop = navMap[href].section.offsetTop;
	let navOffset = -navHeight;

	if(href.localeCompare('#contact') == 0) {
		navOffset = 0;
	}

	window.scrollTo({
		top: offsetTop + navOffset,
		behavior: 'smooth',
	});
}

/*
 * Detects which nav link should be given the 'active' class
 * so that the nav is updated as the user scrolls the page.
 */
function scrollHandler(event) {
	event.preventDefault();

	// innerHeight = interior height, including the height of the horizontal scroll bar (if present)
	windowHeight = window.innerHeight - navHeight;

	// scrollTop = distance from the elements top to its topmost visible content
	screenTopY = Math.max(document.documentElement.scrollTop, document.body.scrollTop) + navHeight;
	screenBottomY = screenTopY + windowHeight;

	let greatestVisibleHeight = -1;
	let activeLink = null;

	for(const id in navMap) {
		if(!navMap.hasOwnProperty(id)) {
			continue;
		}

		removeClass(navMap[id].desktop.parentElement, activeClass);
		removeClass(navMap[id].mobile.parentElement, activeClass);

		const sectionVisibleHeight = getSectionVisibleHeight(id);

		if(sectionVisibleHeight > greatestVisibleHeight) {
			greatestVisibleHeight = sectionVisibleHeight;
			activeLink = navMap[id];
		}
    }

	addClass(activeLink.desktop.parentElement, activeClass);
	addClass(activeLink.mobile.parentElement, activeClass);
}

/*
 * Returns the height of the portion of the given
 * section that is currently visible on screen. 
 */
function getSectionVisibleHeight(sectionId) {
	if(!navMap[sectionId].section) {
		return 0;
	}

	const section = navMap[sectionId].section;
	const sectionHeight = section.clientHeight;
	const sectionTopY = section.offsetTop;
	const sectionBottomY = sectionHeight + sectionTopY;

	// If the bottom half of the section is visible
	if(sectionTopY < screenTopY && sectionBottomY > screenTopY) {
		return sectionHeight - (screenTopY - sectionTopY);
	}

	// If the top half of the section is visible
	if(sectionTopY >= screenTopY && screenBottomY > sectionTopY) {
		return windowHeight - (sectionTopY - screenTopY);
	}

	// If the section is completely above or below the top or bottom of the window
	return 0;
}

/*
 * Grabs the colors for the custom Materialize
 * theme and assigns them to some variables.
 */
function getColors() {
	const alabasterData = document.querySelector('input.alabaster[type="hidden"]');
	const culturedData = document.querySelector('input.cultured[type="hidden"]');
	const darkLiverData = document.querySelector('input.dark-liver[type="hidden"]');
	const deepIndigoData = document.querySelector('input.deep-indigo[type="hidden"]');
	const mediumTurquoiseData = document.querySelector('input.medium-turquoise[type="hidden"]');
	const raisinBlackData = document.querySelector('input.raisin-black[type="hidden"]');
	const rajahData = document.querySelector('input.rajah[type="hidden"]');
	const royalPurpleData = document.querySelector('input.royal-purple[type="hidden"]');
	const xiketicData = document.querySelector('input.xiketic[type="hidden"]');
	
	alabaster = window.getComputedStyle(alabasterData, null)
		.getPropertyValue('background-color');
	cultured = window.getComputedStyle(culturedData, null)
		.getPropertyValue('background-color');
	darkLiver = window.getComputedStyle(darkLiverData, null)
		.getPropertyValue('background-color');
	deepIndigo = window.getComputedStyle(deepIndigoData, null)
		.getPropertyValue('background-color');
	mediumTurquoise = window.getComputedStyle(mediumTurquoiseData, null)
		.getPropertyValue('background-color');
	raisinBlack = window.getComputedStyle(raisinBlackData, null)
		.getPropertyValue('background-color');
	rajah = window.getComputedStyle(rajahData, null)
		.getPropertyValue('background-color');
	royalPurple = window.getComputedStyle(royalPurpleData, null)
		.getPropertyValue('background-color');
	xiketic = window.getComputedStyle(xiketicData, null)
		.getPropertyValue('background-color');

	mediumTurquoiseTrans3 = chroma(mediumTurquoise).alpha(0.3).css('rgba');
	rajahTrans3 = chroma(rajah).alpha(0.3).css('rgba');
}

/*
 * Creates the radar chart shown in the skills section.
 */
function initSkillsChart() {
	skillsChartContext = document.getElementById('skills-chart').getContext('2d');

	const config = {
		type: 'radar',
		data: {
			labels: ['HTML/CSS/JS', 'Bootstrap', 'jQuery',
				'Vue', 'PHP', 'Laravel', 'MySQL', 'AWS'],
			datasets: [
				{
					label: 'Front End',
					data: [3,3,3,1,0,0,0,0],
					borderWidth: 2,
					borderColor: mediumTurquoise,
					backgroundColor: mediumTurquoiseTrans3,
					pointBackgroundColor: mediumTurquoiseTrans3,
				},
				{
					label: 'Back End',
					data: [0,0,0,0,3,2,3,1],
					borderWidth: 2,
					borderColor: rajah,
					backgroundColor: rajahTrans3,
					pointBackgroundColor: rajahTrans3,
				}
			],
		},
		options: {
			color: white,
			maintainAspectRatio: false,
			responsive: true,
			plugins: {
				title: {
					color: white,
					display: true,
					text: 'Years of Experience',
				},
			},
			elements: {
				point: {
					radius: 5,
				},
			},
			scales: {
				r: {
					backgroundColor: whiteTrans1,
					angleLines: {
						color: whiteTrans3,
					},
					grid: {
						color: whiteTrans3,
					},
					pointLabels: {
						color: white,
					},
					ticks: {
						// color: white,
						backdropPadding: 3,
						color: 'black',
						count: 4,
						stepSize: 1,
						z: 1,
					},
				},
			},
		},
	};

	skillsChart = new Chart(skillsChartContext, config);
	
	setSkillsChartGradient();
}

/*
 * Sets the background of the skills chart to a radial gradient.
 */
function setSkillsChartGradient() {
	if(!skillsChart) {
		return;
	}
	
	const chartArea = skillsChart.chartArea;
	const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    const r = Math.min(
		(chartArea.right - chartArea.left) / 2,
		(chartArea.bottom - chartArea.top) / 2
    );

	const gradient = skillsChartContext.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
	gradient.addColorStop(0, 'transparent');
	gradient.addColorStop(.7, whiteTrans1);
	gradient.addColorStop(1, whiteTrans2);

	skillsChart.config.options.scales.r.backgroundColor = gradient;
	skillsChart.update();
}

/*
 * Readjusts the intro section background on page resize
 * and updates the skills chart background gradient.
 */
function windowResize() {
	const adjacent = window.innerWidth;
	const opposite = document.querySelector('#intro').clientHeight;

	// Set new angle of rotation
	const angle = Math.atan(opposite / adjacent) * (180 / Math.PI);
	const div1 = document.querySelector('#intro > div:nth-child(1)');
	const div2 = document.querySelector('#intro > div:nth-child(2)');
	div1.style.transform = "rotate(" + angle + "deg)";
	div2.style.transform = "rotate(-" + angle + "deg)";

	// Set new width
	const hypotenuse = Math.round(Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2)));
	div1.style.width = hypotenuse + "px";
	div2.style.width = hypotenuse + "px";

	// Update skills chart background color gradient
	setSkillsChartGradient();
}

/*
 * Returns a boolean representing whether or
 * not the given element has the given CSS class.
 */
function hasClass(element, classStr) {
	return (' ' + element.className + ' ').indexOf(' ' + classStr + ' ') >= 0;
}

/*
 * Adds the given CSS class to the given element.
 */
function addClass(element, classStr) {
	// If class is already added, do nothing
	if(hasClass(element, classStr)) {
		return;
	}

	element.className = (element.className + ' ' + classStr).trim();
}

/*
 * Removes the given CSS class from the given element.
 */
function removeClass(element, classStr) {
	const regex = new RegExp('(^| )' + classStr + '($| )', 'g');
	element.className = element.className.replace(regex, ' ').trim();
}

/*
 * Updates the active image for the current portfolio project.
 */
function previewClick(img) {
	const src = img.src.replace('.png', '.gif');
	const project = img.dataset.project;
	let selector = 'p[data-project="' + project + '"]';
	const descriptions = document.querySelectorAll(selector);
	const feature = img.dataset.projectFeature;
	selector = 'p[data-project-feature="' + feature + '"]';
	const featureDescription = document.querySelector(selector);

	for(let i = 0; i < descriptions.length; i++) {
		addClass(descriptions[i], hiddenClass);
	}

	removeClass(featureDescription, hiddenClass);

	document.getElementById('active-portfolio-img').src = src;
	
	const activeImages = document.querySelectorAll('.portfolio-preview.active');

	for(let i = 0; i < activeImages.length; i++) {
		removeClass(activeImages[i], activeClass);
	}

	addClass(img, activeClass);
}

/*
 * Sets the active portfolio project.
 */
function cardClick(event) {
	const target = event.currentTarget;
	const id = target.attributes['data-project-content-id'].value;
	const projects = document.querySelectorAll('.project');

	for(let i = 0; i < projects; i++) {
		addClass(projects[i], hiddenClass);
	}

	removeClass(document.getElementById(id), hiddenClass);
}
