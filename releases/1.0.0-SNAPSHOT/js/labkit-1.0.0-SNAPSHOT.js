
/*!
  ~ labKit-1.0.0-SNAPSHOT.js
  ~ Copyright (c) 2014 George Norman.
  ~ Licensed under the Apache License, Version 2.0 (the License);
  ~     http://www.apache.org/licenses/LICENSE-2.0
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

/*
 * Formats strings, for use in a console log.
 * A cheap way to log a message, yet preserve the source link back to the origin in the source code.
 *
 * Example:
 *
 *   console.log(logHelper.warning("Didn't find an element with ID: " + elementId));
 *
 */
var tzLogHelperModule = (function() {
  "use strict";

  var loggingEnabled = false;

  return {
    enableLogging: function() {
      loggingEnabled = true;
    },

    disableLogging: function() {
      loggingEnabled = false;
    },

    debug: function(message) {
      if (loggingEnabled) {
        console.log( new Date().toJSON() + " DEBUG: " + message );
      }
    },

    warning: function(message) {
      if (loggingEnabled) {
        console.log( new Date().toJSON() + " WARN: " + message );
      }
    },

    error: function(message) {
      if (loggingEnabled) {
        var tracer = new Error();

        console.log( new Date().toJSON() + " ERROR: " + message + " - " + tracer.stack );
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

var tzDomHelperModule = (function( tzLogHelper ) {
  "use strict";

  return {
    /*
     * Return the inner HTML from an element with the given elementId.
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
        result = result.trim();
      }

      return result;
    },

    /*
     * Return the inner HTML from an element with the given elementId.
     * Useful for returning multi-line strings from template blocks.
     *
     * @param elementId - ID of the element with the desired HTML.
     */
    getInnerHtmlWithDefault: function( elementId ) {
      var result = this.getInnerHtml( elementId );

      return this.isEmpty( result ) ? '<span style="color:red;">No element found for ID: ' + elementId : result;
    },

    /*
     * Return the inner HTML as an array of lines, from an element with the given elementId.
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

    /*
     * Return the value of the style property, for the element with the given elementId.
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

    /*
     * Return the value of the style property, for the given element.
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

    /*
     * Inserts a tag, with the given tagName, and inserts the given innerHtml inside the element.
     *
     * @param tagName - name of tag (e.g., h4 => <h4>).
     * @param innerHtml - HTML to write inside of element.
     */
    insertElement: function( tagName, innerHtml ) {
      insertLine( "<" + tagName + ">" + innerHtml + "</" + tagName + ">" );
    },

    /*
     * Inserts a tag, with the given tagName and tagAttributes, and inserts the given innerHtml inside the element.
     *
     * @param tagName - name of tag (e.g., h4 => <h4>).
     * @param tagAttributes - attributes of tag element (e.g., class="foo" => <someTag class="foo">).
     * @param innerHtml - HTML to write inside of element.
     */
    insertElementWithTagAttributes: function( tagName, tagAttributes, innerHtml ) {
      tagAttributes = (tagAttributes.length > 0) ? " " + tagAttributes : tagAttributes;
      insertLine( "<" + tagName + tagAttributes + ">" + innerHtml + "</" + tagName + ">" );
    },

    /**
     * Return a new element of type elementName, with optional parent and attributes.
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

    /*
     * Returns the given value if not null, otherwise returns the given defaultValue.
     *
     * @param value - value to return if not null.
     * @param defaultValue - defaultValue to return if value is null.
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

    // @-@:p0 move to general utils
    isNotEmpty: function( value ) {
      return !this.isEmpty( value );
    },

    show: function( elementId ) {
      var element = document.getElementById( elementId );

      element.style.display = "block";
    },

    hide: function( elementId ) {
      var element = document.getElementById( elementId );

      element.style.display = "none";
    }
  };

  // ------------------------------------------------------------------
  // Private functions
  // ------------------------------------------------------------------

  /*
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
}());
/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Simple custom tag helper functions - sharable among all projects.
 ~ --------------------------------------------------------------
 */

var tzCustomTagHelperModule = (function( tzDomHelper ) {
  "use strict";

  var templateVariableExpression = new RegExp( "{{(.*?)}}", "g" );

  return {
    /**
     * Return a generated template ID, by concatenating "-tag-template" to the tagModule's tag name.
     * Example: tagModule.getTagName() + "-tag-template" => "lk-bullet-point-tag-template".
     *
     * @param tagModule the module that's responsible for rendering a particular custom tag.
     */
    getTemplateId: function( tagModule ) {
      return tagModule.getTagName() + "-tag-template";
    },

    /**
     * Render all custom tags, represented by the given tagModule, that appear on the current page.
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
     * Render the first custom tag found in the DOM, represented by the given tagModule.
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
     * Render the single custom tag identified by the given tagId.
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
     * Render the custom tag, into the given containerNode, using an HTML template
     * that may have variables needing transliteration using the given context.
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
     * Return the template text from the node identified by the given templateId.
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
     * Return the first group, from the given tagNode, matching the given innerTagExpression.
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
 ~ Renders <lk-bullet-point> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/*
 * The <lk-bullet-point> tag behaves like a single list item - it renders a status icon on the left followed by an HTML block on the right.
 *
 * The tag attributes are read from the lk-bullet-point element, as shown in the example below:
 *
 *    <lk-bullet-point iconClass="success" widthLeft="25px">This experiment successfully shows that...</lk-bullet-point>
 *
 * @attribute iconClass class name used to style the <i> element used as a placeholder for the icon.
 *      The following icons are predefined: "lk-bullet-point-pass", "lk-bullet-point-fail" (see css/lkBulletPoint.css).
 * @attribute leftColumnWidth optional width of the left column.
 * @attribute style optional style for the wrapper div.
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
    getTagName: function() {
      return "lk-bullet-point";
    },

    /**
     * Render all <lk-bullet-point> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <lk-bullet-point> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given lkBulletPointTagNode.
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
     * Render the <lk-bullet-point> tag into the given containerNode.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            - iconClass: css used to render an icon in the left column.
     *            - leftColumnWidth: width of the left column.
     *            - rawRightColumnHtml: the raw HTML to render into the right column.
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
 ~ Renders <lk-back-to> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/*
 * The <lk-back-to> tag renders back-to links: "Back to Index" and "Back to Table of Contents".
 *
 * The tag can be configured globally, via an init function, or individually via attributes read from the lk-back-to element:
 *
 * - Globally:
 *
 *    lkBackToTag.setGlobalLinks({"⬅ Back to Index":"./index.html", "⬆ Back to Table of Contents":"#tableOfContents"});
 *
 * - Locally:
 *
 *    <lk-back-to links='{"⬅ Back to Index":"./index.html", "⬆ Back to Table of Contents":"#tableOfContents"}'></lk-back-to>
 *
 * @attribute links - Series of links to render.
 */
var lkBackToTag = (function(tzDomHelper, tzCustomTagHelper) {
  "use strict";

  var globalLinks = null;

  return {
    getTagName: function() {
      return "lk-back-to";
    },

    /**
     * Render all <lk-back-to> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <lk-back-to> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given lkBackToTagNode.
     *
     * @param lkBackToTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(lkBackToTagNode) {
      // build the context
      var localLinksText = lkBackToTagNode.getAttribute("links");

      var context = {
        "links": tzDomHelper.isEmpty(localLinksText) ? null : JSON.parse(localLinksText)
      };

      // render the result
      this.render(lkBackToTagNode, context);
    },

    /**
     * Render the result into the given containerNode.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            - links: the links to render. If null, then uses globalLinks.
     */
    render: function(containerNode, context) {
      if (tzDomHelper.isEmpty(context.links)) {
        // use global links, if none provided by the tag's link attribute
        if (this.globalLinks == null) {
          tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"style.color":"red"}', "Global Links was not set for lkBackToTag.");
        } else {
          for (var key in this.globalLinks) {
            tzDomHelper.createElementWithAdjacentHtml(containerNode, "a", '{"href":"'+this.globalLinks[key]+'", "style.margin-right":"12px"}', key);
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
 * The &lt;lk-table-of-contents&gt; tag auto-generates a simple two-level Table of Contents.
 * A default title of "Table of Contents" will be used if the title is not provided.
 * The title is rendered as an h2 element.
 *
 * Limitations:
 *   1. There can be only one Table of Contents section per page.
 *   2. Maximum levels is two.
 *
 * The tag attributes are read from the lkTableOfContents element, as shown in the example below:
 *
 *    &lt;lk-table-of-contents class="toc" level1ItemsTagName="h2" level2ItemsTagName="h3"&gt;&lt;/lk-table-of-contents&gt;
 *
 * @attribute class - the CSS class to apply to the rendered Table of Contents
 * @attribute level1ItemsTagName - tag name used to identify the level-1 headers to be included in the Table of Contents
 *        (e.g., "h2" would cause all h2 elements on the page, to be used as items in the generated Table of Contents).
 * @attribute level2ItemsTagName - tag name used to identify the level-2 headers to be included under each level-1 header
 *        (e.g., "h3" would cause all h3 elements on the page, to be used as sub-items in the generated Table of Contents).
 * @attribute title - optional title (default is "Table of Contents").
 */
var lkTableOfContentsTag = (function(tzDomHelper, tzCustomTagHelper) {
  "use strict";

  return {
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
     * Render the 'Table of Contents' tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given lkHtmlTagNode.
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
     * Render the 'Table of Contents' into the given containerNode.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            - cssClassName: css class name to use for the Table of Contents.
     *            - level1ItemsTagName: tag name used to identify the level-1 headers to be included in the Table of Contents.
     *            - level2ItemsTagName: tag name used to identify the level-2 headers to be included under each level-1 header.
     *            - title: optional title (default is "Table of Contents").
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
 ~ Renders <lk-html-block> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/*
 * The <lk-html-block> tag renders an optional heading and comment, followed by the raw text from the element of the given templateId.
 *
 * The tag attributes are read from the lk-html-block element, as shown in the example below:
 *
 *    <lk-html-block templateId="basicBoxModelHtml" heading="Rendered Result">
 *      <comment>Optional Comment</comment>
 *    </lk-html-block>
 *
 * @attribute templateId - ID of the element containing the raw HTML code to render.
 * @attribute heading - heading text [optional]
 */
var lkHtmlBlockTag = (function(tzDomHelper, tzCustomTagHelper) {
  "use strict";

  var commentExpression = new RegExp("<comment>((.|\n)*)</comment>", "ig");

  return {
    getTagName: function() {
      return "lk-html-block";
    },

    /**
     * Render all <lk-html-block> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <lk-html-block> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given lkHtmlTagNode.
     *
     * @param lkHtmlTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(lkHtmlTagNode) {
      var templateId = lkHtmlTagNode.getAttribute("templateId");
      var heading = lkHtmlTagNode.getAttribute("heading");
      if (tzDomHelper.isEmpty(heading)) {
        heading = "Rendered Result";
      }

      // build the context
      var context = {
        "heading": heading,
        "resultComment": tzCustomTagHelper.getFirstMatchedGroup(lkHtmlTagNode, commentExpression),
        "rawHtml": tzDomHelper.getInnerHtml(templateId)
      };

      // remove all child nodes, previously added from render (or renderAll).
      tzDomHelper.removeAllChildNodes(lkHtmlTagNode);

      // render the result
      this.render(lkHtmlTagNode, context);
    },

    /**
     * Render the HTML code block into the given containerNode.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            - heading: optional heading to display for the live code block.
     *            - resultComment: optional comment to render above the live result.
     *            - rawHtml: the code that will be rendered into the given containerNode.
     */
    render: function(containerNode, context) {
      // render optional heading, if present
      if (tzDomHelper.isNotEmpty(context.heading)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "h4", null, context.heading);
      }

      // render optional result comment, if present
      if (tzDomHelper.isNotEmpty(context.resultComment)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"className":"lk-html-block-comment"}', context.resultComment);
      }

      // render raw HTML from the template
      var div = tzDomHelper.createElementWithAdjacentHtml(containerNode, "div", '{"className":"lk-html-block"}', context.rawHtml);
      if (tzDomHelper.isNotEmpty(context.height)) {
        div.style.height = context.height;
      }
    }
  }
}(tzDomHelperModule, tzCustomTagHelperModule));
/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-css-block> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/*
 * The <lk-css-block> tag renders a <style> block, with the text extracted from the element
 * with the specified templateId.
 *
 * The tag attributes are read from the lk-css-block element, as shown in the example below:
 *
 *    <lk-css-block templateId="basicBoxModelCss"></lk-css-block>
 *
 * @attribute templateId - ID of the element containing the CSS code to insert.
 */
var lkCssBlockTag = (function(tzDomHelper, tzCustomTagHelper) {
  "use strict";

  return {
    getTagName: function() {
      return "lk-css-block";
    },

    /**
     * Render all <lk-css-block> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <lk-css-block> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given lkStyleTagNode.
     *
     * @param lkStyleTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(lkStyleTagNode) {
      // build the context
      var context = {
        "rawCss": tzDomHelper.getInnerHtml(lkStyleTagNode.getAttribute("templateId"))
      };

      // render the result
      this.render(lkStyleTagNode, context);
    },

    /**
     * Render the <style> block into the given containerNode.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            - rawCss: the raw styles to render into the given containerNode.
     */
    render: function(containerNode, context) {
      if (tzDomHelper.isEmpty(context.rawCss)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"style.color":"red"}', "Raw CSS is missing");
      } else {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "style", null, context.rawCss);
      }
    }
  }

}(tzDomHelperModule, tzCustomTagHelperModule));
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
/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-css-html-example> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/*
 * The <lk-css-html-example> tag renders the CSS style, CSS style code-example, HTML code-example
 * and then the live HTML, for the result, using the code templates identified by the
 * cssTemplateId and htmlTemplateId attributes.
 *
 * The tag attributes are read from the lk-css-html-example element, as shown in the examples below:
 *
 *   <lk-css-html-example cssTemplateId="basicBoxModelCss" htmlTemplateId="basicBoxModelHtml"></lk-css-html-example>
 *   <lk-css-html-example htmlTemplateId="tmplExampleRelInStaticNoMarginHtml"></lk-css-html-example>
 *
 * @attribute cssTemplateId - ID of the element containing the CSS code to insert.
 * @attribute htmlTemplateId - ID of the element containing the HTML code to insert.
 * @attribute templateId - optional; use this instead of cssTemplateId and htmlTemplateId to simplify the code.
 *     "Css" and "Html" will be appended to the given templateId, to form the IDs to the CSS and HTML templates.
 *
 * Example:
 *
 * <script type="multiline-template" id="simpleTemplateCss">
 *   .foo {color: red;}
 * </script>
 *
 * <script type="multiline-template" id="simpleTemplateHtml">
 *   <span class="foo">This is red</span>
 * </script>
 *
 * <lk-css-html-example templateId="simpleTemplate" width="750px">
 *   <cssComment>A comment rendered beneath the CSS header.</cssComment>
 *   <htmlComment>A comment rendered beneath the HTML header.</htmlComment>
 *   <resultComment>A comment rendered beneath the Result header.</resultComment>
 * </lk-css-html-example>
 *
 */
var lkCssHtmlExampleTag = (function(tzDomHelper, tzCustomTagHelper, lkCssBlock, lkHtmlBlock, lkCodeExample) {
  "use strict";

  var cssCommentExpression = new RegExp("<cssComment>((.|\n)*)<\/cssComment>", "ig");
  var htmlCommentExpression = new RegExp("<htmlComment>((.|\n)*)<\/htmlComment>", "ig");
  var resultCommentExpression = new RegExp("<resultComment>((.|\n)*)<\/resultComment>", "ig");

  return {
    getTagName: function() {
      return "lk-css-html-example";
    },

    /**
     * Render all <lk-css-html-example> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <lk-css-html-example> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given lkHtmlCssExampleTagNode.
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
     * Render the code examples and live code block, into the given containerNode.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            - cssComment: optional comment to render above the CSS code block.
     *            - rawCss: the CSS code to insert.
     *            - htmlComment: optional comment to render above the HTML code block.
     *            - rawHtml: the HTML code to insert.
     *            - resultComment: optional comment to render above the live result.
     *            - width: optional width (hack) to force the zebra stripes to fill the entire code area when scrolling is required.
     *            - height: optional height.
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

/*
 * The <lk-display-styles> tag renders one or more styles from one or more elements.
 * It has several forms, each of which are described below:
 *
 * 1. Compact unordered list: The style name is the same for each item in the list. The list items are defined in the tag body.
 *
 *      <lk-display-styles styleName="position">outermost, middleGrid, innerBox</lk-display-styles>
 *
 * 2. Verbose unordered list: The style name is unique for each item in the list. The list items are defined in the tag body
 *
 *      <lk-display-styles>
 *        { "outerMost": "position", "middleGrid": "margin", "innerMost": "padding" }
 *      </lk-display-styles>
 *
 * 3. Matrix: The styles are displayed in a table. The rows and columns are defined in the tag body.
 *
 *      <lk-display-styles>
 *        <styleNames>padding, margin</styleNames>
 *        <legendImages>./img/outermost.png, ./img/middleGrid.png, ./img/innerBox.png</legendImages>
 *        <elementIds>outermost, middleGrid, innerBox</elementIds>
 *      </lk-display-styles>
 *
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
    getTagName: function() {
      return "lk-display-styles";
    },

    /**
     * Render all <lk-display-styles> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <lk-display-styles> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given displayStylesTagNode.
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
     * Render into the given containerNode, the style property names and values, for the elements in the given unorderedListItems.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            - title: optional heading for the style list.
     *            - unorderedListItems: list of element-id/css-property-name pairs used to render the result. The element-id is used to lookup an
     *              element and the css-property-name is used to read and display its property value.
     *            - useCompactUnorderedList: if true, then all property names are the same, so displays a list of property/value pairs without the property name;
     *              otherwise, displays the same list, but includes the property name for each item in the list.
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
 ~ Renders <lk-ancestor-styles> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 ~
 */

/*
 * The <lk-ancestor-styles> tag renders a set of styles for all ancestors of a given element.
 * The ancestor styles are displayed in a table. The startElementId attribute specifies
 * where to the start the traversal. The styleNames tag specifies the list of styles to
 * be rendered in the table
 *
 *  <lk-ancestor-styles title="Genealogy of innermost" startElementId="innermost">
 *    <comment>A comment rendered beneath the Ancestors header</comment>
 *    <styleNames>position, display</styleNames>
 *  </lk-ancestor-styles>
 */
var lkAncestorStylesTag = (function(tzDomHelper, tzCustomTagHelper, lkDisplayStyles) {
  "use strict";

  var commentExpression = new RegExp("<comment>((.|\n)*)<\/comment>", "ig");
  var styleNamesExpression = new RegExp("<styleNames>(.+?)<\/styleNames>", "ig");

  return {
    getTagName: function() {
      return "lk-ancestor-styles";
    },

    /**
     * Render all <lk-ancestor-styles> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <lk-ancestor-styles> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given AncestorStylesTagNode.
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

      // remove child nodes (e.g., rawRightColumnHtml retrieved for use by the right column)
      tzDomHelper.removeAllChildNodes(ancestorStylesTagNode);

      // render the result
      this.render(ancestorStylesTagNode, context);
    },

    /**
     * Render into the given containerNode, the style property names and values, for the elements in the given unorderedListItems.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            - title: optional heading for the style list.
     *            - unorderedListItems: list of element-id/css-property-name pairs used to render the result. The element-id is used to lookup an
     *              element and the css-property-name is used to read and display its property value.
     *            - useCompactUnorderedList: if true, then all property names are the same, so displays a list of property/value pairs without the property name;
     *              otherwise, displays the same list, but includes the property name for each item in the list.
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
  ~ Base Lab Kit module.
  ~ --------------------------------------------------------------
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
      lkCssBlockTag.renderAll();
      lkCodeExampleTag.renderAll();
      lkHtmlBlockTag.renderAll();
      lkCssHtmlExampleTag.renderAll();
      lkDisplayStylesTag.renderAll();
      lkAncestorStylesTag.renderAll();
      lkBulletPointTag.renderAll();
      lkBackToTag.renderAll();
    },

    /**
     * Hide the progress bar and show the main content.
     * @param pageLoadProgressClassName class name used to style the progress bar. If no
     *   class name is provided, then uses the first <progress> element.
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
