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
