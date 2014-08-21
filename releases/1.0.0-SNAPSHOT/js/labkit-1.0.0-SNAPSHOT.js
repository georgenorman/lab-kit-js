/*!
  ~ labKit-1.0.0-SNAPSHOT.js
  ~ Copyright (c) 2014 George Norman
  ~ Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
*/
/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Simple logger functions - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * Formats strings, for use in a console log.
 * A cheap way to log a message, yet preserve the source link back to the origin in the source code.
 *<p>
 * Example:
 * <pre style="background:#eee; padding:6px;">
 *   console.log(logHelper.warning("Didn't find an element with ID: " + elementId));
 * </pre>
 *
 * @module tzLogHelperModule
 */
var tzLogHelperModule = (function() {
  "use strict";

  var loggingEnabled = false;

  return {
    /**
     * Enable logging.
     */
    enableLogging: function() {
      loggingEnabled = true;
    },

    /**
     * Disable logging.
     */
    disableLogging: function() {
      loggingEnabled = false;
    },

    /**
     * Log a debug message.
     *
     * @param message the message to log, if logging is enabled.
     */
    debug: function(message, object) {
      if (loggingEnabled) {
        console.log( new Date().toJSON() + " DEBUG: " + message, object );
      }
    },

    /**
     * Log a warning message.
     *
     * @param message the message to log, if logging is enabled.
     */
    warning: function(message, object) {
      if (loggingEnabled) {
        console.log( new Date().toJSON() + " WARN: " + message, object );
      }
    },

    /**
     * Log a error message.
     *
     * @param message the message to log, if logging is enabled.
     */
    error: function(message, object) {
      if (loggingEnabled) {
        var tracer = new Error();

        console.log( new Date().toJSON() + " ERROR: " + message + " - " + tracer.stack, object );
      }
     }
  }
}());

/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Simple DOM helper functions - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * A module that provides helper methods for DOM manipulation and node retrieval.
 *
 * @module tzDomHelperModule
 */
var tzDomHelperModule = (function( tzLogHelper ) {
  "use strict";

  return {
    /**
     * Return the inner HTML from an element with the given <code>elementId</code>.
     * Useful for returning multi-line strings from template blocks.
     *
     * @param elementId - ID of the element with the desired HTML.
     */
    getInnerHtml: function( elementId ) {
      var result = "";
      var element = document.getElementById( elementId );

      if (element) {
        result = element.innerHTML;
        // remove the leading and trailing newlines (side-effect of using template, the newline after the <script> tag is included).
        result = result.replace(/^\n|\s+$/g, '');
      }

      return result;
    },

    /**
     * Return the inner HTML from an element with the given <code>elementId</code>.
     * Useful for returning multi-line strings from template blocks.
     *
     * @param elementId - ID of the element with the desired HTML.
     */
    getInnerHtmlWithDefault: function( elementId ) {
      var result = this.getInnerHtml( elementId );

      return this.isEmpty( result ) ? '<span style="color:red;">No element found for ID: ' + elementId : result;
    },

    /**
     * Return the inner HTML as an array of lines, from an element with the given <code>elementId</code>.
     *
     * @param elementId - ID of the element with the desired HTML.
     */
    getInnerHtmlAsArray: function( elementId ) {
      var result = this.getInnerHtml( elementId ).split( "\n" );

      return result;
    },

    getFirstElementByTagName: function( tagName ) {
      var result = null;
      var elementList = document.getElementsByTagName( tagName );

      if (elementList === null || elementList.length === 0) {
        tzLogHelper.warning( "getFirstElementByTagName didn't find an element named: " + tagName );
      } else {
        result = elementList[0];
      }

      return result;
    },

    /**
     * Return the inner HTML, from the first child node of the given <code>parentNode</code>, that matches the given <code>tagName</code>.
     *
     * @param elementId - ID of the element with the desired HTML.
     */
    getFirstElementFromNodeByTagName: function(parentNode, tagName) {
      // get the raw css info from the script tag
      var result = "";
      var nodeList = parentNode.getElementsByTagName(tagName);

      if (nodeList !== null && nodeList.length !== 0) {
        result = nodeList[0].innerHTML;
      }

      return result;
    },

    /**
     * Return the value of the style property, for the element with the given <code>elementId</code>.
     *
     * @param elementId - ID of the target element.
     * @param stylePropertyName - name of the style property to retrieve the value for.
     */
    getStyleValueById: function( elementId, stylePropertyName ) {
      var result;
      var element = document.getElementById( elementId );

      if (element == null) {
        result = "getStyleValueById didn't find element with ID: " + elementId;
      } else {
        result = this.getStyleValue( element, stylePropertyName );
      }

      return result;
    },

    /**
     * Return the value of the style property, for the given <code>element</code>.
     *
     * @param element - target element.
     * @param stylePropertyName - name of the style property to retrieve the value for.
     */
    getStyleValue: function( element, stylePropertyName ) {
      var result;

      if (element == null) {
        result = "";
      } else {
        result = window.getComputedStyle( element ).getPropertyValue( stylePropertyName );
      }

      return result;
    },

    /**
     * Inserts a tag, with the given <code>tagName</code>, and inserts the given <code>innerHtml</code> inside the element.
     *
     * @param tagName - name of tag (e.g., h4 =&gt; &lt;h4&gt;).
     * @param innerHtml - HTML to write inside of element.
     */
    insertElement: function( tagName, innerHtml ) {
      insertLine( "<" + tagName + ">" + innerHtml + "</" + tagName + ">" );
    },

    /**
     * Inserts a tag, with the given <code>tagName</code> and <code>tagAttributes</code>, and then inserts the given <code>innerHtml</code> inside the element.
     *
     * @param tagName - name of tag (e.g., h4 =&gt; &lt;h4&gt;).
     * @param tagAttributes - attributes of tag element (e.g., class="foo" =&gt; &lt;someTag class="foo"&gt;).
     * @param innerHtml - HTML to write inside of element.
     */
    insertElementWithTagAttributes: function( tagName, tagAttributes, innerHtml ) {
      tagAttributes = (tagAttributes.length > 0) ? " " + tagAttributes : tagAttributes;
      insertLine( "<" + tagName + tagAttributes + ">" + innerHtml + "</" + tagName + ">" );
    },

    /**
     * Return a new element of type <code>elementName</code>, with optional <code>parent</code> and <code>attributes</code>.
     *
     * @param parent optional parent node for the new element.
     * @param elementName type of element to create
     * @param attributes optional attributes. Simple styles are supported (e.g., "style.color": "#800")
     * @returns {HTMLElement}
     */
    createElement: function(parent, elementName, attributes) {
      var result = document.createElement(elementName);

      if (this.isNotEmpty(attributes)) {
        var attributeMap = JSON.parse(attributes);
        for (var key in attributeMap) {
          // support simple styles
          if (key.indexOf("style.") == 0) {
            var styleKey = key.split(".")[1];
            result.style[styleKey] = attributeMap[key];
          } else {
            result[key] = attributeMap[key];
          }
        }
      }

      if (parent != null) {
        parent.appendChild(result);
      }

      return result;
    },

    createElementWithAdjacentHtml: function(parent, name, attributes, adjacentHtml) {
      var result = this.createElement(parent, name, attributes);

      result.insertAdjacentHTML("afterbegin", adjacentHtml);

      return result;
    },

    removeAllChildNodes: function( parentNode ) {
      while (parentNode.hasChildNodes()) {
        parentNode.removeChild( parentNode.lastChild );
      }
    },

    // @-@:p0 move to general utils
    xmlEscape: function( rawString ) {
      var result = rawString.replace( /&/g, "&amp;" ).replace( /</g, "&lt;" ).replace( />/g, "&gt;" );

      return result;
    },

    // @-@:p0 move to general utils
    splitWithTrim: function(srcString) {
      var result = this.isEmpty(srcString) ? srcString : srcString.split(/[\s,]+/);

      return result;
    },

    // @-@:p0 move to general utils
    quoteList: function( itemsArray ) {
      var result = "";

      if (itemsArray != null) {
        var separator = "";

        for (var i=0; i<itemsArray.length; i++) {
          result += separator + "\"" + itemsArray[i].trim() + "\"";
          separator = ",";
        }
      }

      return result;
    },

    /**
     * Returns the given <code>value</code> if not <code>null</code>, otherwise returns the given <code>defaultValue</code>.
     *
     * @param value - value to return if not <code>null</code>.
     * @param defaultValue - defaultValue to return if value is <code>null</code>.
     */
    // @-@:p0 move to general utils
    coalesce: function( value, defaultValue ) {
      var result = this.isEmpty( value ) ? defaultValue : value;

      tzLogHelper.debug( value );

      return result;
    },

    // @-@:p0 move to general utils
    isEmpty: function( value ) {
      var result = (value === undefined || value === null || value === "" || (value.hasOwnProperty("length") && value.length == 0));

      return result;
    },

    show: function( elementId ) {
      var element = document.getElementById( elementId );

      element.style.display = "block";
    },

    hide: function( elementId ) {
      var element = document.getElementById( elementId );

      element.style.display = "none";
    },

    // @-@:p0 move to general utils module
    isNotEmpty: function( value ) {
      return !this.isEmpty( value );
    },

    // @-@:p0 move to general utils module
    getProperties: function(obj) {
      var result = "";

      if (this.isNotEmpty(obj !== undefined && obj !== null )) {
        var separator = "";
        for(var propertyName in obj) {
          if (typeof(obj[propertyName]) != "undefined") {
            result += separator + propertyName + "=" + obj[propertyName];
            separator = ",\n";
          }
        }
      }

      return result;
    },

    /**
     * Registers the element, with the given triggerElementId, for onclick events.
     * For the first onclick event, it calls subject.on(). For the next onclick,
     * it calls subject.off() and then back to on for the third, etc.
     *
     * @param triggerElementId
     * @param subject
     */
    onclickEventToggler: function(triggerElementId, subject) {
      var state = false;

      document.getElementById( triggerElementId ).onclick = function(event) {
        if (state) {
          subject.off(event);
        } else {
          subject.on(event);
        }
        state = !state;
      }
    }
  };

  // ------------------------------------------------------------------
  // Private functions
  // ------------------------------------------------------------------

  /**
   * Inlines given text into document (equivalent to document.writeln).
   *
   * @param text - text to write.
   */
  function insertLine( text ) {
    document.writeln( text );
  }
}( tzLogHelperModule ));

