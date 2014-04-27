/*
  ~ Copyright (c) 2014 George Norman.
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ --------------------------------------------------------------
  ~ Base Lab Kit module.
  ~ --------------------------------------------------------------
 */

var baseKitModule = (function(tzDomHelper) {
  "use strict";

  return {
    /**
     * Do page setup (e.g., render all tags).
     */
    handleOnLoad: function() {
      // Tags common to all Labs
      lkTableOfContentsTag.renderAll();
      lkCssBlockTag.renderAll();
      lkCodeExampleTag.renderAll();
      lkHtmlBlockTag.renderAll();
      lkCssHtmlExampleTag.renderAll();
      lkDisplayStylesTag.renderAll();
      lkAncestorStylesTag.renderAll();
      lkBulletPointTag.renderAll();
      lkBackToTag.renderAll();
    },

    /**
     * Hide the progress bar and show the main content.
     * @param pageLoadProgressClassName class name used to style the progress bar. If no
     *   class name is provided, then uses the first <progress> element.
     */
    handlePageLoadCompleted: function( pageLoadProgressClassName ) {
      var progressBar = tzDomHelper.isEmpty(pageLoadProgressClassName) ? tzDomHelper.getFirstElementByTagName("progress") : document.querySelector("."+pageLoadProgressClassName);

      if (progressBar != null) {
        progressBar.style.display = "none";
        tzDomHelper.getFirstElementByTagName("main").style.display = "block";
      }
    }
  };

}(tzDomHelperModule));
