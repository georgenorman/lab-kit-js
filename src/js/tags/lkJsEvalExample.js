/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-js-eval-example> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * Combines the features of the <code>&lt;lk-code-example&gt;</code>,
 * and <code>&lt;lk-js-block&gt;</code> tags.
 * This single tag can be used to render syntax-highlighted JavaScript code examples and then inject the raw JavaScript
 * into the DOM so the browser will render the examples live.
 *<p>
 * The tag attributes are read from the <code>lk-js-eval-example</code> element, as shown in the examples below:
 *
 * <pre style="background:#eee; padding:6px;">
 * &lt;lk-js-eval-example width="750px"&gt;
 *   &lt;jsComment&gt;A comment rendered beneath the JavaScript code example.&lt;/cssComment&gt;
 *   &lt;resultComment&gt;A comment rendered beneath the rendered Result header.&lt;/resultComment&gt;
 *
 *   &lt;script type="multiline-template" id="simpleTemplateJs"&gt;
 *     lkResultLoggerModule.log(navigator.appCodeName);
 *   &lt;/script&gt;
 * &lt;/lk-js-eval-example&gt;
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
 * @module lkJsEvalExampleTag
 */
var lkJsEvalExampleTag = (function(tzDomHelper, tzCustomTagHelper, tzCodeHighlighter, lkResultLogger) {
  "use strict";

  var jsCommentExpression = new RegExp("<jsComment>((.|\n)*)<\/jsComment>", "ig");
  var resultCommentExpression = new RegExp("<resultComment>((.|\n)*)<\/resultComment>", "ig");

  return {
    /**
     * Return the name of this tag.
     *
     * @returns {string}
     */
    getTagName: function() {
      return "lk-js-eval-example";
    },

    /**
     * Render all <code>&lt;lk-js-eval-example&gt;</code> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <code>&lt;lk-js-eval-example&gt;</code> tag identified by the given <code>tagId</code>.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given <code>lkJsEvalExampleTagNode</code>.
     *
     * @param lkJsEvalExampleTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(lkJsEvalExampleTagNode) {
      // get the raw JavaScript from the script tag
      var rawJs = tzDomHelper.getFirstElementFromNodeByTagName(lkJsEvalExampleTagNode, "script");

      // replace the leading newline and trailing white-space.
      rawJs = rawJs.replace(/^[\n]|[\s]+$/g, "");

      // build the context
      var context = {
        "jsComment": tzCustomTagHelper.getFirstMatchedGroup(lkJsEvalExampleTagNode, jsCommentExpression),
        "rawJs": rawJs,
        "resultComment": tzCustomTagHelper.getFirstMatchedGroup(lkJsEvalExampleTagNode, resultCommentExpression),
        "width": lkJsEvalExampleTagNode.getAttribute("width"),
        "height": lkJsEvalExampleTagNode.getAttribute("height")
      };

      // remove child nodes (e.g., optional comment nodes)
      tzDomHelper.removeAllChildNodes(lkJsEvalExampleTagNode);

      // render the result
      this.render(lkJsEvalExampleTagNode, context);
    },

    /**
     * Render the code examples and live code block, into the given <code>containerNode</code>.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *          <ul>
     *            <li>jsComment: optional comment to render above the JavaScript code block.
     *            <li>rawJs: the JavaScript code to insert.
     *            <li>resultComment: optional comment to render above the live result.
     *            <li>width: optional width (hack) to force the zebra stripes to fill the entire code area when scrolling is required.
     *            <li>height: optional height.
     *          </ul>
     */
    render: function(containerNode, context) {
      // render the JavaScript code example
      tzCodeHighlighter.render(containerNode, {
        "heading": "JavaScript",
        "codeBlockComment": context.jsComment,
        "lang": "js",
        "width": context.width,
        "rawCode": context.rawJs});

      // render heading
      tzDomHelper.createElementWithAdjacentHtml(containerNode, "h4", null, "Rendered Result");

      // render optional result comment, if present
      if (tzDomHelper.isNotEmpty(context.resultComment)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"className":"lk-live-code-block-comment"}', context.resultComment);
      }

      // render raw JavaScript from the template
      //var script = tzDomHelper.createElementWithAdjacentHtml(containerNode, "script", '{"type":"text/javascript"}', context.rawJs);
      try {
        eval(context.rawJs);
      } catch (e) {
        lkResultLogger.log("<span style='color:red;'>LabKit caught exception: " + e.toString() + "</span>");
      }

      var pre = tzDomHelper.createElementWithAdjacentHtml(containerNode, "pre", '{"className":"lk-live-code-block"}', lkResultLogger.detachLoggedResultLinesAsString());
      if (tzDomHelper.isNotEmpty(context.height)) {
        pre.style.height = context.height;
      }
    }

  }

}(tzDomHelperModule, tzCustomTagHelperModule, tzCodeHighlighterModule, lkResultLoggerModule));