/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Simple custom tag helper functions - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * A module that provides helper methods for custom tags.
 *
 * @module tzCustomTagHelperModule
 */
var tzCustomTagHelperModule = (function( tzDomHelper ) {
  "use strict";

  var templateVariableExpression = new RegExp( "{{(.*?)}}", "g" );

  return {
    /**
     * Return a generated template ID, by concatenating "-tag-template" to the tagModule's tag name.
     * <p>
     * Example: <code>tagModule.getTagName() + "-tag-template" =&gt; "lk-bullet-point-tag-template"</code>.
     *
     * @param tagModule the module that's responsible for rendering a particular custom tag.
     */
    getTemplateId: function( tagModule ) {
      return tagModule.getTagName() + "-tag-template";
    },

    /**
     * Render all custom tags, represented by the given <code>tagModule</code>, that appear on the current page.
     *
     * @param tagModule the module that's responsible for rendering a particular custom tag.
     */
    renderAll: function( tagModule ) {
      // find all tags
      var tagNodeList = document.getElementsByTagName( tagModule.getTagName() );

      // render each tag
      for (var i = 0; i < tagNodeList.length; i++) {
        var tagNode = tagNodeList[i];

        tagModule.renderTag( tagNode );
      }
    },

    /**
     * Render the first custom tag found in the DOM, represented by the given <code>tagModule</code>.
     * Typically called when there can be only one instance of a particular tag on a page (e.g., Table of Contents).
     *
     * @param tagModule the module that's responsible for rendering a particular custom tag.
     */
    renderFirst: function( tagModule ) {
      var tagNode = tzDomHelper.getFirstElementByTagName( tagModule.getTagName() );

      if (tagNode != null) {
        tagModule.renderTag( tagNode );
      }
    },

    /**
     * Render the single custom tag identified by the given <code>tagId</code>.
     *
     * @param tagModule the module that's responsible for rendering a particular custom tag.
     * @param tagId ID of the tag to render.
     */
    renderTagById: function( tagModule, tagId ) {
      var tagNode = tzDomHelper.getElementById( tagId );

      if (tagNode != null) {
        tagModule.renderTag( tagNode );
      }
    },

    /**
     * Render the custom tag, into the given <code>containerNode</code>, using an HTML <code>template</code>
     * that may have variables needing transliteration using the given <code>context</code>.
     *
     * @param containerNode where to render the result.
     * @param template the HTML template used to render the tag.
     * @param context a custom-tag specific JSON object that contains property values used for the transliteration process of the HTML template.
     */
    renderTagFromTemplate: function( containerNode, template, context ) { // context defined here is used by eval($1) below. The template must use {{context.foo}}.
      var evaluatedTemplate = template.replace( templateVariableExpression, function( $0, $1 ) {
        var result = eval( $1 ); // @-@:p1(geo) Check out "eval is evil" - investigate alternate solutions

        return result;
      } );

      containerNode.insertAdjacentHTML( "afterbegin", evaluatedTemplate );
    },

    /**
     * Return the template text from the node identified by the given <code>templateId</code>.
     *
     * @param templateId ID of the node that contains the template text.
     */
    getTemplate: function( templateId ) {
      var result = tzDomHelper.getInnerHtml( templateId );

      if (tzDomHelper.isEmpty( result )) {
        result = '<span style="color:red;">Template was not found: ' + templateId + '</span>';
      }

      return result;
    },

    /**
     * Return the first group, from the given <code>tagNode</code>, matching the given <code>innerTagExpression</code>.
     *
     * @param tagNode
     * @param innerTagExpression
     * @returns {*}
     */
    getFirstMatchedGroup: function(tagNode, innerTagExpression) {
      var result = null;
      if (tagNode.innerHTML.match(innerTagExpression)) {
        result = tagNode.innerHTML.match(innerTagExpression)[0].replace(innerTagExpression, "$1");
      }
      return result;
    }
  }
}( tzDomHelperModule ));

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
var tzCodeHighlighterModule = (function(tzDomHelper) {
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
      if (tzDomHelper.isNotEmpty(context.heading)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "h4", null, context.heading);
      }

      // render optional comment, if present
      if (tzDomHelper.isNotEmpty(context.codeBlockComment)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"className":"lk-code-example-comment"}', context.codeBlockComment);
      }

      // render raw code, with syntax highlighting
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

        // prepare to shift all lines left, by the amount of whitespace on first line (extra leading whitespace is a side-effect of template)
        // @-@:p0 DANGEROUS if first line has more spaces than any line that follows
        var leadingSpaces = context.rawCode.match(/^ +/);
        var numLeadingSpaces = leadingSpaces == null ? 0 : leadingSpaces[0].length;

        // create a list item for each line (to display line numbers).
        var codeLines = context.rawCode.split("\n");
        for (var i = 0; i < codeLines.length; i++) {
          var shiftedStr = codeLines[i].substr(numLeadingSpaces); // shift left, to compensate for template padding
          var escapedCodeLine = tzDomHelper.xmlEscape(shiftedStr);
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

}(tzDomHelperModule));

