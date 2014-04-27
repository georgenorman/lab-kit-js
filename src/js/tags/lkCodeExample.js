/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-code-example> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * The <lk-code-example> tag renders an optional heading and comment, followed by a <code> block with the XML escaped text
 * extracted from the element with the specified templateId.
 *
 * The tag attributes are read from the lk-code-example element, as shown in the examples below:
 *
 *   <lk-code-example templateId="myHtmlTemplate" heading="HTML" lang="*ml" width="350px">
 *     <comment>HTML code example comment.</comment>
 *   </lk-code-example>
 *
 *   <lk-code-example templateId="myCssTemplate" heading="CSS" lang="css" width="300px">
 *     <comment>CSS code example comment.</comment>
 *   </lk-code-example>
 *
 * @attribute templateId - ID of the element containing the HTML or JavaScript code to render.
 * @attribute heading - heading text [optional]
 * @attribute lang - language ID for the code syntax highlighter (e.g., "css", "*ml").
 * @attribute width - optional width (hack) to force the zebra stripes to fill the entire code area when scrolling is required.
 */
var lkCodeExampleTag = (function(tzDomHelper, tzCustomTagHelper, tzCodeHighlighter) {
  "use strict";

  var commentExpression = new RegExp("<comment>((.|\n)*)<\/comment>", "ig");

  return {
    getTagName: function() {
      return "lk-code-example";
    },

    /**
     * Render all <lk-code-example> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <lk-code-example> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given lkCodeExampleTagNode.
     *
     * @param lkCodeExampleTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(lkCodeExampleTagNode) {
      var templateId = lkCodeExampleTagNode.getAttribute("templateId");

      // build the context
      var context = {
        "heading": lkCodeExampleTagNode.getAttribute("heading"),
        "codeBlockComment": tzCustomTagHelper.getFirstMatchedGroup(lkCodeExampleTagNode, commentExpression),
        "lang": lkCodeExampleTagNode.getAttribute("lang"),
        "width": lkCodeExampleTagNode.getAttribute("width"),
        "rawCode": tzDomHelper.getInnerHtml(templateId)
      };

      // remove the child nodes (e.g., optional codeBlockComment node)
      tzDomHelper.removeAllChildNodes(lkCodeExampleTagNode);

      // render the result
      this.render(lkCodeExampleTagNode, context);
    },

    /**
     * Render the code example into the given containerNode.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            - heading: optional heading to use.
     *            - codeBlockComment: optional comment to render above the code block.
     *            - lang: language ID for the code syntax highlighter (e.g., "css", "*ml").
     *            - width: optional width (hack) to force the zebra stripes to fill the entire code area when scrolling is required.
     *            - rawCode: the code that will be XML escaped and rendered into the given containerNode.
     */
    render: function(containerNode, context) {
      // render optional heading, if present
      if (tzDomHelper.isNotEmpty(context.heading)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "h4", null, context.heading);
      }

      // render optional HTML comment, if present
      if (tzDomHelper.isNotEmpty(context.codeBlockComment)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"className":"lk-code-example-comment"}', context.codeBlockComment);
      }

      // render raw code
      if (tzDomHelper.isEmpty(context.rawCode)) {
        // error - missing rawCode
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"style.color":"red"}', "Raw Code is missing");
      } else {
        // create <code> block for the code listing
        var codeElement = tzDomHelper.createElement(null, "code", '{"className":"lk-code-example"}');
        var olElement = tzDomHelper.createElement(codeElement, "ol");
        if (tzDomHelper.isNotEmpty(context.width)) {
          olElement.style.width = context.width;
        }

        // create a list item for each line (to display line numbers).
        var codeLines = context.rawCode.split("\n");
        for (var i = 0; i < codeLines.length; i++) {
          var escapedCodeLine = tzDomHelper.xmlEscape(codeLines[i]);
          // @-@:p0 Highlighter should be applied to the complete inner HTML, and not line-by-line as done here, but
          //        the closing list-item (</li>) breaks the span with the style, so keeping it simple and broken, for now.
          tzDomHelper.createElementWithAdjacentHtml(olElement, "li", null, " " + tzCodeHighlighter.highlight(escapedCodeLine, context.lang));
        }

        containerNode.appendChild(codeElement);
      }
     },

    /**
     * Refresh the tag (by removing the child elements and re-rendering the code example).
     *
     * @param tagId ID of the tag to refresh.
     */
    refreshTagById: function(tagId) {
      var lkCodeExampleTag = document.getElementById(tagId);

      // first, remove all child nodes, previously added from render (or renderAll).
      tzDomHelper.removeAllChildNodes(lkCodeExampleTag);

      // re-render the tag
      this.renderTag(lkCodeExampleTag);
    }
  }

}(tzDomHelperModule, tzCustomTagHelperModule, tzCodeHighlighterModule));
