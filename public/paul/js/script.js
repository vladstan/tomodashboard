(function($) {
  'use strict'; // Start of use strict

  // jQuery for page scrolling feature - requires jQuery Easing plugin
  $('a.page-scroll').bind('click', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1250, 'easeInOutExpo');
    event.preventDefault();
  });

  // Highlight the top nav as scrolling occurs
  $('body').scrollspy({
    target: '.navbar-fixed-top',
    offset: 100
  });

  // Closes the Responsive Menu on Menu Item Click
  $('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
  });

  // Offset for Main Navigation

  $('.js-nav').affix({
    offset: {
      top: window.innerHeight - 92
    }
  });

  $('.js-details-nav').affix({
    offset: {
      top: window.innerHeight
    }
  });

  $('.js-details-nav').on('affixed-top.bs.affix', function() {
    $('.js-details-nav').css({
      'z-index': 1030,
      'opacity': 1
    });
    $('.js-detailed-nav').removeClass('affix-top navbar-fixed-top');
    $('.details').css('padding-top', '0');
  }).on('affixed.bs.affix', function() {
    $('.js-details-nav').removeClass('affix').css({
      'z-index': -1,
      'opacity': 0
    });
    $('.js-detailed-nav').addClass('affix-top navbar-fixed-top');
    $('.details').css('padding-top', '110px');
  });

  $('.carousel').carousel({
    interval: false,
    wrap: false,
    keyboard: true
  });

  $('#adventures, #page').bind('slid.bs.carousel', function() {
    var $this = $(this);

    $this.children('.carousel-control').removeClass('hidden');

    if ($('.carousel-inner .item:last').hasClass('active')) {
      $this.children('.right.carousel-control').addClass('hidden');
    } else if ($('.carousel-inner .item:first').hasClass('active')) {
      $this.children('.left.carousel-control').addClass('hidden');
    }
  });

})(window.jQuery); // End of use strict