/*
  ~ Copyright (c) 2014 George Norman.
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ --------------------------------------------------------------
  ~ Base Lab Kit module.
  ~ --------------------------------------------------------------
 */

/**
 * LabKit initialization module (e.g., causes all tags to be rendered).
 *
 * @module baseKitModule
 */
var baseKitModule = (function(tzDomHelper) {
  "use strict";

  return {
    /**
     * Do page setup (e.g., render all tags).
     */
    handleOnLoad: function() {
      // Tags common to all Labs
      lkTableOfContentsTag.renderAll();

      lkApiReferenceTag.renderAll();
      lkBulletPointTag.renderAll();
      lkNavigationBarTag.renderAll();

      lkCssExampleTag.renderAll();
      lkHtmlExampleTag.renderAll();
      lkJsExampleTag.renderAll();

      // these tags depend on the rendered output of the example tags (so they must be rendered after the examples).
      lkDisplayStylesTag.renderAll();
      lkAncestorStylesTag.renderAll();
    },

    /**
     * Hide the progress bar and show the main content.
     *
     * @param pageLoadProgressClassName class name used to style the progress bar. If no
     *   class name is provided, then uses the first &lt;progress&gt; element.
     */
    handlePageLoadCompleted: function( pageLoadProgressClassName ) {
      var progressBar = tzDomHelper.isEmpty(pageLoadProgressClassName) ? tzDomHelper.getFirstElementByTagName("progress") : document.querySelector("."+pageLoadProgressClassName);

      if (progressBar != null) {
        progressBar.style.display = "none";
        tzDomHelper.getFirstElementByTagName("main").style.display = "block";
      }
    }
  };

}(tzDomHelperModule));

/*
  ~ Copyright (c) 2014 George Norman.
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ --------------------------------------------------------------
  ~ Lab Kit Logger module.
  ~ --------------------------------------------------------------
 */

/**
 * A simple message logger that caches items to a list, for future retrieval.
 *
 * @module lkResultLoggerModule
 */
var lkResultLoggerModule = (function(tzDomHelper, tzLogHelper) {
  "use strict";

  var loggers = {};

  /**
   * A logger that logs messages to a given DOM node.
   *
   * @param outputNode
   * @returns {{log: log}}
   * @constructor
   */
  function NodeLogger(header, outputNode) {
    var spinnerNode = tzDomHelper.createElementWithAdjacentHtml(outputNode, "div", '{"className":"lk-result-logger-loader"}', "<span></span><span></span><span></span><br>");

    hideSpinner();

    return {
      /**
       * Log the given message to the given output node.
       *
       * @param msg message to log
       */
      log: function( msg ) {
        if (msg === undefined) {
          this.logError("*Logger message is undefined*");
        } else {
          doLog(msg);
        }
      },

      /**
       * Log a label and value using the default styles (".lk-logger-label" and ".lk-logger-value") and an optional comment.
       *
       * @param label
       * @param value
       */
      logLabelValue: function(label, value, comment) {
        var comment2 = comment === undefined ? "" : " <small>(" + comment + ")</small>";

        doLog("<label>"+label+":</label> <output>"+ value + "</output>" + comment2)
      },

      /**
       * Log a label and value using the default styles (".lk-logger-label" and ".lk-logger-value") and an optional comment.
       *
       * @param label
       * @param value
       */
      logLabelPropertiesValue: function(label, value, comment) {
        var comment2 = comment === undefined ? "" : " <small>(" + comment + ")</small>";

        doLog("<label>"+label+":</label> <output>"+ tzDomHelper.getProperties(value) + "</output>" + comment2)
      },

      /**
       * Log an error message.
       *
       * @param errMsg
       */
      logError: function(errMsg) {
        doLog("<span style='color:red;'>" + errMsg + "</span>");
      },

      logDivider: function(color) {
        var hrColor = tzDomHelper.isEmpty(color) ? "#888" : color;
        doLog("<hr style='border:1px dotted " + hrColor + ";'>", false);
      },

      waiting: function() {
        showResultPanel();
        showSpinner();
      },

      hide: function() {
        hideResultPanel();
      },

      reset: function() {
        this.clear();
      },

      clear: function() {
        hideSpinner();
        outputNode.innerHTML = "";
      }
    };

    function doLog(msg, withNewline) {
      tzLogHelper.debug(msg);

      showResultPanel();
      hideSpinner();

      // log a new line by default (withNewline is empty) or if withNewline is true
      var eol = "";
      if (tzDomHelper.isEmpty(withNewline) || withNewline == true) {
        eol = "\n";
      }

      outputNode.innerHTML = outputNode.innerHTML + msg + eol;
    }

    function showResultPanel() {
      header.style.display = "block";
      outputNode.style.display = "block";
    }

    function hideResultPanel() {
      header.style.display = "none";
      outputNode.style.display = "none";
    }

    function showSpinner() {
      spinnerNode.style.display = "block";
    }

    function hideSpinner() {
      spinnerNode.style.display = "none";
    }
  }

  /**
   * A logger that logs messages to a cache, for later retrieval.
   *
   * @param name
   * @returns {{log: log, detachLoggedResultLines: detachLoggedResultLines, detachLoggedResultLinesAsString: detachLoggedResultLinesAsString}}
   * @constructor
   */
  function CacheLogger() {
    var loggedResultLines = [];

    return {
      log: function( msg ) {
        if (msg === undefined) {
          msg = "*Logger message is undefined*";
        }
        tzLogHelper.debug(msg);
        loggedResultLines[loggedResultLines.length++] = msg;
      },

      /**
       * Return the current list of results and reset the logger so that future items are added to a new list.
       *
       * @returns {Array}
       */
      detachLoggedResultLines: function() {
        var result = loggedResultLines;

        loggedResultLines = [];

        return result;
      },

      /**
       * Return the current list of results, as a string, and reset the logger so that future items are added to a new list.
       *
       * @returns {string}
       */
      detachLoggedResultLinesAsString: function() {
        var result = loggedResultLines.join("\n");

        loggedResultLines = [];

        return result;
      },

      reset: function() {
        loggedResultLines = [];
      }
    }
  }

  return {

    createLogger: function(name, header, outputNode) {
      var result = loggers[name];

      if (tzDomHelper.isEmpty(result)) {
        if (header === undefined || outputNode === undefined) {
          result = CacheLogger();
        } else {
          result = NodeLogger(header, outputNode);
        }

        loggers[name] = result;
      } else {
        throw "*The logger named '"+name+"' has already been created.*";
      }

      return result;
    },

    getLogger: function(name, reset) {
      var result = loggers[name];

      if (tzDomHelper.isEmpty(result)) {
        throw "*The logger named '"+name+"' does not exist. If you are using the &lt;lk-js-example&gt; tag, make sure its ID is '"+name+"'.*";
      }

      if (reset == true) {
        result.reset();
      }

      return result;
    }
  };

}(tzDomHelperModule, tzLogHelperModule));

