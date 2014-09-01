/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ General utility functions - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * A module that provides general purpose helper functions.
 *
 * @module tzGeneralUtilsModule
 */
var tzGeneralUtilsModule = (function( tzLogHelper ) {
  "use strict";

  return {

    /**
     * Simple XML escape function that replaces all ampersand, less-than and greater-than characters with
     * their escaped equivalents.
     *
     * @param rawString to be escaped
     * @returns {string} escaped string.
     */
    xmlEscape: function( rawString ) {
      var result = rawString.replace( /&/g, "&amp;" ).replace( /</g, "&lt;" ).replace( />/g, "&gt;" );

      return result;
    },

    /**
     * Splits the given white-space separated string, removing all white-space from the remaining segments.
     *
     * @param srcString white-space separated string to be split.
     * @returns {array} array of trimmed string segments.
     */
    splitWithTrim: function(srcString) {
      var result = this.isEmpty(srcString) ? srcString : srcString.split(/[\s,]+/);

      return result;
    },

    /**
     * For each item in the given stringItemsArray, trim the string, then surround it with quotes and lastly,
     * append it to the result string (separated by commas).
     *
     * @param stringItemsArray
     * @returns {string} a comma separated string, with each item in the stringItemsArray surrounded by quotes.
     */
    quoteList: function( stringItemsArray ) {
      var result = "";

      if (stringItemsArray != null) {
        var separator = "";

        for (var i=0; i<stringItemsArray.length; i++) {
          result += separator + "\"" + stringItemsArray[i].trim() + "\"";
          separator = ",";
        }
      }

      return result;
    },

    /**
     * Returns the given <code>value</code> if not empty, otherwise returns the given <code>defaultValue</code>.
     */
    coalesceOnEmpty: function( value, defaultValue ) {
      var result = this.isEmpty( value ) ? defaultValue : value;

      tzLogHelper.debug( value );

      return result;
    },

    /**
     * Returns the given <code>value</code> if not null or undefined, otherwise returns the given <code>defaultValue</code>.
     */
    coalesceOnNull: function(value, defaultValue) {
      var result = value === undefined || value === null ? defaultValue : value;

      tzLogHelper.debug( value );

      return result;
    },

    /**
     * Returns true if the given value is undefined, null, an empty String or an Object with a
     * length property that's zero (e.g., a zero-length array).
     *
     * @param value to be tested
     * @returns {boolean|*}
     */
    isEmpty: function( value ) {
      var result = (value === undefined || value === null || value === "" || (value.hasOwnProperty("length") && value.length == 0));

      return result;
    },

    /**
     * Inverse of isEmpty.
     *
     * @param value to be tested
     * @returns {boolean|*}
     */
    isNotEmpty: function( value ) {
      return !this.isEmpty( value );
    },

    /**
     * Return a String, of the form "propertyName=propertyValue\n", for every property of the given obj, or until
     * maxNumProperties has been reached.
     *
     * @param obj object to retrieve the properties from.
     * @param boldLabels optional flag that causes each propertyName to be surrounded by HTML bold tags
     * @param maxNumProperties optional limiter for the number of properties to retrieve.
     * @returns {string} new-line separated set of property/value pairs
     */
    getProperties: function(obj, boldLabels, maxNumProperties) {
      var result = "";

      maxNumProperties = maxNumProperties === undefined ? Number.MAX_VALUE : maxNumProperties;

      if (obj !== undefined && obj !== null) {
        var separator = "";
        var labelPrefix = "";
        var labelSuffix = "";

        if (this.isNotEmpty(boldLabels)) {
          labelPrefix = "  <b>"; // plus indent
          labelSuffix = "</b>";
        }

        var propCount = 0;
        for (var propertyName in obj) {
          var objValue;

          if ((obj[propertyName]) === undefined) {
            objValue = "<style='color:red'>undefined</style>";
          } else {
            objValue = obj[propertyName];
          }

          result += separator + labelPrefix + propertyName + labelSuffix + "=" + objValue;
          separator = ",\n";
          propCount++;

          if (propCount >= maxNumProperties) {
            break;
          }
        }
      }

      return result;
    },

    /**
     * Copy all properties that are directly owned by the given source object (i.e., hasOwnProperty) to the given target object.
     *
     * @param source object to copy methods and properties from.
     * @param target object to copy methods and properties to.
     */
    copyProperties: function(source, target) {
      for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
          target[prop] = source[prop];
        }
      }
    },

    /**
     * Returns true if the given value is a number.
     * See: http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
     *
     * @param value
     * @returns {boolean|*}
     */
    isNumber: function(value) {
      return !isNaN(parseFloat(value)) && isFinite(value);
    }
  };

}( tzLogHelperModule ));
