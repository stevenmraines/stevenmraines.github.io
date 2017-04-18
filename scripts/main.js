(function(window) {
	'use strict';

	// Variables
	var $ = window.jQuery;  // Import jQuery
	var BODY_SELECTOR = '[data-body-attribute="body"]';
	var NAV_BUTTON_SELECTOR = '[data-nav-button-attribute="nav-button"]';
	var NAV_LINK_SELECTOR = '[data-nav-link-attribute="nav-link"]';
	var SKILLS_ROW_SELECTOR = '[data-skills-row-attribute="skills-row"]';
	var SKILLS_ITEM_SELECTOR = '[data-skills-item-attribute="skills-item"]';
	var PORTFOLIO_ROW_SELECTOR = '[data-portfolio-row-attribute="portfolio-row"]';
	var PROJECT_LINK_SELECTOR = '[data-project-link-attribute="project-link"]';
	var navHeight = 50;  // Height of the navbar in pixels
	var navOffset = navHeight + 30;  // Nav height + offset for smooth scrolling

	function navClickHandler(event) {
		event.preventDefault();

		var navLink = $(NAV_LINK_SELECTOR, this);
		var navLinkTarget = $(navLink).attr('href');

		$('html, body').animate({
			scrollTop: $(navLinkTarget).offset().top - navOffset
		}, 1000);
	}

	function navScrollHandler(event) {
		event.preventDefault();

		var windowHeight = $(window).height() - navHeight;
		var scrollPosition = $(document).scrollTop() + navHeight;
		var sectionHeight;
		var sectionPosition;
		var buttons = $(NAV_BUTTON_SELECTOR);
		var sections = $(NAV_LINK_SELECTOR);
		var sectionTargets = {};
		var sectionVisibleAreas = {};
		var activeSectionIndex = 0;

		for(var k = 0; k < 5; k++) {
			sectionTargets[k] = $(sections[k]).attr('href');
		}

		for(var i = 0; i < 5; i++) {
			sectionHeight = $(sectionTargets[i]).height();
			sectionPosition = $(sectionTargets[i]).position().top;

			// If the section is above the top of the window
			if(sectionPosition + sectionHeight < scrollPosition) {
				sectionVisibleAreas[i] = 0;
				continue;
			}

			// If the bottom half of the section is visible
			if(sectionPosition < scrollPosition &&
					(sectionPosition + sectionHeight) > scrollPosition) {

				sectionVisibleAreas[i] = sectionHeight -
						(scrollPosition - sectionPosition);
				continue;
			}

			// If the top half of the section is visible
			if(sectionPosition > scrollPosition &&
					scrollPosition + windowHeight > sectionPosition) {

				sectionVisibleAreas[i] = windowHeight -
						(sectionPosition - scrollPosition);
				continue;
			}

			// If the section is below the bottom of the window
			if(sectionPosition > scrollPosition + windowHeight) {
				sectionVisibleAreas[i] = 0;
				continue;
			}
		}

		var greatestIndex = 0;

		for(var j = 0; j < 5; j++) {
			if(sectionVisibleAreas[j] >= greatestIndex) {
				greatestIndex = sectionVisibleAreas[j];
				activeSectionIndex = j;
			}
		}

		$(NAV_BUTTON_SELECTOR).each(function() {
			$(this).removeClass('active');
			$(NAV_LINK_SELECTOR, this).css({'color':'var(--nav-base-text)'});
		});

		$(buttons[activeSectionIndex]).addClass('active');
		$(NAV_LINK_SELECTOR, buttons[activeSectionIndex]).css({'color':'var(--nav-active-text)'});
	}

	//
	// OLD SCROLL HANDLER
	//
	/*
	function addNavScrollHandler(event) {
		event.preventDefault();

		var scrollPos = $(document).scrollTop() + navHeight;

		$(NAV_BUTTON_SELECTOR).each(function() {
			var $currentLink = $(NAV_LINK_SELECTOR, this);
			var $refElement = $($currentLink).attr('href');

			// Special case for contact section
			if($(window).scrollTop() + $(window).height() == $(document).height()) {

				$(NAV_BUTTON_SELECTOR).removeClass('active');
				$('nav div ul:nth-child(2) li:nth-child(5)').addClass('active');
   		} else if($($refElement).position().top - 30 <= scrollPos &&
					$($refElement).position().top + $($refElement).height() > scrollPos) {

				$(NAV_BUTTON_SELECTOR).removeClass('active');
				$(this).addClass('active');
			}
		});
	}
	*/

	function projectClickHandler(event) {
		event.preventDefault();

		var eventObj = $(this);

		$('html, body').animate({
			scrollTop: $('#portfolio').offset().top - navOffset + 115
		}, 1000);

		setTimeout(function() {
			$(PROJECT_LINK_SELECTOR).each(function() {
				var target = $(this).attr('href');
				$(target).addClass('hidden');
			});

			setTimeout(function() {
				var eventObjTarget = $(eventObj).attr('href');
				$(eventObjTarget).removeClass('hidden');
			}, 0);
		}, 1100);

		/*
		$(PROJECT_LINK_SELECTOR).each(function() {
			var target = $(this).attr('href');
			$(target).addClass('hidden');
		});

		var linkTarget = $(this).attr('href');
		$(linkTarget).removeClass('hidden');
		*/
	}

	// Use Modernizr to check flexbox support
	function checkFlexSupport() {
		// Either old Flexbox syntax, or `flex-wrap` not supported
		if (!(Modernizr.flexbox && Modernizr.flexwrap)) {
			$(SKILLS_ROW_SELECTOR).addClass('skills-noflex-row');

			$(SKILLS_ITEM_SELECTOR).each(function() {
				$(this).addClass('skills-noflex-item');
			});

			$(PORTFOLIO_ROW_SELECTOR).addClass('portfolio-noflex-row');

			$(PROJECT_LINK_SELECTOR).each(function() {
				var portfolioItem = $('div', this);
				$(portfolioItem).addClass('portfolio-noflex-item');
			});
		}
	}

	$(document).ready(function() {
		// Setup the page for the fade in effect
		$(BODY_SELECTOR).fadeOut(0);

		// Add nav button click handlers
		$(NAV_BUTTON_SELECTOR).each(function() {
			$(this).on('click', navClickHandler);
		});

		// Add document scroll handler
		$(document).on('scroll', navScrollHandler);

		// Add project button click handlers
		$(PROJECT_LINK_SELECTOR).each(function() {
			$(this).on('click', projectClickHandler);
		});

		checkFlexSupport();

		// Make page visible
		$(BODY_SELECTOR).fadeIn(1000);
	});
})(window);