/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-api-reference> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * Renders a simple panel for displaying a link to the API reference documentation, plus a summary of key interfaces.
 *<p>
 * The tag attributes are read from the <code>lk-api-reference</code> element, as shown in the example below:
 * <pre style="background:#eee; padding:6px;">
 *    &lt;lk-api-reference href="http://api.jquery.com/ready/"&gt;
 *      $( document ).ready( handler )<br>
 *      $( handler )
 *    &lt;/lk-api-reference&gt;
 * </pre>
 *
 * <p style="padding-left:12px;">
 * <h6>Tag Attributes:</h6>
 * <table class="params">
 *   <thead><tr><th>Name</th><th class="last">Description</th></tr></thead>
 *   <tr><td class="name"><code>href</code></td><td>URL to the API reference documentation.</td></tr>
 *   <tr><td class="name"><code>width</code></td><td>optional width for the wrapper div.</td></tr>
 * </table>
 *
 * @module lkApiReferenceTag
 */
var lkApiReferenceTag = (function(tzDomHelper, tzCustomTagHelper) {
  "use strict";

  var template =
      ['<div class="group">',
       '  <div><a href="{{context.href}}">api</a></div>',
       '  <div>{{context.rawRightColumnHtml}}</div>',
       '</div>'
      ].join('\n');

  return {
    /**
     * Return the name of this tag.
     *
     * @returns {string}
     */
    getTagName: function() {
      return "lk-api-reference";
    },

    /**
     * Render all <code>&lt;lk-api-reference&gt;</code> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <code>&lt;lk-api-reference&gt;</code> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given <code>lkApiReferenceTagNode</code>.
     *
     * @param lkApiReferenceTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(lkApiReferenceTagNode) {
      // build the context
      var width = lkApiReferenceTagNode.getAttribute("width");
      var context = {
        "href": lkApiReferenceTagNode.getAttribute("href"),
        "width": lkApiReferenceTagNode.getAttribute("width"),
        "rawRightColumnHtml": lkApiReferenceTagNode.innerHTML.trim()
      };

      // remove child nodes (e.g., rawRightColumnHtml retrieved for use by the right column)
      tzDomHelper.removeAllChildNodes(lkApiReferenceTagNode);

      // render the result
      this.render(lkApiReferenceTagNode, context);
    },

    /**
     * Render the <code>&lt;lk-api-reference&gt;</code> tag into the given <code>containerNode</code>.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *           <ul>
     *             <li>href: URL to the API reference documentation.
     *             <li>width: optional width for the wrapper div.
     *             <li>rawRightColumnHtml: the raw HTML to render into the right column (e.g., APIs to be referenced).
     *           </ul>
     */
    render: function(containerNode, context) {
      //var template = tzCustomTagHelper.getTemplate(this.getTagName() + "Template"); // @-@:p1(geo) Experimental

      tzCustomTagHelper.renderTagFromTemplate(containerNode, template, context);

      // update the width
      if (tzDomHelper.isNotEmpty(context.width)) {
        containerNode.style.width = context.width;
      }
    }
  };

}(tzDomHelperModule, tzCustomTagHelperModule));

/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-bullet-point> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * Renders a status icon on the left followed by an HTML block on the right.
 *<p>
 * The tag attributes are read from the <code>lk-bullet-point</code> element, as shown in the example below:
 * <pre style="background:#eee; padding:6px;">
 *    &lt;lk-bullet-point iconClass="success" leftColumnWidth="25px"&gt;
 *      This experiment successfully shows that...
 *    &lt;/lk-bullet-point&gt;
 * </pre>
 *
 * <p style="padding-left:12px;">
 * <h6>Tag Attributes:</h6>
 * <table class="params">
 *   <thead><tr><th>Name</th><th class="last">Description</th></tr></thead>
 *   <tr><td class="name"><code>iconClass</code></td><td>class name used to style the &lt;i&gt; element used as a placeholder for the icon. </td></tr>
 *   <tr><td class="name"><code>leftColumnWidth</code></td>
 *       <td>
 *         optional width of the left column.
 *         The following icons are predefined: "lk-bullet-point-pass", "lk-bullet-point-fail" (see css/lkBulletPoint.css).
 *       </td>
 *   </tr>
 *   <tr><td class="name"><code>style</code></td><td>optional style for the wrapper div.</td></tr>
 * </table>
 *
 * @module lkBulletPointTag
 */
var lkBulletPointTag = (function(tzDomHelper, tzCustomTagHelper) {
  "use strict";

  var template =
      ['<div class="group" {{context.styleAttribute}}>',
       '  <div><i class="{{context.iconClass}}"></i></div>',
       '  <div style="margin-left:{{context.leftColumnWidth}};">{{context.rawRightColumnHtml}}</div>',
       '</div>'
      ].join('\n');

  return {
    /**
     * Return the name of this tag.
     *
     * @returns {string}
     */
    getTagName: function() {
      return "lk-bullet-point";
    },

    /**
     * Render all <code>&lt;lk-bullet-point&gt;</code> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <code>&lt;lk-bullet-point&gt;</code> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given <code>lkBulletPointTagNode</code>.
     *
     * @param lkBulletPointTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(lkBulletPointTagNode) {
      // build the context
      var style = lkBulletPointTagNode.getAttribute("style");
      var context = {
        "iconClass": lkBulletPointTagNode.getAttribute("iconClass"), // class name
        "styleAttribute": tzDomHelper.isEmpty(style) ? "" : "style='" + style + "'", // complete style attribute
        "leftColumnWidth": tzDomHelper.coalesce(lkBulletPointTagNode.getAttribute("leftColumnWidth"), "24px"),
        "rawRightColumnHtml": lkBulletPointTagNode.innerHTML
      };

      // remove child nodes (e.g., rawRightColumnHtml retrieved for use by the right column)
      tzDomHelper.removeAllChildNodes(lkBulletPointTagNode);

      // render the result
      this.render(lkBulletPointTagNode, context);
    },

    /**
     * Render the <code>&lt;lk-bullet-point&gt;</code> tag into the given <code>containerNode</code>.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *           <ul>
     *             <li>iconClass: css used to render an icon in the left column.
     *             <li>leftColumnWidth: width of the left column.
     *             <li>styleAttribute: optional style for the wrapper div.
     *             <li>rawRightColumnHtml: the raw HTML to render into the right column.
     *           </ul>
     */
    render: function(containerNode, context) {
      //var template = tzCustomTagHelper.getTemplate(this.getTagName() + "Template"); // @-@:p1(geo) Experimental

      tzCustomTagHelper.renderTagFromTemplate(containerNode, template, context);
    }
  };

}(tzDomHelperModule, tzCustomTagHelperModule));

/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-navigation-bar> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * Renders a navigation bar, typically configured with the following links: "Back to Index" and "Back to Table of Contents".
 *<p>
 * The tag can be configured globally, via an init function, or individually via attributes read from the <code>lk-navigation-bar</code> element:
 *
 *<ul>
 *  <li>Globally:
 * <pre style="background:#eee; padding:6px;">
 *  lkNavigationBarTag.setGlobalLinks({
 *      "⬅ Back to Index":"./index.html",
 *      "⬆ Back to Table of Contents":"#tableOfContents"});
 * </pre>
 *
 *  <li>Locally:
 * <pre style="background:#eee; padding:6px;">
 *   &lt;lk-navigation-bar
 *     links='{"⬅ Back to Index":"./index.html", "⬆ Back to ToC":"#tableOfContents"}'
 *   &gt;
 *   &lt;/lk-navigation-bar&gt;
 * </pre>
 * </ul>
 *
 * <p style="padding-left:24px;">
 * <h6>Tag Attributes:</h6>
 * <table class="params">
 *   <thead><tr><th>Name</th><th class="last">Description</th></tr></thead>
 *   <tr><td class="name"><code>links</code></td><td>Series of links to render</td></tr>
 * </table>
 *
 * @module lkNavigationBarTag
 */
