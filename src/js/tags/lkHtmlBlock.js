/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-html-block> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * The <code>&lt;lk-html-block&gt;</code> tag extracts the raw HTML, specified by the given <code>templateId</code>, and then injects it
 * into the DOM, so that the HTML is rendered live by the current document.
 *<p>
 * The <code>&lt;lk-html-block&gt;</code> tag is often accompanied by the <code>&lt;lk-code-example&gt;</code> tag, which renders the same HTML,
 * but for presentation purposes only (with syntax highlighting and line numbers). This enables the same
 * code to be presented as an example and at the same time be live rendered into the DOM.
 *<p>
 * The tag attributes are read from the <code>lk-html-block</code> element, as shown in the example below:
 *
 * <pre style="background:#eee; padding:6px;">
 *   &lt;lk-html-block templateId="basicBoxModelHtml" heading="Rendered Result"&gt;
 *     &lt;comment&gt;Optional Comment&lt;/comment&gt;
 *   &lt;/lk-html-block&gt;
 * </pre>
 *
 * <p style="padding-left:12px;">
 * <h6>Tag Attributes:</h6>
 * <table class="params">
 *   <thead><tr><th>Name</th><th class="last">Description</th></tr></thead>
 *   <tr><td class="name"><code>templateId</code></td><td>ID of the element containing the raw HTML code to render.</td><tr>
 *   <tr><td class="name"><code>heading</code></td><td>heading text [optional]</td><tr>
 * </table>
 *
 * @module lkHtmlBlockTag
 */
var lkHtmlBlockTag = (function(tzDomHelper, tzCustomTagHelper) {
  "use strict";

  var commentExpression = new RegExp("<comment>((.|\n)*)</comment>", "ig");

  return {
    /**
     * Return the name of this tag.
     *
     * @returns {string}
     */
    getTagName: function() {
      return "lk-html-block";
    },

    /**
     * Render all <code>&lt;lk-html-block&gt;</code> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <code>&lt;lk-html-block&gt;</code> tag identified by the given <code>tagId</code>.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given <code>lkHtmlTagNode</code>.
     *
     * @param lkHtmlTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(lkHtmlTagNode) {
      var templateId = lkHtmlTagNode.getAttribute("templateId");
      var heading = lkHtmlTagNode.getAttribute("heading");
      if (tzDomHelper.isEmpty(heading)) {
        heading = "Rendered Result";
      }

      // build the context
      var context = {
        "heading": heading,
        "resultComment": tzCustomTagHelper.getFirstMatchedGroup(lkHtmlTagNode, commentExpression),
        "rawHtml": tzDomHelper.getInnerHtml(templateId)
      };

      // remove all child nodes, previously added from render (or renderAll).
      tzDomHelper.removeAllChildNodes(lkHtmlTagNode);

      // render the result
      this.render(lkHtmlTagNode, context);
    },

    /**
     * Render the HTML code block into the given <code>containerNode</code>.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *           <ul>
     *             <li>heading: optional heading to display for the live code block.
     *             <li>resultComment: optional comment to render above the live result.
     *             <li>rawHtml: the code that will be rendered into the given containerNode.
     *           <ul>
     */
    render: function(containerNode, context) {
      // render optional heading, if present
      if (tzDomHelper.isNotEmpty(context.heading)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "h4", null, context.heading);
      }

      // render optional result comment, if present
      if (tzDomHelper.isNotEmpty(context.resultComment)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"className":"lk-html-block-comment"}', context.resultComment);
      }

      // render raw HTML from the template
      var div = tzDomHelper.createElementWithAdjacentHtml(containerNode, "div", '{"className":"lk-html-block"}', context.rawHtml);
      if (tzDomHelper.isNotEmpty(context.height)) {
        div.style.height = context.height;
      }
    }
  }
}(tzDomHelperModule, tzCustomTagHelperModule));
