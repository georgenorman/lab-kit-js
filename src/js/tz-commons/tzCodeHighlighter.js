/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders code with syntax highlighting and line numbers.
 ~ --------------------------------------------------------------
 */

/**
 * Renders code with syntax highlighting and line numbers.
 *
 * @module tzCodeHighlighterModule
 */
var tzCodeHighlighterModule = (function(tzGeneralUtils, tzDomHelper) {
  "use strict";

  var commentExpression = new RegExp("<comment>((.|\n)*)<\/comment>", "ig");

  return {

    /**
     * Render a code example into the given <code>containerNode</code>.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *          <ul>
     *            <li>heading: optional heading to use.
     *            <li>codeBlockComment: optional comment to render above the code block.
     *            <li>lang: language ID for the code syntax highlighter (e.g., "css", "*ml").
     *            <li>width: optional width (hack) to force the zebra stripes to fill the entire code area when scrolling is required.
     *            <li>rawCode: the code that will be XML escaped and rendered into the given containerNode.
     *          </ul>
     */
    render: function(containerNode, context) {
      // render optional heading, if present
      if (tzGeneralUtils.isNotEmpty(context.heading)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "h5", null, context.heading);
      }

      // render optional comment, if present
      if (tzGeneralUtils.isNotEmpty(context.codeBlockComment)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"className":"lk-code-example-comment"}', context.codeBlockComment);
      }

      // render raw code, with syntax highlighting
      if (tzGeneralUtils.isEmpty(context.rawCode)) {
        // error - missing rawCode
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"style.color":"red"}', "Raw Code is missing");
      } else {
        // create <code> block for the code listing
        var codeElement = tzDomHelper.createElement(null, "code", '{"className":"lk-code-example"}');
        var olElement = tzDomHelper.createElement(codeElement, "ol");
        if (tzGeneralUtils.isNotEmpty(context.width)) {
          olElement.style.width = context.width;
        }

        // prepare to shift all lines left, by the amount of whitespace on first line (extra leading whitespace is a side-effect of template)
        // @-@:p0 DANGEROUS if first line has more spaces than any line that follows
        var leadingSpaces = context.rawCode.match(/^ +/);
        var numLeadingSpaces = leadingSpaces == null ? 0 : leadingSpaces[0].length;

        // create a list item for each line (to display line numbers).
        var codeLines = context.rawCode.split("\n");
        for (var i = 0; i < codeLines.length; i++) {
          var shiftedStr = codeLines[i].substr(numLeadingSpaces); // shift left, to compensate for template padding
          var escapedCodeLine = tzGeneralUtils.xmlEscape(shiftedStr);
          // @-@:p0 Highlighter should be applied to the complete inner HTML, and not line-by-line as done here, but
          //        the closing list-item (</li>) breaks the span with the style, so keeping it simple and broken, for now.
          tzDomHelper.createElementWithAdjacentHtml(olElement, "li", null, " " + this.highlight(escapedCodeLine, context.lang));
        }

        containerNode.appendChild(codeElement);
      }
    },

    /**
     * Highlight the single line of code for the given language.
     *
     * @param code line of code to highlight.
     * @param lang language syntax used to highlight.
     * @returns {*}
     */
    highlight: function(code, lang) {
      var result = code;

      // simple quoted strings
      result = result.replace(/(["'])(.*?)\1/gm, "[[quoted-string]]$1$2$1[[/quoted-string]]"); // matches quoted string: e.g., "foo"

      // simple comments
      result = result.replace(/(\/\/.*$)/gm, "[[comment]]$1[[/comment]]"); // matches javascript comment: e.g., // comment
      result = result.replace(/(\/\*[\s\S]+?\*\/)/gm, "[[comment]]$1[[/comment]]"); // matches css/javascript comment: e.g., /* comment */
      result = result.replace(/(<!--[\s\S]*?-->)/gm, "[[comment]]$1[[/comment]]"); // matches *ml comment: e.g., <!-- comment -->
      result = result.replace(/(&lt;!--[\s\S]*?--&gt;)/gm, "[[comment]]$1[[/comment]]"); // matches escaped *ml comment: e.g., <!-- comment -->

      if (lang === '*ml') {
        // simple tags
        result = result.replace(/(&lt;[-\w]+|&lt;\w+|&lt;\/[-\w]+&gt;)/gm, "[[tag-name]]$1[[/tag-name]]"); // matches tag: e.g., <div ...> or </div>

        // simple xml attributes
        result = result.replace(/([-\w]+=)/gm, "[[attribute-name]]$1[[/attribute-name]]"); // matches attribute name: e.g., foo=

        // un-escape
        result = result.replace(/\[\[tag-name\]\]/gm, "<span class='tz-highlight-tag-name'>").replace(/\[\[\/tag-name\]\]/gm, "</span>");
        result = result.replace(/\[\[attribute-name\]\]/gm, "<span class='tz-highlight-attribute-name'>").replace(/\[\[\/attribute-name\]\]/gm, "</span>");
      } else if (lang === 'css') {
        // selector
        result = result.replace(/(.*\{|\})/gm, "[[css-selector]]$1[[/css-selector]]"); // matches css selector: e.g., .foo {

        // property
        result = result.replace(/(.*:)/gm, "[[css-property]]$1[[/css-property]]"); // matches css property: e.g., margin-top:

        // un-escape
        result = result.replace(/\[\[css-selector\]\]/gm, "<span class='tz-highlight-css-selector'>").replace(/\[\[\/css-selector\]\]/gm, "</span>");
        result = result.replace(/\[\[css-property\]\]/gm, "<span class='tz-highlight-css-property'>").replace(/\[\[\/css-property\]\]/gm, "</span>");
      }

      // un-escape
      result = result.replace(/\[\[quoted-string\]\]/gm, "<span class='tz-highlight-comment'>").replace(/\[\[\/quoted-string\]\]/gm, "</span>");
      result = result.replace(/\[\[comment\]\]/gm, "<span class='tz-highlight-comment'>").replace(/\[\[\/comment\]\]/gm, "</span>");

      return result;
    }
  }

}(tzGeneralUtilsModule, tzDomHelperModule));
