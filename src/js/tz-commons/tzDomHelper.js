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
var tzDomHelperModule = (function( tzGeneralUtils, tzLogHelper ) {
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

      return tzGeneralUtils.isEmpty( result ) ? '<span style="color:red;">No element found for ID: ' + elementId : result;
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

      if (tzGeneralUtils.isNotEmpty(attributes)) {
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

    show: function( elementId ) {
      var element = document.getElementById( elementId );

      element.style.display = "block";
    },

    hide: function( elementId ) {
      var element = document.getElementById( elementId );

      element.style.display = "none";
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
}( tzGeneralUtilsModule, tzLogHelperModule ));
