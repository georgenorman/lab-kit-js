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
 * Renders the raw JavaScript code, with syntax highlighting and line numbers,
 * and then executes it (via eval), so that the live results will be reflected in the DOM
 * (e.g., DOM manipulation, results logged to a panel, etc).
 * Optionally, if the evalCode attribute is set to false, the JavaScript will not be executed (via eval) or injected into the DOM
 * (but the syntax-highlighted code will still be rendered).
 * If the JavaScript code is required to be available to the DOM, then remove the 'type="multiline-template"' attribute from
 * the script tag.
 *
 * When using the evalCode='false' option, the lkResultLogger will not be available.
 * <p>
 * The tag attributes are read from the <code>lk-js-example</code> element, as shown in the examples below:
 *
 * <pre style="background:#eee; padding:6px;">
 * &lt;lk-js-example width="750px"&gt;
 *   &lt;codeComment&gt;A comment rendered beneath the JavaScript header, above the JavaScript code example.&lt;/codeComment&gt;
 *   &lt;resultComment&gt;A comment rendered beneath the rendered Result header.&lt;/resultComment&gt;
 *
 *   &lt;script type="multiline-template" id="simpleTemplateJs"&gt;
 *     lkResultLoggerModule.msg(navigator.appCodeName);
 *   &lt;/script&gt;
 * &lt;/lk-js-example&gt;
 * </pre>
 *
 * <p style="padding-left:12px;">
 * <h6>Tag Attributes:</h6>
 * <table class="params">
 *   <thead><tr><th>Name</th><th class="last">Description</th></tr></thead>
 *   <tr><td class="name"><code>width</code></td><td>Width of the rendered example</td></tr>
 *   <tr><td class="name"><code>logger-height</code></td><td>The constrained height for the logger output</td></tr>
 *   <tr><td class="name"><code>resultHeaderTitle</code></td><td>Optional header title for the result section</td></tr>
 * </table>
 *<p>
 *
 * @module lkJsExampleTag
 */
var lkJsExampleTag = (function(tzGeneralUtils, tzDomHelper, tzCustomTagHelper, tzCodeHighlighter, lkResultLogger) {
  "use strict";

  var codeCommentExpression = new RegExp("<codeComment>((.|\n)*)<\/codeComment>", "ig");
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
        "renderCode": lkJsExampleTagNode.getAttribute("renderCode") || true,
        "codeComment": tzCustomTagHelper.getFirstMatchedGroup(lkJsExampleTagNode, codeCommentExpression),
        "width": lkJsExampleTagNode.getAttribute("width"),

        "evalCode": lkJsExampleTagNode.getAttribute("evalCode") || true,
        "resultHeaderTitle": lkJsExampleTagNode.getAttribute("resultHeaderTitle"),
        "resultComment": tzCustomTagHelper.getFirstMatchedGroup(lkJsExampleTagNode, resultCommentExpression),
        "rawJs": rawJs,

        "loggerHeight": lkJsExampleTagNode.getAttribute("logger-height")
      };

      // remove child nodes (e.g., optional comment nodes)
      tzDomHelper.removeAllChildNodes(lkJsExampleTagNode);

      // render the result
      this.render(lkJsExampleTagNode, context);
    },

    /**
     * Render the code example and live code block, into the given <code>containerNode</code>.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *          <ul>
     *            <li>renderCode: if true (default), then render the <i>rawJs</i> code example, with syntax highlighting and line numbers;
     *                otherwise, the code example is not rendered (but the JavaScript may still be executed via eval).
     *                You may want to set this to false, if you want the code to be evaluated and results logged to the browser, but don't want the code to be displayed.
     *            <li>codeComment: optional comment to render above the JavaScript code example.
     *            <li>width: optional width (hack) to force the zebra stripes to fill the entire code example area when scrolling is required.
     *
     *            <li>evalCode: if true (default), then execute the JavaScript (via eval); otherwise, the code is not executed, but is rendered inline.
     *                You may want to set this to false, if you want the code to be displayed and be available to the DOM.
     *            <li>resultHeaderTitle: title for the results (if not provided, then defaults to "Rendered Result").
     *            <li>resultComment: optional comment to render above the evaluated result.
     *            <li>rawJs: the JavaScript code to execute.
     *            <li>loggerHeight: the constrained height for the logger output.
     *          </ul>
     */
    render: function(containerNode, context) {
      // render the JavaScript code example (optional)
      if (context.renderCode == true) {
        tzCodeHighlighter.render(containerNode, {
          "heading": "JavaScript",
          "codeBlockComment": context.codeComment,
          "lang": "js",
          "width": context.width,
          "rawCode": context.rawJs});
      }

      // execute the JavaScript code (optional)
      if (context.evalCode == true) {
        // render result heading
        var header = tzDomHelper.createElementWithAdjacentHtml(containerNode, "h5", null, tzGeneralUtils.coalesce(context.resultHeaderTitle, "Rendered Result"));

        // render optional result comment, if present
        if (tzGeneralUtils.isNotEmpty(context.resultComment)) {
          tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"className":"lk-live-code-block-comment"}', context.resultComment);
        }

        // create default ID, if id is missing
        if (tzGeneralUtils.isEmpty(context.id)) {
          context.id = "DefaultID" + ++defaultIdCounter;
        }

        // create the logger, for use by the code about to be executed (the code can lookup this logger by the id of its <lk-js-example> tag instance).
        var logger = createLogger(containerNode, context, header);

        try {
          eval(context.rawJs);
        } catch (e) {
          logger.msg("<span style='color:red;'>LabKit caught an Exception:<br> " + e.toString() + "</span>");
        }
      }
    }
  };

  // ------------------------------------------------------------------
  // Private functions
  // ------------------------------------------------------------------

  function createLogger(containerNode, context, header) {
    // create an element for the logger to render the results
    var outputNode = tzDomHelper.createElement(containerNode, "pre", '{"className":"lk-result-logger"}');
    if (tzGeneralUtils.isNotEmpty(context.loggerHeight)) {
      outputNode.style.maxHeight = context.loggerHeight;
    }

    // create the logger, for use by the code about to be executed (eval code will lookup logger by the id of this <lk-js-example> tag instance).
    var logger = lkResultLogger.createLogger(context.id, header, outputNode);

    // hide the logger (plus header), until (or unless) the experiment attempts to log a result.
    logger.hide();

    return logger;
  }

}(tzGeneralUtilsModule, tzDomHelperModule, tzCustomTagHelperModule, tzCodeHighlighterModule, lkResultLoggerModule));
