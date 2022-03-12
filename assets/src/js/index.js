const Chart = require('chart.js/auto');
const chroma = require('chroma-js');
const M = require('materialize-css');

// Some constants
const activeClass = 'active';
const hiddenClass = 'hidden';
const consoleAnimationClass = 'animate';
const black = '#000';
const white = '#fff';
const whiteTrans3 = chroma(white).alpha(0.3).css('rgba');
const whiteTrans2 = chroma(white).alpha(0.2).css('rgba');
const whiteTrans1 = chroma(white).alpha(0.1).css('rgba');

// Materialize color theme vars
let alabaster;
let cultured;
let darkLiver;
let deepIndigo;
let mediumTurquoise;
let mediumTurquoiseTrans3;
let raisinBlack;
let rajah;
let rajahTrans3;
let royalPurple;
let xiketic;

// Some other global vars
let skillsChartData;
let skillsChartConfig;
let skillsChartActivePoint = 'skill-html';
let desktopNav;
let navLinks;
let navMap;
let portfolioCards;
let skillsChart;
let skillsChartContext;
let lastClickedSkillId = 'skill-html';
let navHeight = 0;
let windowHeight = 0;
let screenTopY = 0;
let screenBottomY = 0;
let consoleAnimTriggered = false;

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

	// Does a little animation on the intro section background divs
	rotateIntroBackground();
});

/*
 * Adds some classes to the background divs of the intro section to make them rotate.
 */
function rotateIntroBackground() {
	addClass(document.querySelector('#background1'), 'rotate-cw');
	addClass(document.querySelector('#background2'), 'rotate-ccw');
}

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

	// Add portfolio preview image on click event
	const previews = document.querySelectorAll('#portfolio .portfolio-preview');

	for(let i = 0; i < previews.length; i++) {
		previews[i].addEventListener('click', previewClick);
    }

	// Attach window resize event
	window.addEventListener('resize', windowResize, true);

	// Add scroll event handler
	document.addEventListener('scroll', scrollHandler);

	// Add load event listener for detecting when portfolio images are loaded
	const projectImages = document.querySelectorAll('#active-portfolio-img');

	for(let i = 0; i < projectImages.length; i++) {
		projectImages[i].addEventListener('load', projectImgLoad);
    }
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
	let visibleHeight = 0;

	// If the bottom half of the section is visible
	if(sectionTopY < screenTopY && sectionBottomY > screenTopY) {
		visibleHeight = sectionHeight - (screenTopY - sectionTopY);
	}

	// If the top half of the section is visible
	if(sectionTopY >= screenTopY && screenBottomY > sectionTopY) {
		visibleHeight = windowHeight - (sectionTopY - screenTopY);
	}

	// Check if we need to trigger the #contact section animation
	triggerContactSectionAnim(section, sectionId, visibleHeight / sectionHeight);

	return visibleHeight;
}

function triggerContactSectionAnim(section, sectionId, visibleHeightPercentage) {
	if(consoleAnimTriggered || sectionId.toLowerCase().localeCompare('#contact') != 0
		|| visibleHeightPercentage < .5) {
		return;
	}

	addClass(section.querySelector('.console'), consoleAnimationClass);
	consoleAnimTriggered = true;
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

	skillsChartData = {
		ids: [
			'skill-html',
			'skill-bootstrap',
			'skill-jquery',
			'skill-vue',
			'skill-php',
			'skill-laravel',
			'skill-sql',
			'skill-aws',
		],
		labels: [
			'HTML/CSS/JS',
			'Bootstrap',
			'jQuery',
			'Vue',
			'PHP',
			'Laravel',
			'MySQL',
			'AWS',
		],
		sets: [
			[3,3,3,1,0,0,0,0],  // Front end
			[0,0,0,0,3,2,3,1]  // Back end
		]
	};

	setSkillsChartCardContent();

	skillsChartConfig = {
		type: 'radar',
		data: {
			labels: skillsChartData.labels,
			datasets: [
				{
					label: 'Front End',
					data: skillsChartData.sets[0],
					borderColor: mediumTurquoise,
					backgroundColor: mediumTurquoiseTrans3,
					pointBackgroundColor: mediumTurquoiseTrans3,
					pointHoverBorderColor: mediumTurquoise,
					pointHoverBackgroundColor: mediumTurquoiseTrans3,
				},
				{
					label: 'Back End',
					data: skillsChartData.sets[1],
					borderColor: rajah,
					backgroundColor: rajahTrans3,
					pointBackgroundColor: rajahTrans3,
					pointHoverBorderColor: rajah,
					pointHoverBackgroundColor: rajahTrans3,
				}
			],
		},
		options: {
			color: white,
			maintainAspectRatio: false,
			responsive: true,
			onClick: chartClick,
			onHover: chartHover,
			plugins: {
				title: {
					color: white,
					display: true,
					text: 'Years of Experience',
				},
			},
			elements: {
				point: {
					borderWidth: 2,
					pointHoverBorderWidth: 3,
					radius: 5,
					hoverRadius: 8,
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
						backdropPadding: 3,
						color: black,
						count: 4,
						stepSize: 1,
						z: 1,
					},
				},
			},
		},
	};

	skillsChart = new Chart(skillsChartContext, skillsChartConfig);
	
	setSkillsChartGradient();
}

/*
 * Sets the skills chart card text.
 */
function setSkillsChartCardContent() {
	setSkillsChartCardContentHelper(skillsChartData.sets[0]);
	setSkillsChartCardContentHelper(skillsChartData.sets[1]);
}

/*
 * Sets the skills chart card text based on the given years of experience.
 */
