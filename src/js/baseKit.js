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
    }
  };

}(tzDomHelperModule));