var lkNavigationBarTag = (function(tzDomHelper, tzCustomTagHelper) {
  "use strict";

  var globalLinks = null;

  return {
    /**
     * Return the name of this tag.
     *
     * @returns {string}
     */
    getTagName: function() {
      return "lk-navigation-bar";
    },

    /**
     * Render all <code>&lt;lk-navigation-bar&gt;</code> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <code>&lt;lk-navigation-bar&gt;</code> tag identified by the given <code>tagId</code>.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given <code>lkNavigationBarTagNode</code>.
     *
     * @param lkNavigationBarTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(lkNavigationBarTagNode) {
      // build the context
      var localLinksText = lkNavigationBarTagNode.getAttribute("links");

      var context = {
        "links": tzDomHelper.isEmpty(localLinksText) ? null : JSON.parse(localLinksText)
      };

      // render the result
      this.render(lkNavigationBarTagNode, context);
    },

    /**
     * Render the result into the given <code>containerNode</code>.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            <ul>
     *              <li>links: the links to render. If null, then uses <code>globalLinks</code>.
     *            </ul>
     */
    render: function(containerNode, context) {
      if (tzDomHelper.isEmpty(context.links)) {
        // use global links, if none provided by the tag's link attribute
        if (this.globalLinks == null) {
          tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"style.color":"red"}', "Global Links was not set for lkNavigationBarTag.");
        } else {
          for (var key in this.globalLinks) {
            tzDomHelper.createElementWithAdjacentHtml(containerNode, "a", '{"href":"'+this.globalLinks[key]+'"}', key);
          }
        }
      } else {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "style", null, context.links);
      }
    },

    setGlobalLinks: function(globalLinks) {
      this.globalLinks = globalLinks;
    }
  }

}(tzDomHelperModule, tzCustomTagHelperModule));

/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-table-of-contents> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * Auto-generates a simple two-level Table of Contents.
 * A default title of "Table of Contents" will be used if the title is not provided.
 * The title is rendered as an h2 element.
 *<p>
 * Limitations:
 * <ol>
 *   <li> There can be only one Table of Contents section per page.
 *   <li> Maximum levels is two.
 * </ol>
 *
 * The tag attributes are read from the lkTableOfContents element, as shown in the example below:
 * <pre style="background:#eee; padding:6px;">
 *    &lt;lk-table-of-contents class="toc" level1ItemsTagName="h2" level2ItemsTagName="h3"&gt;
 *    &lt;/lk-table-of-contents&gt;
 * </pre>
 *
 * <p style="padding-left:12px;">
 * <h6>Tag Attributes:</h6>
 * <table class="params">
 *   <thead><tr><th>Name</th><th class="last">Description</th></tr></thead>
 *   <tr><td class="name"><code>class</code></td><td>the CSS class to apply to the rendered Table of Contents</td></tr>
 *   <tr><td class="name"><code>level1ItemsTagName</code></td>
 *       <td>
 *         tag name used to identify the level-1 headers to be included in the Table of Contents
 *         (e.g., "h2" would cause all h2 elements on the page, to be used as items in the generated Table of Contents).
 *       </td>
 *   </tr>
 *   <tr><td class="name"><code>level2ItemsTagName</code></td>
 *       <td>
 *         tag name used to identify the level-2 headers to be included under each level-1 header
 *         (e.g., "h3" would cause all h3 elements on the page, to be used as sub-items in the generated Table of Contents).
 *       </td>
 *   </tr>
 *   <tr><td class="name"><code>title</code></td><td>optional title (default is "Table of Contents").</td></tr>
 * </table>
 *
 * @module lkTableOfContentsTag
 */
var lkTableOfContentsTag = (function(tzDomHelper, tzCustomTagHelper) {
  "use strict";

  return {
    /**
     * Return the name of this tag.
     *
     * @returns {string}
     */
    getTagName: function() {
      return "lk-table-of-contents";
    },

    /**
     * Render the 'Table of Contents' tag.
     */
    renderAll: function() {
      // there can be only one 'table of contents' per page.
      tzCustomTagHelper.renderFirst(this);
    },

    /**
     * Render the 'Table of Contents' tag identified by the given <code>tagId</code>.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given <code>lkHtmlTagNode</code>.
     *
     * @param tocNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(tocNode) {
      // get the attributes
      var context = {
        "cssClassName": tocNode.getAttribute("class"),
        "level1ItemsTagName": tocNode.getAttribute("level1ItemsTagName"),
        "level2ItemsTagName": tocNode.getAttribute("level2ItemsTagName"),
        "title": tocNode.getAttribute("title")
      };

      // render the result
      this.render(tocNode, context);
    },

    /**
     * Render the 'Table of Contents' into the given <code>containerNode</code>.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *           <ul>
     *             <li>cssClassName: css class name to use for the Table of Contents.
     *             <li>level1ItemsTagName: tag name used to identify the level-1 headers to be included in the Table of Contents.
     *             <li>level2ItemsTagName: tag name used to identify the level-2 headers to be included under each level-1 header.
     *             <li>title: optional title (default is "Table of Contents").
     *           <ul>
     */
    render: function(containerNode, context) {
      // find all level-1 nodes
      var level1NodeList = document.getElementsByTagName(context.level1ItemsTagName);

      // find all level-2 nodes (if tag name is given)
      var level2NodeList = null;
      if (tzDomHelper.isNotEmpty(context.level2ItemsTagName)) {
        level2NodeList = document.getElementsByTagName(context.level2ItemsTagName);
      }

      // start ToC
      var toc = tzDomHelper.createElement(null, "ul", '{"className":"'+tzDomHelper.coalesce(context.cssClassName, "toc")+'"}'); // default to "toc"

      // generate list of level-1 and level-2 ToC items
      for (var i = 0; i < level1NodeList.length; i++) {
        // there will always be a level-1 item, so create and initialize
        var tocLevel1Item = createTableOfContentsItem(level1NodeList[i]);

        // level-2 items are optional
        var currentLevel2Nodes = findAllNodesWithIdsThatBeginWith(level2NodeList, level1NodeList[i].id + ".");
        if (currentLevel2Nodes.length > 0) {
          var level2ItemList = document.createElement("ul");

          for (var j = 0; j < currentLevel2Nodes.length; j++) {
            level2ItemList.appendChild(createTableOfContentsItem(currentLevel2Nodes[j]));
          }

          tocLevel1Item.appendChild(level2ItemList);
        }

        toc.appendChild(tocLevel1Item);
      }

      // add heading
      context.title = tzDomHelper.coalesce(context.title, "Table of Contents");
      tzDomHelper.createElementWithAdjacentHtml(containerNode,"h2", '{"id":"tableOfContents"}', "<b>" + context.title + "</b>");

      // add all items to ToC element
      containerNode.appendChild(toc);
    }
  };

  // --------------------------------------------------------
  // private functions
  // --------------------------------------------------------

  /**
   * Return the subset of given nodesToSearch, that have IDs that begin with the given searchString.
   *
   * @param nodesToSearch list of nodes to search
   * @param searchString string
   */
  function findAllNodesWithIdsThatBeginWith(nodesToSearch, searchString) {
    var result = [];

    if (nodesToSearch != null) {
      for (var i = 0; i < nodesToSearch.length; i++) {
        if (nodesToSearch[i].id.indexOf(searchString) == 0) {
          result.push(nodesToSearch[i]);
        }
      }
    }

    return result;
  }

  function createTableOfContentsItem(node) {
    var result = document.createElement("li");

    if (node.hasAttribute("lkBulletPointPass")) {
      result.className += " pass";
    } else if (node.hasAttribute("lkBulletPointFail")) {
      result.className += " fail";
    }

    var tocItemText = tzDomHelper.coalesce(node.innerHTML, node.id);
    result.insertAdjacentHTML("afterbegin", "<a href=\"#" + node.id + "\">" + tocItemText + "</a>");

    return result;
  }

}(tzDomHelperModule, tzCustomTagHelperModule));

