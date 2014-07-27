/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-back-to> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * The <code>&lt;lk-back-to&gt;</code> tag renders a navigation bar, with the following links: "Back to Index" and "Back to Table of Contents".
 *<p>
 * The tag can be configured globally, via an init function, or individually via attributes read from the <code>lk-back-to</code> element:
 *
 *<ul>
 *  <li>Globally:
 * <pre style="background:#eee; padding:6px;">
 *  lkBackToTag.setGlobalLinks({
 *      "⬅ Back to Index":"./index.html",
 *      "⬆ Back to Table of Contents":"#tableOfContents"});
 * </pre>
 *
 *  <li>Locally:
 * <pre style="background:#eee; padding:6px;">
 *   &lt;lk-back-to
 *     links='{"⬅ Back to Index":"./index.html", "⬆ Back to ToC":"#tableOfContents"}'
 *   &gt;
 *   &lt;/lk-back-to&gt;
 * </pre>
 * </ul>
 *
 * <p style="padding-left:24px;">
 * <h6>Tag Attributes:</h6>
 * <table class="params">
 *   <thead><tr><th>Name</th><th class="last">Description</th></tr></thead>
 *   <tr><td class="name"><code>links</code></td><td>Series of links to render</td><tr>
 * </table>
 *
 * @module lkBackToTag
 */
var lkBackToTag = (function(tzDomHelper, tzCustomTagHelper) {
  "use strict";

  var globalLinks = null;

  return {
    /**
     * Return the name of this tag.
     *
     * @returns {string}
     */
    getTagName: function() {
      return "lk-back-to";
    },

    /**
     * Render all <code>&lt;lk-back-to&gt;</code> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <code>&lt;lk-back-to&gt;</code> tag identified by the given <code>tagId</code>.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given <code>lkBackToTagNode</code>.
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
     * Render the result into the given <code>containerNode</code>.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            <ul>
     *              <li>links: the links to render. If null, then uses <code>globalLinks</code>.
     *            </ul>
     */
    render: function(containerNode, context) {
      if (tzDomHelper.isEmpty(context.links)) {
        // use global links, if none provided by the tag's link attribute
        if (this.globalLinks == null) {
          tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"style.color":"red"}', "Global Links was not set for lkBackToTag.");
        } else {
          for (var key in this.globalLinks) {
            tzDomHelper.createElementWithAdjacentHtml(containerNode, "a", '{"href":"'+this.globalLinks[key]+'"}', key);
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
