/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-css-html-example> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * The <code>&lt;lk-css-html-example&gt;</code> tag combines the features of the <code>&lt;lk-code-example&gt;</code>,
 * <code>&lt;lk-css-block&gt;</code> and <code>&lt;lk-html-block&gt;</code> tags.
 * This single tag can be used to render syntax-highlighted CSS and HTML code examples and then inject the raw CSS and HTML
 * into the DOM so the browser will render the examples live.
 *<p>
 * The tag attributes are read from the <code>lk-css-html-example</code> element, as shown in the examples below:
 *
 * <pre style="background:#eee; padding:6px;">
 *   &lt;lk-css-html-example cssTemplateId="basicBoxModelCss" htmlTemplateId="basicBoxModelHtml"&gt;
 *   &lt;/lk-css-html-example&gt;
 *
 *   &lt;lk-css-html-example htmlTemplateId="tmplExampleRelInStaticNoMarginHtml"&gt;
 *   &lt;/lk-css-html-example&gt;
 * </pre>
 *
 * <p style="padding-left:12px;">
 * <h6>Tag Attributes:</h6>
 * <table class="params">
 *   <thead><tr><th>Name</th><th class="last">Description</th></tr></thead>
 *   <tr><td class="name"><code>cssTemplateId</code></td><td>ID of the element containing the CSS code to insert</td><tr>
 *   <tr><td class="name"><code>htmlTemplateId</code></td><td>ID of the element containing the HTML code to insert</td><tr>
 *   <tr><td class="name"><code>templateId</code></td>
 *       <td>
 *         optional; use this instead of cssTemplateId and htmlTemplateId to simplify the code.
 *         "Css" and "Html" will be appended to the given templateId, to form the IDs to the CSS and HTML templates.
 *       </td><tr>
 * </table>
 *<p>
 * Complete Example:
 *
 * <pre style="background:#eee; padding:6px;">
 * &lt;script type="multiline-template" id="simpleTemplateCss"&gt;
 *   .foo {color: red;}
 * &lt;/script&gt;
 *
 * &lt;script type="multiline-template" id="simpleTemplateHtml"&gt;
 *   &lt;span class="foo"&gt;This is red&lt;/span&gt;
 * &lt;/script&gt;
 *
 * &lt;lk-css-html-example templateId="simpleTemplate" width="750px"&gt;
 *   &lt;cssComment&gt;A comment rendered beneath the CSS header.&lt;/cssComment&gt;
 *   &lt;htmlComment&gt;A comment rendered beneath the HTML header.&lt;/htmlComment&gt;
 *   &lt;resultComment&gt;A comment rendered beneath the Result header.&lt;/resultComment&gt;
 * &lt;/lk-css-html-example&gt;
 * </pre>
 *
 * @module lkCssHtmlExampleTag
 */
var lkCssHtmlExampleTag = (function(tzDomHelper, tzCustomTagHelper, lkCssBlock, lkHtmlBlock, lkCodeExample) {
  "use strict";

  var cssCommentExpression = new RegExp("<cssComment>((.|\n)*)<\/cssComment>", "ig");
  var htmlCommentExpression = new RegExp("<htmlComment>((.|\n)*)<\/htmlComment>", "ig");
  var resultCommentExpression = new RegExp("<resultComment>((.|\n)*)<\/resultComment>", "ig");

  return {
    /**
     * Return the name of this tag.
     *
     * @returns {string}
     */
    getTagName: function() {
      return "lk-css-html-example";
    },

    /**
     * Render all <code>&lt;lk-css-html-example&gt;</code> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <code>&lt;lk-css-html-example&gt;</code> tag identified by the given <code>tagId</code>.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given <code>lkHtmlCssExampleTagNode</code>.
     *
     * @param lkHtmlCssExampleTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(lkHtmlCssExampleTagNode) {
      // get the template IDs from the tag
      var cssTemplateId;
      var htmlTemplateId;
      if (tzDomHelper.isNotEmpty(lkHtmlCssExampleTagNode.getAttribute("templateId"))) {
        cssTemplateId = lkHtmlCssExampleTagNode.getAttribute("templateId") + "Css";
        htmlTemplateId = lkHtmlCssExampleTagNode.getAttribute("templateId") + "Html";
      } else {
        cssTemplateId = lkHtmlCssExampleTagNode.getAttribute("cssTemplateId");
        htmlTemplateId = lkHtmlCssExampleTagNode.getAttribute("htmlTemplateId");
      }

      // get css info from the tag
      var cssError = "";
      var cssComment = "";
      var rawCss = "";
      if (tzDomHelper.isNotEmpty(cssTemplateId)) {
        cssComment = tzCustomTagHelper.getFirstMatchedGroup(lkHtmlCssExampleTagNode, cssCommentExpression);
        rawCss = tzDomHelper.getInnerHtml(cssTemplateId);

        if (tzDomHelper.isEmpty(rawCss)) {
          cssError = "CSS Template was not found for given ID: " + cssTemplateId;
        }
      }

      // build the context
      var context = {
        "cssComment": cssComment,
        "rawCss": rawCss,
        "htmlComment": tzCustomTagHelper.getFirstMatchedGroup(lkHtmlCssExampleTagNode, htmlCommentExpression),
        "rawHtml": tzDomHelper.getInnerHtml(htmlTemplateId),
        "resultComment": tzCustomTagHelper.getFirstMatchedGroup(lkHtmlCssExampleTagNode, resultCommentExpression),
        "width": lkHtmlCssExampleTagNode.getAttribute("width"),
        "height": lkHtmlCssExampleTagNode.getAttribute("height")
      };

      // remove child nodes (e.g., optional comment nodes)
      tzDomHelper.removeAllChildNodes(lkHtmlCssExampleTagNode);

      // check for error
      if (tzDomHelper.isNotEmpty(cssError)) {
        tzDomHelper.createElementWithAdjacentHtml(lkHtmlCssExampleTagNode, "p", '{"style.color":"red"}', cssError);
      }

      // render the result (without CSS if error was encountered)
      this.render(lkHtmlCssExampleTagNode, context);
    },

    /**
     * Render the code examples and live code block, into the given <code>containerNode</code>.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *          <ul>
     *            <li>cssComment: optional comment to render above the CSS code block.
     *            <li>rawCss: the CSS code to insert.
     *            <li>htmlComment: optional comment to render above the HTML code block.
     *            <li>rawHtml: the HTML code to insert.
     *            <li>resultComment: optional comment to render above the live result.
     *            <li>width: optional width (hack) to force the zebra stripes to fill the entire code area when scrolling is required.
     *            <li>height: optional height.
     *          </ul>
     */
    render: function(containerNode, context) {
      // render the live CSS, if present
      if (tzDomHelper.isNotEmpty(context.rawCss)) {
        lkCssBlock.render(containerNode, context);

        // render the CSS code example
        lkCodeExample.render(containerNode, {
          "heading": "CSS",
          "codeBlockComment": context.cssComment,
          "lang": "css",
          "width": context.width,
          "rawCode": context.rawCss});
      }

      // render the HTML code example
      lkCodeExample.render(containerNode, {
        "heading": "HTML",
        "codeBlockComment": context.htmlComment,
        "lang": "*ml",
        "width": context.width,
        "rawCode": context.rawHtml});

      // render the live HTML code
      lkHtmlBlock.render(containerNode, {
        "heading": "Rendered Result",
        "resultComment": context.resultComment,
        "height": context.height,
        "rawHtml": context.rawHtml});
    }

  }

}(tzDomHelperModule, tzCustomTagHelperModule, lkCssBlockTag, lkHtmlBlockTag, lkCodeExampleTag));