/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-ancestor-styles> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 ~
 */

/**
 * Renders a set of styles, for all ancestors of a given element.
 * The ancestor styles are displayed in a table. The <code>startElementId</code> attribute specifies
 * where the traversal begins. The <code>styleNames</code> tag specifies the list of styles to
 * be rendered in the table.
 *
 * <pre style="background:#eee; padding:6px;">
 *  &lt;!-- Render the position and display styles for all ancestors of the "innermost" element. --&gt;
 *  &lt;lk-ancestor-styles title="Genealogy of innermost" startElementId="innermost"&gt;
 *    &lt;comment&gt;A comment rendered beneath the Ancestors header&lt;/comment&gt;
 *    &lt;styleNames&gt;position, display&lt;/styleNames&gt;
 *  &lt;/lk-ancestor-styles&gt;
 * </pre>
 *
 * @module lkAncestorStylesTag
 */
var lkAncestorStylesTag = (function(tzDomHelper, tzCustomTagHelper, lkDisplayStyles) {
  "use strict";

  var commentExpression = new RegExp("<comment>((.|\n)*)<\/comment>", "ig");
  var styleNamesExpression = new RegExp("<styleNames>(.+?)<\/styleNames>", "ig");

  return {
    /**
     * Return the name of this tag.
     *
     * @returns {string}
     */
    getTagName: function() {
      return "lk-ancestor-styles";
    },

    /**
     * Render all &lt;lk-ancestor-styles&gt; tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the &lt;lk-ancestor-styles&gt; tag identified by the given <code>tagId</code>.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given <code>AncestorStylesTagNode</code>.
     *
     * @param ancestorStylesTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(ancestorStylesTagNode) {
      // get the title, width and startElementId from the tag
      var title = ancestorStylesTagNode.getAttribute("title");
      var width = ancestorStylesTagNode.getAttribute("width");
      var startElementId = ancestorStylesTagNode.getAttribute("startElementId");

      // get the child tags
      var comment = tzCustomTagHelper.getFirstMatchedGroup(ancestorStylesTagNode, commentExpression);
      var styleNames = ancestorStylesTagNode.innerHTML.match(styleNamesExpression)[0].replace(styleNamesExpression, "$1");

      // traverse the ancestry
      var elementArray = new Array();
      var element = document.getElementById( startElementId );
      while (element.parentNode != null) {
        elementArray.push(element);
        element = element.parentNode;
      }

      // create the matrix object
      var matrix = {
        "elements": elementArray,
        "styleNames": tzDomHelper.splitWithTrim(styleNames),
        "columnOptions": "[id][name]"
      };

      // create the context object
      var context = {
        "title": title,
        "comment": comment,
        "width": width,
        "useCompactUnorderedList": null,
        "unorderedListItems": null,
        "matrix": matrix
      };

      // remove child nodes (e.g., <code>rawRightColumnHtml</code> retrieved for use by the right column)
      tzDomHelper.removeAllChildNodes(ancestorStylesTagNode);

      // render the result
      this.render(ancestorStylesTagNode, context);
    },

    /**
     * Render into the given <code>containerNode</code>, the style property names and values, for the elements in the given <code>unorderedListItems</code>.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            <ul>
     *              <li>title: optional heading for the style list.
     *              <li>unorderedListItems: list of element-id/css-property-name pairs used to render the result. The element-id is used to lookup an
     *                  element and the css-property-name is used to read and display its property value.
     *              <li>useCompactUnorderedList: if true, then all property names are the same, so displays a list of property/value pairs without the property name;
     *                  otherwise, displays the same list, but includes the property name for each item in the list.
     *            </ul>
     */
    render: function(containerNode, context) {
      // render the result using the lkDisplayStyles tag
      lkDisplayStyles.render(containerNode, context);
    }
  }

}(tzDomHelperModule, tzCustomTagHelperModule, lkDisplayStylesTag));

/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-display-styles> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 ~
 */

/**
 * The <code>&lt;lk-display-styles&gt;</code> tag renders one or more styles from one or more elements.
 * It has several forms, each of which are described below:
 *<ol>
 *  <li>Compact unordered list: The style name is the same for each item in the list. The list items are defined in the tag body.
 * <pre style="background:#eee; padding:6px;">
 *   &lt;lk-display-styles styleName="position"&gt;
 *     outermost, middleGrid, innerBox
 *   &lt;/lk-display-styles&gt;
 * </pre>
 *
 *  <li>Verbose unordered list: The style name is unique for each item in the list. The list items are defined in the tag body
 * <pre style="background:#eee; padding:6px;">
 *   &lt;lk-display-styles&gt;
 *     { "outerMost": "position", "middleGrid": "margin", "innerMost": "padding" }
 *   &lt;/lk-display-styles&gt;
 * </pre>
 *
 *  <li>Matrix: The styles are displayed in a table. The rows and columns are defined in the tag body.
 * <pre style="background:#eee; padding:6px;">
 *   &lt;lk-display-styles&gt;
 *     &lt;styleNames&gt;padding, margin&lt;/styleNames&gt;
 *     &lt;legendImages&gt;./img/outermost.png, ./img/middleGrid.png, ./img/innerBox.png&lt;/legendImages&gt;
 *     &lt;elementIds&gt;outermost, middleGrid, innerBox&lt;/elementIds&gt;
 *   &lt;/lk-display-styles&gt;
 * </pre>
 *</ol>
 *
 * @module lkDisplayStylesTag
 */
