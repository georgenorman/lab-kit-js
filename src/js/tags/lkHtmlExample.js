/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-html-example> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * Renders syntax-highlighted HTML code examples and then injects the raw HTML
 * into the DOM so the browser will render the examples live.
 *<p>
 * The tag attributes are read from the <code>lk-html-example</code> element, as shown in the examples below:
 *
 * <pre style="background:#eee; padding:6px;">
 * &lt;lk-html-example width="750px"&gt;
 *   &lt;htmlComment&gt;A comment rendered beneath the HTML header.&lt;/htmlComment&gt;
 *   &lt;resultComment&gt;A comment rendered beneath the Result header.&lt;/resultComment&gt;
 *
 *   &lt;script type="multiline-template" id="simpleTemplateHtml"&gt;
 *     &lt;span class="foo"&gt;This is red&lt;/span&gt;
 *   &lt;/script&gt;
 * &lt;/lk-html-example&gt;
 * </pre>
 *
 * <p style="padding-left:12px;">
 * <h6>Tag Attributes:</h6>
 * <table class="params">
 *   <thead><tr><th>Name</th><th class="last">Description</th></tr></thead>
 *   <tr><td class="name"><code>width</code></td><td>Width of the rendered example</td></tr>
 * </table>
 *
 * @module lkHtmlExampleTag
 */
var lkHtmlExampleTag = (function(tzDomHelper, tzCustomTagHelper, tzCodeHighlighter) {
  "use strict";

  var htmlCommentExpression = new RegExp("<htmlComment>((.|\n)*)<\/htmlComment>", "ig");
  var resultCommentExpression = new RegExp("<resultComment>((.|\n)*)<\/resultComment>", "ig");

  return {
    /**
     * Return the name of this tag.
     *
     * @returns {string}
     */
    getTagName: function() {
      return "lk-html-example";
    },

    /**
     * Render all <code>&lt;lk-html-example&gt;</code> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <code>&lt;lk-html-example&gt;</code> tag identified by the given <code>tagId</code>.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given <code>lkHtmlExampleTagNode</code>.
     *
     * @param lkHtmlExampleTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(lkHtmlExampleTagNode) {
      // get the rawHtml from the script tag
      var rawHtml = tzDomHelper.getFirstElementFromNodeByTagName(lkHtmlExampleTagNode, "script");

      // replace the leading newline and trailing white-space.
      rawHtml = rawHtml.replace(/^[\n]|[\s]+$/g, "");

      // build the context
      var context = {
        "htmlComment": tzCustomTagHelper.getFirstMatchedGroup(lkHtmlExampleTagNode, htmlCommentExpression),
        "rawHtml": rawHtml,
        "resultComment": tzCustomTagHelper.getFirstMatchedGroup(lkHtmlExampleTagNode, resultCommentExpression),
        "width": lkHtmlExampleTagNode.getAttribute("width"),
        "height": lkHtmlExampleTagNode.getAttribute("height")
      };

      // remove child nodes (e.g., optional comment nodes)
      tzDomHelper.removeAllChildNodes(lkHtmlExampleTagNode);

      // render the result
      this.render(lkHtmlExampleTagNode, context);
    },

    /**
     * Render the code examples and live code block, into the given <code>containerNode</code>.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *          <ul>
     *            <li>htmlComment: optional comment to render above the HTML code block.
     *            <li>rawHtml: the HTML code to insert.
     *            <li>resultComment: optional comment to render above the live result.
     *            <li>width: optional width (hack) to force the zebra stripes to fill the entire code area when scrolling is required.
     *            <li>height: optional height.
     *          </ul>
     */
    render: function(containerNode, context) {
      // render the HTML code example
      tzCodeHighlighter.render(containerNode, {
        "heading": "HTML",
        "codeBlockComment": context.htmlComment,
        "lang": "*ml",
        "width": context.width,
        "rawCode": context.rawHtml});

      // render the live HTML code
      // render heading
      tzDomHelper.createElementWithAdjacentHtml(containerNode, "h4", null, "Rendered Result");

      // render optional result comment, if present
      if (tzDomHelper.isNotEmpty(context.resultComment)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"className":"lk-live-code-block-comment"}', context.resultComment);
      }

      // render raw HTML from the template
      var div = tzDomHelper.createElementWithAdjacentHtml(containerNode, "div", '{"className":"lk-live-code-block"}', context.rawHtml);
      if (tzDomHelper.isNotEmpty(context.height)) {
        div.style.height = context.height;
      }
    }
  }

}(tzDomHelperModule, tzCustomTagHelperModule, tzCodeHighlighterModule));
