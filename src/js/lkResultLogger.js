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

  var loggers = {};

  /**
   * A logger that logs messages to a given DOM node.
   *
   * @param outputNode
   * @returns {{log: log}}
   * @constructor
   */
  function NodeLogger(header, outputNode) {
    return {
      /**
       * Log the given message to the given output node.
       *
       * @param msg
       */
      log: function( msg ) {
        if (msg === undefined) {
          msg = "<span style='color:red;'>*Logger message is undefined*</span>";
        }
        console.log(msg);

        this.show();
        outputNode.innerHTML = outputNode.innerHTML + msg + "\n";
      },

      show: function() {
        header.style.display = "block";
        outputNode.style.display = "block";
      },

      hide: function() {
        header.style.display = "none";
        outputNode.style.display = "none";
      }
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

    getLogger: function(name) {
      var result = loggers[name];

      if (tzDomHelper.isEmpty(result)) {
        throw "*The logger named '"+name+"' does not exist. You must create it first.*";
      }

      return result;
    }
  };

}(tzDomHelperModule));
