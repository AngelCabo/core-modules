'use strict';

requirejs(['jquery'], function ($) {
    console.log('init:testHelper');

    // a tags seem to get blocked on a lot of sites, including our own
    $( 'body' ).append( '<div id="activate-extension" style="position: absolute !important; top: 0px !important; color: transparent !important; background-color: transparent !important;" class="test-helper">Activate Extension</div>' );

    $('#activate-extension').click(function () {
      console.log('testHelper:clipper-activated');
      chrome.extension.sendMessage({ data	: {event: 'test:clipper-activated'} });
    });

    return true;
  }
);
