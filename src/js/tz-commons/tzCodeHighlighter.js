/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 */

/*
 * A crude (hack), SINGLE-LINE code highlighter, that only highlights basic code elements (e.g., some c-style comments, etc).
 * Has many, many bugs - borderline suitable for the simple code examples in these labs.
 */
var tzCodeHighlighterModule = (function() {
  "use strict";

  return {
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
        result = result.replace(/(&lt;\w+&gt;|&lt;\w+|&lt;\/\w+&gt;)/gm, "[[tag-name]]$1[[/tag-name]]"); // matches tag: e.g., <div ...> or </div>

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
}());
