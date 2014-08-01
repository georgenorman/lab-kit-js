/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-css-example> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * Renders a syntax-highlighted CSS code examples and then injects the raw CSS
 * into the DOM so the browser will render the example live.
 *<p>
 * The tag attributes are read from the <code>lk-css-example</code> element, as shown in the examples below:
 *
 * <pre style="background:#eee; padding:6px;">
 * &lt;lk-css-example width="750px"&gt;
 *   &lt;cssComment&gt;A comment rendered beneath the CSS header.&lt;/cssComment&gt;
 *   &lt;resultComment&gt;A comment rendered beneath the Result header.&lt;/resultComment&gt;
 *
 *   &lt;script type="multiline-template"&gt;
 *     .foo {color: red;}
 *   &lt;/script&gt;
 * &lt;/lk-css-example&gt;
 * </pre>
 *
 * <p style="padding-left:12px;">
 * <h6>Tag Attributes:</h6>
 * <table class="params">
 *   <thead><tr><th>Name</th><th class="last">Description</th></tr></thead>
 *   <tr><td class="name"><code>width</code></td><td>Width of the rendered example</td></tr>
 * </table>
 *<p>
 *
 * @module lkCssExampleTag
 */
var lkCssExampleTag = (function(tzDomHelper, tzCustomTagHelper, tzCodeHighlighter) {
  "use strict";

  var cssCommentExpression = new RegExp("<cssComment>((.|\n)*)<\/cssComment>", "ig");
  var resultCommentExpression = new RegExp("<resultComment>((.|\n)*)<\/resultComment>", "ig");

  return {
    /**
     * Return the name of this tag.
     *
     * @returns {string}
     */
    getTagName: function() {
      return "lk-css-example";
    },

    /**
     * Render all <code>&lt;lk-css-example&gt;</code> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <code>&lt;lk-css-example&gt;</code> tag identified by the given <code>tagId</code>.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given <code>lkCssExampleTagNode</code>.
     *
     * @param lkCssExampleTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(lkCssExampleTagNode) {
      var cssError = "";
      var cssComment = tzCustomTagHelper.getFirstMatchedGroup(lkCssExampleTagNode, cssCommentExpression);

      // get the raw css from the script tag
      var rawCss = tzDomHelper.getFirstElementFromNodeByTagName(lkCssExampleTagNode, "script");

      // replace the leading newline and trailing white-space.
      rawCss = rawCss.replace(/^[\n]|[\s]+$/g, "");

      // error if empty
      if (tzDomHelper.isEmpty(rawCss)) {
        cssError = "CSS Template was not found";
      }

      // build the context
      var context = {
        "cssComment": cssComment,
        "rawCss": rawCss,
        "resultComment": tzCustomTagHelper.getFirstMatchedGroup(lkCssExampleTagNode, resultCommentExpression),
        "width": lkCssExampleTagNode.getAttribute("width"),
        "height": lkCssExampleTagNode.getAttribute("height")
      };

      // remove child nodes (e.g., optional comment nodes)
      tzDomHelper.removeAllChildNodes(lkCssExampleTagNode);

      // check for error
      if (tzDomHelper.isEmpty(cssError)) {
        this.render(lkCssExampleTagNode, context);
      } else {
        tzDomHelper.createElementWithAdjacentHtml(lkCssExampleTagNode, "p", '{"style.color":"red"}', cssError);
      }
    },

    /**
     * Render the code examples and live code block, into the given <code>containerNode</code>.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *          <ul>
     *            <li>cssComment: optional comment to render above the CSS code block.
     *            <li>rawCss: the CSS code to insert.
     *            <li>resultComment: optional comment to render above the live result.
     *            <li>width: optional width (hack) to force the zebra stripes to fill the entire code area when scrolling is required.
     *            <li>height: optional height.
     *          </ul>
     */
    render: function(containerNode, context) {
      // render the live CSS
      if (tzDomHelper.isEmpty(context.rawCss)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"style.color":"red"}', "Raw CSS is missing");
      } else {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "style", null, context.rawCss);
      }

      // render the CSS code with syntax highlighting
      tzCodeHighlighter.render(containerNode, {
        "heading": "CSS",
        "codeBlockComment": context.cssComment,
        "lang": "css",
        "width": context.width,
        "rawCode": context.rawCss});
    }

  }

}(tzDomHelperModule, tzCustomTagHelperModule, tzCodeHighlighterModule));