function setSkillsChartCardContentHelper(dataSet) {
	for(let i = 0; i < dataSet.length; i++) {
		let yearsXp = dataSet[i];

		if(yearsXp == 0) {
			continue;
		}

		let id = '#' + skillsChartData.ids[i];
		let text = yearsXp + ' year experience';

		if(yearsXp > 1) {
			text = yearsXp + ' years experience';
		}

		document.querySelector(id + ' .card-content p').textContent = text;
	}
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
 * Responds to chart point click event by showing the appropriate skills card.
 */
function chartClick(event) {
	const id = getSkillsChartEventId(event);

	if(!id) {
		return;
	}

	lastClickedSkillId = id;
}

/*
 * Shows the appropriate skill card on chart point
 * hover and reverts to the last clicked card on exit.
 */
function chartHover(event) {
	const id = getSkillsChartEventId(event);

	// Akin to a skill point mouseLeave event, so show the last clicked skill card
	if(!id) {
		showSkillsCard(lastClickedSkillId);
		return;
    }

	// If a skill other than the one last clicked is being hovered, show that card
	if(lastClickedSkillId.localeCompare(id) != 0) {
		showSkillsCard(id);
	}
}

/*
 * Returns the element of the chart that was interacted with by the given event.
 */
function getSkillsChartEventElement(event) {
	return skillsChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
}

/*
 * Returns the ID string of the chart element interacted with by the given event.
 */
function getSkillsChartEventId(event) {
	const element = getSkillsChartEventElement(event);

	if(element.length <= 0) {
		return;
    }

	const datasetIndex = element[0].datasetIndex;
	const index = element[0].index;

	if(skillsChartData.sets[datasetIndex][index] == 0) {
		return;
	}

	return skillsChartData.ids[index];
}

/*
 * Hides all skill cards then shows the one matching the given ID.
 */
function showSkillsCard(id) {
	const section = document.getElementById('skills');
	const cards = section.querySelectorAll('.card');

	for(let i = 0; i < cards.length; i++) {
		if(cards[i].attributes.id.value.toLowerCase().localeCompare(id) == 0) {
			skillsChartActivePoint = id;
			removeClass(cards[i], hiddenClass);
			continue;
        }

		addClass(cards[i], hiddenClass);
	}
}

/*
 * Updates the skills chart background gradient.
 */
function windowResize() {
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
function previewClick(event) {
	if(hasClass(this, activeClass)) {
		return;
    }

	const projectName = this.dataset.project;
	const project = document.getElementById(projectName + '-content');

	// Hide the main image and show the preloader spinner
	const mainImg = project.querySelector('#active-portfolio-img');
	togglePortfolioImgPreloader(project, mainImg);

	// Set the main image from the clicked preview image's src
	const src = this.src.replace('.png', '.gif');
	mainImg.src = src;

	// Set the preloader height from the height of the image that is currently loading
	let poll = setInterval(function() {
		if(mainImg.naturalHeight) {
			clearInterval(poll);
			const width = mainImg.naturalWidth;
			const height = mainImg.naturalHeight;
			let parentWidth = getComputedStyle(mainImg.parentElement).width;
			parentWidth = parentWidth.replace(new RegExp('px', 'i'), '');
			const adjustedHeight = height * (parentWidth / width) + 'px';
			project.querySelector('.preloader-outer-wrapper').style.height = adjustedHeight;
		}
	}, 10);

	// Hide all the feature descriptions
	let selector = 'ul[data-project="' + projectName + '"]';
	const descriptions = project.querySelectorAll(selector);

	for(let i = 0; i < descriptions.length; i++) {
		addClass(descriptions[i], hiddenClass);
	}

	// Show the description for the clicked preview image
	const projectFeature = this.dataset.projectFeature;
	selector = 'ul[data-project-feature="' + projectFeature + '"]';
	const featureDescription = project.querySelector(selector);
	removeClass(featureDescription, hiddenClass);

	// Add the active class to the clicked preview image
	const activeImages = project.querySelectorAll('.portfolio-preview.active');

	for(let i = 0; i < activeImages.length; i++) {
		removeClass(activeImages[i], activeClass);
	}

	addClass(this, activeClass);
}

/*
 * If a portfolio project image is loaded, hide its preloader spinner.
 */
function projectImgLoad(event) {
	if(this.complete) {
		const projectName = this.dataset.project;
		const project = document.getElementById(projectName + '-content');
		togglePortfolioImgPreloader(project, this);
    }
}

/*
 * Takes the main image for some portfolio project and
 * toggles it and its associated preloader spinner.
 */
function togglePortfolioImgPreloader(project, image) {
	const preloader = project.querySelector('.preloader-outer-wrapper');

	// Show the preloader
	if(hasClass(preloader, hiddenClass)) {
		removeClass(preloader, hiddenClass);
		addClass(image, hiddenClass);
		return;
    }

	// Hide the preloader
	removeClass(image, hiddenClass);
	addClass(preloader, hiddenClass);
}

/*
 * Sets the active portfolio project.
 */
function cardClick(event) {
	if(event.target.tagName.toLowerCase().localeCompare('a') == 0) {
		return;
    }

	const target = event.currentTarget;
	const id = target.attributes['data-project-content-id'].value;
	const projects = document.querySelectorAll('.project');

	// Hide all projects
	for(let i = 0; i < projects.length; i++) {
		addClass(projects[i], hiddenClass);
	}

	const project = document.getElementById(id);

	// Need to trigger a click on the first project preview image
	project.querySelector('.portfolio-preview:first-of-type').click();

	// Show the project
	removeClass(project, hiddenClass);

	// Scroll to top of portfolio section
	const portfolioSection = document.querySelector('#portfolio');

	window.scrollTo({
		top: portfolioSection.offsetTop - navHeight,
		behavior: 'smooth',
	});
}
