jQuery(document).ready(function ($) {
  "use strict"

  jQuery('.tp-banner').show().revolution({
    dottedOverlay: "none",
    // delay:10000,
    startwidth: 1170,
    startheight: 700,
    navigationType: "bullet",
    navigationArrows: "solo",
    navigationStyle: "preview4",
    parallax: "mouse",
    parallaxBgFreeze: "on",
    parallaxLevels: [7, 4, 3, 2, 5, 4, 3, 2, 1, 0],
    keyboardNavigation: "on",
    shadow: 0,
    fullWidth: "on",
    fullScreen: "on",
    shuffle: "off",
    autoHeight: "off",
    forceFullWidth: "off",
    fullScreenOffsetContainer: ""
  });

});
