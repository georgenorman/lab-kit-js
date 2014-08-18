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
