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
var lkResultLoggerModule = (function(tzDomHelper) {
  "use strict";

  var loggedResultLines = [];

  return {
    /**
     * Add the given <code>msg</code> to a list of results.
     *
     * @param msg
     */
    log: function( msg ) {
      console.log(msg);
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
    }
  };

}(tzDomHelperModule));
