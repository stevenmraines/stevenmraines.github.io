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
	var classStr = 'active';

	document.getElementById('active-portfolio-img').src = img.src;
	
	var activeImages = document.querySelectorAll('.portfolio-preview.active');

	for(var i = 0; i < activeImages.length; i++) {
		removeClass(activeImages[i], classStr);
	}

	addClass(img, classStr);
}

function cardClick(idSelector) {
	var classStr = 'hidden';

	var projects = document.querySelectorAll('.project');

	for(var i = 0; i < projects; i++) {
		addClass(projects[i], classStr);
	}

	removeClass(document.getElementById(idSelector), classStr);
}
