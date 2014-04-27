/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-back-to> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/*
 * The <lk-back-to> tag renders back-to links: "Back to Index" and "Back to Table of Contents".
 *
 * The tag can be configured globally, via an init function, or individually via attributes read from the lk-back-to element:
 *
 * - Globally:
 *
 *    lkBackToTag.setGlobalLinks({"⬅ Back to Index":"./index.html", "⬆ Back to Table of Contents":"#tableOfContents"});
 *
 * - Locally:
 *
 *    <lk-back-to links='{"⬅ Back to Index":"./index.html", "⬆ Back to Table of Contents":"#tableOfContents"}'></lk-back-to>
 *
 * @attribute links - Series of links to render.
 */
var lkBackToTag = (function(tzDomHelper, tzCustomTagHelper) {
  "use strict";

  var globalLinks = null;

  return {
    getTagName: function() {
      return "lk-back-to";
    },

    /**
     * Render all <lk-back-to> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <lk-back-to> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given lkBackToTagNode.
     *
     * @param lkBackToTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(lkBackToTagNode) {
      // build the context
      var localLinksText = lkBackToTagNode.getAttribute("links");

      var context = {
        "links": tzDomHelper.isEmpty(localLinksText) ? null : JSON.parse(localLinksText)
      };

      // render the result
      this.render(lkBackToTagNode, context);
    },

    /**
     * Render the result into the given containerNode.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            - links: the links to render. If null, then uses globalLinks.
     */
    render: function(containerNode, context) {
      if (tzDomHelper.isEmpty(context.links)) {
        // use global links, if none provided by the tag's link attribute
        if (this.globalLinks == null) {
          tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"style.color":"red"}', "Global Links was not set for lkBackToTag.");
        } else {
          for (var key in this.globalLinks) {
            tzDomHelper.createElementWithAdjacentHtml(containerNode, "a", '{"href":"'+this.globalLinks[key]+'", "style.margin-right":"12px"}', key);
          }
        }
      } else {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "style", null, context.links);
      }
    },

    setGlobalLinks: function(globalLinks) {
      this.globalLinks = globalLinks;
    }
  }

}(tzDomHelperModule, tzCustomTagHelperModule));
