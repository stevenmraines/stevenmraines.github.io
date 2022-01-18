/*import Chart from 'chart.js/auto';
import chroma from 'chroma-js';
import M from 'materialize-css';*/

const Chart = require('chart.js/auto');
const chroma = require('chroma-js');
const M = require('materialize-css');

let alabasterData;
let culturedData;
let darkLiverData;
let deepIndigoData;
let mediumTurquoiseData;
let raisinBlackData;
let rajahData;
let royalPurpleData;
let xiketicData;

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
let white = '#fff';
let whiteTrans3 = chroma(white).alpha(0.3).css('rgba');
let whiteTrans2 = chroma(white).alpha(0.2).css('rgba');
let whiteTrans1 = chroma(white).alpha(0.1).css('rgba');

let skillsChart;
let skillsChartContext;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Materialize mobile nav
	let elems = document.querySelectorAll('.sidenav');
    let instances = M.Sidenav.init(elems, {});

	// Attach window resize event
	let isIE = window.attachEvent;  // Support for Internet Explorer v9 and below

	if(isIE) {
		window.attachEvent('onresize', windowResize);
	}
	
	if(!isIE) {
		window.addEventListener('resize', windowResize, true);
	}

	// Initialize window resize on page load
	windowResize();

	// Get colors from the sass defined color palette as JS vars
	getColors();

	// Initialize skills radar chart
	initSkillsChart();
	
});

function getColors() {
	alabasterData = document.querySelector('input.alabaster[type="hidden"]');
	culturedData = document.querySelector('input.cultured[type="hidden"]');
	darkLiverData = document.querySelector('input.dark-liver[type="hidden"]');
	deepIndigoData = document.querySelector('input.deep-indigo[type="hidden"]');
	mediumTurquoiseData = document.querySelector('input.medium-turquoise[type="hidden"]');
	raisinBlackData = document.querySelector('input.raisin-black[type="hidden"]');
	rajahData = document.querySelector('input.rajah[type="hidden"]');
	royalPurpleData = document.querySelector('input.royal-purple[type="hidden"]');
	xiketicData = document.querySelector('input.xiketic[type="hidden"]');
	
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

function initSkillsChart() {
	skillsChartContext = document.getElementById('skillsChart').getContext('2d');

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
			responsive: true,
			color: white,
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

function setSkillsChartGradient() {
	const chartArea = skillsChart.chartArea;

	if(!chartArea) {
		// This case happens on initial chart load
		return;
	}
	
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

function windowResize() {
	let adjacent = window.innerWidth;
	let opposite = document.querySelector('#intro').clientHeight;

	// Set new angle of rotation
	let angle = Math.atan(opposite / adjacent) * (180 / Math.PI);
	let div1 = document.querySelector('#intro > div:nth-child(1)');
	let div2 = document.querySelector('#intro > div:nth-child(2)');
	div1.style.transform = "rotate(" + angle + "deg)";
	div2.style.transform = "rotate(-" + angle + "deg)";

	// Set new width
	let hypotenuse = Math.round(Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2)));
	div1.style.width = hypotenuse + "px";
	div2.style.width = hypotenuse + "px";

	// Update skills chart background color gradient
	if(!skillsChart) {
		return;
	}

	setSkillsChartGradient();
}

function navClick(element) {
	let classStr = 'active';
	let target = element.children[0].attributes.href.value;
	let navLinks = document.querySelectorAll("ul.nav-link-list li");
	let clickedLinks = document.querySelectorAll("ul.nav-link-list li a[href='" + target + "']");

	for(let i = 0; i < navLinks.length; i++) {
		removeClass(navLinks[i], classStr);
	}
	
	for(let i = 0; i < clickedLinks.length; i++) {
		addClass(clickedLinks[i].parentElement, classStr);
	}
}

function addClass(element, classStr) {
	// If class is already added, do nothing
	if((' ' + element.className + ' ').indexOf(' ' + classStr + ' ') >= 0) {
		return;
	}

	element.className += ' ' + classStr;
}

function removeClass(element, classStr) {
	let regex = new RegExp('(^| )' + classStr + '($| )', 'g');
	element.className = element.className.replace(regex, ' ');
}

function previewClick(img) {
	let activeClass = 'active';
	let hiddenClass = 'hidden';
	let src = img.src.replace('.png', '.gif');
	let project = img.dataset.project;
	let descriptions = document.querySelectorAll('p[data-project="' + project + '"]');
	let feature = img.dataset.projectFeature;
	let featureDescription = document.querySelector('p[data-project-feature="' + feature + '"]');

	for(let i = 0; i < descriptions.length; i++) {
		addClass(descriptions[i], hiddenClass);
	}

	removeClass(featureDescription, hiddenClass);

	document.getElementById('active-portfolio-img').src = src;
	
	let activeImages = document.querySelectorAll('.portfolio-preview.active');

	for(let i = 0; i < activeImages.length; i++) {
		removeClass(activeImages[i], activeClass);
	}

	addClass(img, activeClass);
}

function cardClick(idSelector) {
	let classStr = 'hidden';

	let projects = document.querySelectorAll('.project');

	for(let i = 0; i < projects; i++) {
		addClass(projects[i], classStr);
	}

	removeClass(document.getElementById(idSelector), classStr);
}