var lkDisplayStylesTag = (function(tzDomHelper, tzCustomTagHelper) {
  "use strict";

  var commentExpression = new RegExp("<comment>((.|\n)*)</comment>", "ig");
  var legendImagesExpression = new RegExp("<legendImages>(.+?)</legendImages>", "ig");
  var elementIdsExpression = new RegExp("<elementIds>(.+?)</elementIds>", "ig");
  var styleNamesExpression = new RegExp("<styleNames>(.+?)</styleNames>", "ig");

  // --------------------------------------------------------------
  // variantMgr
  // --------------------------------------------------------------

  /**
   * Manage the display variants (e.g., compact list display, matrix display, etc).
   *
   * @type {{handleCompactListVariant: handleCompactListVariant, handleVerboseListVariant: handleVerboseListVariant, handleMatrixVariant: handleMatrixVariant}}
   */
  var variantMgr = {
    handleCompactListVariant: function(displayStylesTagNode, context, styleName) {
      // variant: compact unordered list, where the styleName is the same for each item
      context["useCompactUnorderedList"] = "true"; // all property names are the same

      if (tzDomHelper.isEmpty(context["title"])) {
        context["title"] = "Rendered '" + styleName + "' styles:";
      }
      var itemIds = displayStylesTagNode.innerHTML.replace(/\s+/g, '');

      context["unorderedListItems"] = listItemsToMap(itemIds, styleName); // e.g., {"id1": "margin", "id2": "margin"}
    },

    handleVerboseListVariant: function(displayStylesTagNode, context) {
      // variant: verbose unordered list, where the styleName is contained in tag content: {"elementID": "styleName"}, ...
      if (tzDomHelper.isEmpty(context["title"])) {
        context["title"] = "Rendered styles:";
      }

      context["useCompactUnorderedList"] = "false";
      var itemsAsString = displayStylesTagNode.innerHTML.trim();
      context["unorderedListItems"] = JSON.parse(itemsAsString);
    },

    handleMatrixVariant: function(displayStylesTagNode, context) {
      if (tzDomHelper.isEmpty(context["title"])) {
        context["title"] = "Rendered styles:";
      }

      var legendImages = "";
      if (displayStylesTagNode.innerHTML.match(legendImagesExpression)) {
        legendImages = displayStylesTagNode.innerHTML.match(legendImagesExpression)[0].replace(legendImagesExpression, "$1");
      }
      var elementIds = displayStylesTagNode.innerHTML.match(elementIdsExpression)[0].replace(elementIdsExpression, "$1");
      var styleNames = displayStylesTagNode.innerHTML.match(styleNamesExpression)[0].replace(styleNamesExpression, "$1");

      try {
        var elements = elementIdsToElements(tzDomHelper.splitWithTrim(elementIds));

        var matrix = {};
        matrix["legendImages"] = tzDomHelper.splitWithTrim(legendImages);
        matrix["elements"] = elements;
        matrix["styleNames"] = tzDomHelper.splitWithTrim(styleNames);
        matrix["columnOptions"] = "[id]";

        context["matrix"] = matrix;
      } catch (e) {
        console.log(e);
      }
    }
  };

  // =================================================================
  // lkDisplayStylesTag
  // =================================================================

  return {
    /**
     * Return the name of this tag.
     *
     * @returns {string}
     */
    getTagName: function() {
      return "lk-display-styles";
    },

    /**
     * Render all <code>&lt;lk-display-styles&gt;</code> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <code>&lt;lk-display-styles&gt;</code> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given <code>displayStylesTagNode</code>.
     *
     * @param title optional heading for the style list.
     * @param displayStylesTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(displayStylesTagNode) {
      var context = {
        "title": null,
        "comment": null,
        "width": null,
        "useCompactUnorderedList": null,  // all property names are the same
        "unorderedListItems": null,
        "matrix": null
      };

      // get optional title
      context["title"] = displayStylesTagNode.getAttribute("title");

      // get optional comment block
      if (displayStylesTagNode.innerHTML.match(commentExpression)) {
        context["comment"] = displayStylesTagNode.innerHTML.match(commentExpression)[0].replace(commentExpression, "$1");
      }

      // get optional width and style name
      context["width"] = displayStylesTagNode.getAttribute("width");
      var styleName = displayStylesTagNode.getAttribute("styleName");

      // handle tag variants (constant styleName for all items or unique styleName per item, etc)
      if (tzDomHelper.isNotEmpty(displayStylesTagNode.innerHTML)) {
        if (tzDomHelper.isEmpty(styleName)) {
          // styleName was not given, so it must be table or verbose list
          if (elementIdsExpression.test(displayStylesTagNode.innerHTML)) {
            variantMgr.handleMatrixVariant(displayStylesTagNode, context);
          } else {
            variantMgr.handleVerboseListVariant(displayStylesTagNode, context);
          }
        } else {
          // all styles use the same styleName (making a compact list)
          variantMgr.handleCompactListVariant(displayStylesTagNode, context, styleName);
        }
      }

      // remove child nodes (e.g., child tag of item IDs)
      tzDomHelper.removeAllChildNodes(displayStylesTagNode);

      // render the result
      this.render(displayStylesTagNode, context);
    },

    /**
     * Render into the given <code>containerNode</code>, the style property names and values, for the elements in the given <code>unorderedListItems</code>.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *          <ul>
     *            <li>title: optional heading for the style list.
     *            <li>unorderedListItems: list of element-id/css-property-name pairs used to render the result. The element-id is used to lookup an
     *              element and the css-property-name is used to read and display its property value.
     *            <li>useCompactUnorderedList: if true, then all property names are the same, so displays a list of property/value pairs without the property name;
     *              otherwise, displays the same list, but includes the property name for each item in the list.
     *          </ul>
     */
    render: function(containerNode, context) {
       // handle optional title
      if (tzDomHelper.isNotEmpty(context.title)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "h4", null, context.title);
      }

      // handle optional comment
      if (tzDomHelper.isNotEmpty(context.comment)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"className":"lk-code-example-comment"}', context.comment);
      }

      // render as matrix, unordered list, or error.
      if (tzDomHelper.isNotEmpty(context.matrix)) {
        renderAsMatrix(containerNode, context);
      } else if (tzDomHelper.isNotEmpty(context.unorderedListItems)) {
        renderAsUnorderedList(containerNode, context);
      } else {
        // property list was not provided, so display an error.
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "div", '{"style.color":"red"}', "ERROR: Table or Unordered list items were not specified or items not found.");
      }
    }
  };

  // --------------------------------------------------------------
  // private functions
  // --------------------------------------------------------------

  function renderAsMatrix(containerNode, context) {
    var matrix = context.matrix;
    var table, tr, th, td;

    // create a wrapper div, so that the child table can scroll on small screens. Do appendChild on containerNode, after entire element is built
    var wrapper = tzDomHelper.createElement(null, "div", '{"className":"lk-display-styles-matrix"}');

    // create table and optionally set the width
    table = tzDomHelper.createElement(wrapper, "table");
    if (tzDomHelper.isNotEmpty(context.width)) {
      table.style.width = context.width;
    }

    // render the header ("legend", "name", "id", then styleNames)
    tr = tzDomHelper.createElement(table, "tr");

    //   - optionally, display legend
    if (tzDomHelper.isNotEmpty(matrix.legendImages)) {
      tzDomHelper.createElementWithAdjacentHtml(tr, "th", null, "legend");
    }

    //   - optionally, display element name
    if (matrix.columnOptions.indexOf("[name]") >= 0) {
      tzDomHelper.createElementWithAdjacentHtml(tr, "th", null, "name");
    }

    //   - optionally, display element id
    if (matrix.columnOptions.indexOf("[id]") >= 0) {
      tzDomHelper.createElementWithAdjacentHtml(tr, "th", null, "id");
    }

    //   - display all style names
    for (var styleIndex in matrix.styleNames) {
      tzDomHelper.createElementWithAdjacentHtml(tr, "th", null, matrix.styleNames[styleIndex]);
    }

    // render the table body (one row for each requested element)
    for (var eleIndex in matrix.elements) {
      tr = tzDomHelper.createElement(table, "tr");

      // first column is the legend
      if (tzDomHelper.isNotEmpty(matrix.legendImages)) {
        td = tzDomHelper.createElement(tr, "td", '{"className": "center"}');
        if (matrix.legendImages.length > eleIndex) {
          tzDomHelper.createElement(td, "img", '{"src": "'+matrix.legendImages[eleIndex]+'"}');
        } else {
          tzDomHelper.createElementWithAdjacentHtml(td, "div", null, "???");
        }
      }

      // optionally, display element name
      if (matrix.columnOptions.indexOf("[name]") >= 0) {
        tzDomHelper.createElementWithAdjacentHtml(tr, "td", null, matrix.elements[eleIndex].nodeName);
      }

      // optionally, display element id
      if (matrix.columnOptions.indexOf("[id]") >= 0) {
        tzDomHelper.createElementWithAdjacentHtml(tr, "td", null, matrix.elements[eleIndex].id);
      }

      // remaining columns are the element's styles
      for (var styleIndex in matrix.styleNames) {
        var styleValue = tzDomHelper.getStyleValue(matrix.elements[eleIndex], matrix.styleNames[styleIndex]);
        tzDomHelper.createElementWithAdjacentHtml(tr, "td", null, styleValue);
      }
    }

    containerNode.appendChild(wrapper);
  }

  function renderAsUnorderedList(containerNode, context) {
    var ul = tzDomHelper.createElement(null, "ul");
    for (var elementId in context.unorderedListItems) {
      var generatedHtml;
      var styleName = context.unorderedListItems[elementId];

      if (context.useCompactUnorderedList == 'true') {
        generatedHtml = "Element '" + elementId + "' is: " + tzDomHelper.getStyleValueById(elementId, styleName);
      } else {
        generatedHtml = "Element '" + elementId + "' has " + styleName + ": " + tzDomHelper.getStyleValueById(elementId, styleName);
      }
      tzDomHelper.createElementWithAdjacentHtml(ul, "li", null, generatedHtml);
    }

    containerNode.appendChild(ul);
  }

  /**
   * Return a map using the given itemIds as the key and the given styleName for every value
   * (e.g., {"id1": "margin", "id2": "margin"} ).
   *
   * @param itemIds element IDs
   * @param styleName
   * @returns {{}}
   */
  function listItemsToMap(itemIds, styleName) {
    var result = {};
    var itemIdList = tzDomHelper.splitWithTrim(itemIds);

    for (var i = 0; i < itemIdList.length; i++) {
      result[itemIdList[i]] = styleName;
    }

    return result;
  }

  /**
   * Return the set of elements, found in the document, matching the given set of elementIds.
   *
   * @param elementIds IDs of elements to retrieve from the document
   * @returns {Array}
   */
  function elementIdsToElements(elementIds) {
    var result = new Array();

    for (var elementId in elementIds) {
      var element = document.getElementById( elementIds[elementId] );

      if (element == null) {
        throw "Element not found. The bad elementId is: " + elementIds[elementId];
      }

      result.push(element);
    }

    return result;
  }

}(tzDomHelperModule, tzCustomTagHelperModule));

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
 * <p>
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
 *   <tr><td class="name"><code>logger-height</code></td><td>The constrained height for the logger output</td></tr>
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
        "renderCode": lkJsExampleTagNode.getAttribute("renderCode") || true,
        "jsComment": tzCustomTagHelper.getFirstMatchedGroup(lkJsExampleTagNode, jsCommentExpression),
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
     *            <li>jsComment: optional comment to render above the JavaScript code example.
     *            <li>width: optional width (hack) to force the zebra stripes to fill the entire code example area when scrolling is required.
     *
     *            <li>evalCode: if true (default), then execute the JavaScript (via eval); otherwise, the code is not executed.
     *                You may want to set this to false, if you want the code to be displayed, but don't want it to be executed.
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
          "codeBlockComment": context.jsComment,
          "lang": "js",
          "width": context.width,
          "rawCode": context.rawJs});
      }

      // execute the JavaScript code (optional)
      if (context.evalCode == true) {
        // render result heading
        var header = tzDomHelper.createElementWithAdjacentHtml(containerNode, "h4", null, tzDomHelper.coalesce(context.resultHeaderTitle, "Rendered Result"));

        // render optional result comment, if present
        if (tzDomHelper.isNotEmpty(context.resultComment)) {
          tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"className":"lk-live-code-block-comment"}', context.resultComment);
        }

        // create default ID, if id is missing
        if (tzDomHelper.isEmpty(context.id)) {
          context.id = "DefaultID" + ++defaultIdCounter;
        }

        // create the logger, for use by the code about to be executed (the code can lookup this logger by the id of its <lk-js-example> tag instance).
        var logger = createLogger(containerNode, context, header);

        try {
          eval(context.rawJs);
        } catch (e) {
          logger.log("<span style='color:red;'>LabKit caught an Exception:<br> " + e.toString() + "</span>");
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
    if (tzDomHelper.isNotEmpty(context.loggerHeight)) {
      outputNode.style.maxHeight = context.loggerHeight;
    }

    // create the logger, for use by the code about to be executed (eval code will lookup logger by the id of this <lk-js-example> tag instance).
    var logger = lkResultLogger.createLogger(context.id, header, outputNode);

    // hide the logger (plus header), until (or unless) the experiment attempts to log a result.
    logger.hide();

    return logger;
  }

}(tzDomHelperModule, tzCustomTagHelperModule, tzCodeHighlighterModule, lkResultLoggerModule));

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
 * Renders the raw CSS code, with syntax highlighting and line numbers,
 * and then injects it into the DOM, so the injected CSS can be available for live styling).
 * <p>
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
        "height": lkCssExampleTagNode.getAttribute("height"),

        "injectCode": lkCssExampleTagNode.getAttribute("injectCode") || true
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
     *            <li>cssComment: optional comment to render above the CSS example code block.
     *            <li>rawCss: the CSS code to insert.
     *            <li>resultComment: optional comment to render above the live result.
     *            <li>width: optional width (hack) to force the zebra stripes to fill the entire code area when scrolling is required.
     *            <li>height: optional height.
     *
     *            <li>injectCode: if true (default), then inject the raw CSS into the DOM; otherwise, the code is not injected.
     *                You may want to set this to false, if you want the code to be displayed, but don't want it to be injected.
     *          </ul>
     */
    render: function(containerNode, context) {
      // render the CSS code with syntax highlighting
      tzCodeHighlighter.render(containerNode, {
        "heading": "CSS",
        "codeBlockComment": context.cssComment,
        "lang": "css",
        "width": context.width,
        "height": context.height,
        "rawCode": context.rawCss});

      // inject the live CSS code, if requested
      if (context.injectCode) {
        // render the live CSS
        if (tzDomHelper.isEmpty(context.rawCss)) {
          tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"style.color":"red"}', "Raw CSS is missing");
        } else {
          tzDomHelper.createElementWithAdjacentHtml(containerNode, "style", null, context.rawCss);
        }
      }

    }

  }

}(tzDomHelperModule, tzCustomTagHelperModule, tzCodeHighlighterModule));

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
 * Renders the raw HTML code, with syntax highlighting and line numbers,
 * and then injects it into the DOM, so the injected HTML elements can be rendered live.
 * <p>
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
        "height": lkHtmlExampleTagNode.getAttribute("height"),

        "injectCode": lkHtmlExampleTagNode.getAttribute("injectCode") || true
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
     *
     *            <li>injectCode: if true (default), then inject the raw HTML into the DOM; otherwise, the code is not injected.
     *                You may want to set this to false, if you want the code to be displayed, but don't want it to be injected.
     *          </ul>
     */
    render: function(containerNode, context) {
      // render the HTML code with syntax highlighting
      tzCodeHighlighter.render(containerNode, {
        "heading": "HTML",
        "codeBlockComment": context.htmlComment,
        "lang": "*ml",
        "width": context.width,
        "rawCode": context.rawHtml});

      // inject the live HTML code, if requested
      if (context.injectCode) {
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
  }

}(tzDomHelperModule, tzCustomTagHelperModule, tzCodeHighlighterModule));
