/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-js-example> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * Combines the features of the <code>&lt;lk-code-example&gt;</code>,
 * and <code>&lt;lk-js-block&gt;</code> tags.
 * This single tag can be used to render syntax-highlighted JavaScript code examples and then inject the raw JavaScript
 * into the DOM so the browser will render the examples live.
 *<p>
 * The tag attributes are read from the <code>lk-js-example</code> element, as shown in the examples below:
 *
 * <pre style="background:#eee; padding:6px;">
 * &lt;lk-js-example width="750px"&gt;
 *   &lt;jsComment&gt;A comment rendered beneath the JavaScript code example.&lt;/cssComment&gt;
 *   &lt;resultComment&gt;A comment rendered beneath the rendered Result header.&lt;/resultComment&gt;
 *
 *   &lt;script type="multiline-template" id="simpleTemplateJs"&gt;
 *     lkResultLoggerModule.log(navigator.appCodeName);
 *   &lt;/script&gt;
 * &lt;/lk-js-example&gt;
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
 * @module lkJsExampleTag
 */
var lkJsExampleTag = (function(tzDomHelper, tzCustomTagHelper, tzCodeHighlighter, lkResultLogger) {
  "use strict";

  var jsCommentExpression = new RegExp("<jsComment>((.|\n)*)<\/jsComment>", "ig");
  var resultCommentExpression = new RegExp("<resultComment>((.|\n)*)<\/resultComment>", "ig");
  var defaultIdCounter = 0;

  return {
    /**
     * Return the name of this tag.
     *
     * @returns {string}
     */
    getTagName: function() {
      return "lk-js-example";
    },

    /**
     * Render all <code>&lt;lk-js-example&gt;</code> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <code>&lt;lk-js-example&gt;</code> tag identified by the given <code>tagId</code>.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given <code>lkJsExampleTagNode</code>.
     *
     * @param lkJsExampleTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(lkJsExampleTagNode) {
      // get the raw JavaScript from the script tag
      var rawJs = tzDomHelper.getFirstElementFromNodeByTagName(lkJsExampleTagNode, "script");

      // replace the leading newline and trailing white-space.
      rawJs = rawJs.replace(/^[\n]|[\s]+$/g, "");

      // build the context
      var context = {
        "id": lkJsExampleTagNode.getAttribute("id"),
        "jsComment": tzCustomTagHelper.getFirstMatchedGroup(lkJsExampleTagNode, jsCommentExpression),
        "rawJs": rawJs,
        "resultComment": tzCustomTagHelper.getFirstMatchedGroup(lkJsExampleTagNode, resultCommentExpression),
        "width": lkJsExampleTagNode.getAttribute("width"),
        "height": lkJsExampleTagNode.getAttribute("height")
      };

      // remove child nodes (e.g., optional comment nodes)
      tzDomHelper.removeAllChildNodes(lkJsExampleTagNode);

      // render the result
      this.render(lkJsExampleTagNode, context);
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

      // create default ID, if id is missing
      if (tzDomHelper.isEmpty(context.id)) {
        context.id = "DefaultID" + ++defaultIdCounter;
      }

      // create an element for the logger to render the results
      var outputNode = tzDomHelper.createElement(containerNode, "pre", '{"className":"lk-live-code-block"}');
      if (tzDomHelper.isNotEmpty(context.height)) {
        outputNode.style.height = context.height;
      }

      // create the logger, for use by the code about to be executed (eval code will lookup logger by the id of this <lk-js-example> tag instance).
      var logger = lkResultLogger.createLogger(context.id, outputNode);

      try {
        eval(context.rawJs);
      } catch (e) {
        logger.log("<span style='color:red;'>LabKit caught exception: " + e.toString() + "</span>");
      }
    }
  }

}(tzDomHelperModule, tzCustomTagHelperModule, tzCodeHighlighterModule, lkResultLoggerModule));
