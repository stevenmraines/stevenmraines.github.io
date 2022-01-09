document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {});
});

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
