/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-css-block> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * The <code>&lt;lk-css-block&gt;</code> tag extracts the raw CSS, specified by the given <code>templateId</code>, and then injects it
 * live into the DOM, so that the styles may be applied to the current document
 * (this is done by rendering the extracted CSS into a &lt;style&gt; block).
 *<p>
 * The <code>&lt;lk-css-block&gt;</code> tag is often accompanied by the <code>&lt;lk-code-example&gt;</code> tag, which renders the same CSS,
 * but for presentation purposes only (with syntax highlighting and line numbers). This enables the same
 * code to be presented as an example and at the same time be live rendered into the DOM.
 *<p>
 * The tag attributes are read from the <code>lk-css-block</code> element, as shown in the example below:
 *
 * <pre style="background:#eee; padding:6px;">
 *   &lt;lk-css-block templateId="basicBoxModelCss"&gt;&lt;/lk-css-block&gt;
 * </pre>
 *
 * <p style="padding-left:12px;">
 * <h6>Tag Attributes:</h6>
 * <table class="params">
 *   <thead><tr><th>Name</th><th class="last">Description</th></tr></thead>
 *   <tr><td class="name"><code>templateId</code></td><td>ID of the element containing the CSS code to insert.</td><tr>
 * </table>
 *
 * @module lkCssBlockTag
 */
var lkCssBlockTag = (function(tzDomHelper, tzCustomTagHelper) {
  "use strict";

  return {
    /**
     * Return the name of this tag.
     *
     * @returns {string}
     */
    getTagName: function() {
      return "lk-css-block";
    },

    /**
     * Render all <code>&lt;lk-css-block&gt;</code> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <code>&lt;lk-css-block&gt;</code> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given <code>lkStyleTagNode</code>.
     *
     * @param lkStyleTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(lkStyleTagNode) {
      // build the context
      var context = {
        "rawCss": tzDomHelper.getInnerHtml(lkStyleTagNode.getAttribute("templateId"))
      };

      // render the result
      this.render(lkStyleTagNode, context);
    },

    /**
     * Render the <code>&lt;style&gt;</code> block into the given <code>containerNode</code>.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            <ul>
     *              <li>rawCss: the raw styles to render into the given containerNode.
     *            </ul>
     */
    render: function(containerNode, context) {
      if (tzDomHelper.isEmpty(context.rawCss)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"style.color":"red"}', "Raw CSS is missing");
      } else {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "style", null, context.rawCss);
      }
    }
  }

}(tzDomHelperModule, tzCustomTagHelperModule));
