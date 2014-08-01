/*
  ~ Copyright (c) 2014 George Norman.
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ --------------------------------------------------------------
  ~ Base Lab Kit module.
  ~ --------------------------------------------------------------
 */

/**
 * LabKit initialization module (e.g., causes all tags to be rendered).
 *
 * @module baseKitModule
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

      lkBulletPointTag.renderAll();
      lkNavigationBarTag.renderAll();

      lkCssExampleTag.renderAll();
      lkHtmlExampleTag.renderAll();
      lkJsExampleTag.renderAll();
      lkJsEvalExampleTag.renderAll();

      // these tags depend on the rendered output of the example tags (so they must be rendered after the examples).
      lkDisplayStylesTag.renderAll();
      lkAncestorStylesTag.renderAll();
    },

    /**
     * Hide the progress bar and show the main content.
     *
     * @param pageLoadProgressClassName class name used to style the progress bar. If no
     *   class name is provided, then uses the first &lt;progress&gt; element.
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
