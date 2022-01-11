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
});

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
