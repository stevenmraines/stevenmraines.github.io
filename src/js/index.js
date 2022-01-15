import chroma from "chroma-js";
import M from "materialize-css";

var alabasterData;
var culturedData;
var darkLiverData;
var deepIndigoData;
var mediumTurquoiseData;
var raisinBlackData;
var rajahData;
var royalPurpleData;
var xiketicData;

var alabaster;
var cultured;
var darkLiver;
var deepIndigo;
var mediumTurquoise;
var raisinBlack;
var rajah;
var royalPurple;
var xiketic;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Materialize mobile nav
	var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {});
	
	// Attach window resize event
	var isIE = window.attachEvent;  // Support for Internet Explorer v9 and below

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
	initChart();
	
});

function getColors() {
	alabasterData = document.querySelector('div[data-color="alabaster"]');
	culturedData = document.querySelector('div[data-color="cultured"]');
	darkLiverData = document.querySelector('div[data-color="dark-liver"]');
	deepIndigoData = document.querySelector('div[data-color="deep-indigo"]');
	mediumTurquoiseData = document.querySelector('div[data-color="medium-turquoise"]');
	raisinBlackData = document.querySelector('div[data-color="raisin-black"]');
	rajahData = document.querySelector('div[data-color="rajah"]');
	royalPurpleData = document.querySelector('div[data-color="royal-purple"]');
	xiketicData = document.querySelector('div[data-color="xiketic"]');
	
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
	
	console.log(chroma(xiketic).hex() + ', ' + chroma(xiketic).hsl());
}

function initChart() {
	const context = document.getElementById('skillsChart').getContext('2d');
	var white = '#fff';
	var whiteTrans = 'rgba(255,255,255,.5)';

	const config = {
		type: 'radar',
		data: {
			labels: ['HTML/CSS/JS', 'Bootstrap', 'jQuery',
				'Vue', 'PHP', 'Laravel', 'MySQL', 'AWS'],
			datasets: [
				{
					label: 'Front End',
					data: [3,3,3,1,0,0,0,0],
					borderWidth: 3,
					borderColor: mediumTurquoise,
					backgroundColor: mediumTurquoise,
					pointBackgroundColor: mediumTurquoise,
				},
				{
					label: 'Back End',
					data: [0,0,0,0,3,2,3,1],
					borderWidth: 3,
					borderColor: rajah,
					backgroundColor: rajah,
					pointBackgroundColor: rajah,
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
			scales: {
				r: {
					backgroundColor: 'rgba(255,255,255,.1)',
					angleLines: {
						color: whiteTrans,
					},
					grid: {
						color: whiteTrans,
					},
					pointLabels: {
						color: white,
					},
					ticks: {
						// color: white,
						count: 4,
						stepSize: 1,
					},
				},
			},
		},
	};

	const chart = new Chart(context, config);
	
	setChartBackgroundGradient(chart, context);
}

function setChartBackgroundGradient(chart, context) {
	const chartArea = chart.chartArea;

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

	const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
	gradient.addColorStop(0, 'transparent');
	gradient.addColorStop(.7, 'rgba(255,255,255,.1)');
	gradient.addColorStop(1, 'rgba(255,255,255,.3)');

	chart.config.options.scales.r.backgroundColor = gradient;
	chart.update();
}

function windowResize() {
	var adjacent = window.innerWidth;
	var opposite = document.querySelector('#intro').clientHeight;

	// Set new angle of rotation
	var angle = Math.atan(opposite / adjacent) * (180 / Math.PI);
	var div1 = document.querySelector('#intro > div:nth-child(1)');
	var div2 = document.querySelector('#intro > div:nth-child(2)');
	div1.style.transform = "rotate(" + angle + "deg)";
	div2.style.transform = "rotate(-" + angle + "deg)";

	// Set new width
	var hypotenuse = Math.round(Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2)));
	div1.style.width = hypotenuse + "px";
	div2.style.width = hypotenuse + "px";
}

function navClick(element) {
	var classStr = 'active';
	var target = element.children[0].attributes.href.value;
	var navLinks = document.querySelectorAll("ul.nav-link-list li");
	var clickedLinks = document.querySelectorAll("ul.nav-link-list li a[href='" + target + "']");

	for(var i = 0; i < navLinks.length; i++) {
		removeClass(navLinks[i], classStr);
	}
	
	for(var i = 0; i < clickedLinks.length; i++) {
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
	var regex = new RegExp('(^| )' + classStr + '($| )', 'g');
	element.className = element.className.replace(regex, ' ');
}

function previewClick(img) {
	var activeClass = 'active';
	var hiddenClass = 'hidden';
	var src = img.src.replace('.png', '.gif');
	var project = img.dataset.project;
	var descriptions = document.querySelectorAll('p[data-project="' + project + '"]');
	var feature = img.dataset.projectFeature;
	var featureDescription = document.querySelector('p[data-project-feature="' + feature + '"]');

	for(var i = 0; i < descriptions.length; i++) {
		addClass(descriptions[i], hiddenClass);
	}

	removeClass(featureDescription, hiddenClass);

	document.getElementById('active-portfolio-img').src = src;
	
	var activeImages = document.querySelectorAll('.portfolio-preview.active');

	for(var i = 0; i < activeImages.length; i++) {
		removeClass(activeImages[i], activeClass);
	}

	addClass(img, activeClass);
}

function cardClick(idSelector) {
	var classStr = 'hidden';

	var projects = document.querySelectorAll('.project');

	for(var i = 0; i < projects; i++) {
		addClass(projects[i], classStr);
	}

	removeClass(document.getElementById(idSelector), classStr);
}
