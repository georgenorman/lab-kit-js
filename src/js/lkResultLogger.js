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
var lkResultLoggerModule = (function(tzGeneralUtils, tzDomHelper, tzLogHelper) {
  "use strict";

  var loggers = {};

  // -------------------------------------------------
  // NodeLogger
  // -------------------------------------------------

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
       * Log the given msg to the DOM node given at construction time, using the default output style (".lk-logger-value")
       *
       * @param msg message to log
       * @param cssClass optional CSS class name for message
       */
      msg: function(msg, cssClass) {
        doLog(formatOutput(msg, cssClass));
      },

      /**
       * Log a label.
       *
       * @param label
       * @param cssClass optional CSS class name
       */
      label: function(label, cssClass) {
        doLog(formatLabel(label, cssClass === undefined ? "plain" : cssClass));
      },

      /**
       * Log a level-1 heading.
       *
       * @param heading
       * @param cssClass optional CSS class name
       */
      heading1: function(heading, cssClass) {
        doLog(formatLabel(heading, cssClass === undefined ? "h1" : cssClass, true));
      },

      /**
       * Log a level-2 heading.
       *
       * @param heading
       * @param cssClass optional CSS class name
       */
      heading2: function(heading, cssClass) {
        doLog(formatLabel(heading, cssClass === undefined ? "h2" : cssClass, true));
      },

      /**
       * Log a level-3 heading.
       *
       * @param heading
       * @param cssClass optional CSS class name
       */
      heading3: function(heading, cssClass) {
        doLog(formatLabel(heading, cssClass === undefined ? "h3" : cssClass, true));
      },

      /**
       * Log a label and value, using the default styles (".lk-logger-label" and ".lk-logger-value") and an optional comment.
       *
       * @param label
       * @param value
       * @param comment optional comment to display to the right of the value, surrounded by parens.
       * @param labelCssClass optional CSS class name for label
       */
      labelValue: function(label, value, comment, labelCssClass) {
        var commentFmt = tzGeneralUtils.isEmpty(comment) ? "" : " <small>(" + comment + ")</small>";

        doLog(formatLabel(label, labelCssClass) + " " + formatOutput(value) + commentFmt)
      },

      /**
       * Log a label and value properties, using the default styles (".lk-logger-label" and ".lk-logger-value") and an optional comment.
       *
       * @param label
       * @param value
       * @param comment optional comment to display to the right of the value, surrounded by parens.
       * @param maxNumProperties optional number used to limit the number of properties to display.
       */
      labelValueProperties: function(label, value, comment, maxNumProperties) {
        var labelFmt = formatLabel(label);
        var valueFmt = value === undefined ? formatOutput("undefined", "red") : "\n" + formatOutput(tzGeneralUtils.getProperties(value, true, maxNumProperties));
        var commentFmt = tzGeneralUtils.isEmpty(comment) ? "" : " <small>(" + comment + ")</small>";

        doLog(labelFmt + valueFmt + commentFmt)
      },

      /**
       * Log an expression as a label and then evaluate the expression as the value
       * (to keep the label as expression and expression result in sync; avoiding typos).
       *
       * @param expression the text to use as the label and the text to be evaluated as the value.
       * @param comment optional comment to display to the right of the value, surrounded by parens.
       * @param labelCssClass optional CSS class name for label
       */
      expression: function(expression, comment, labelCssClass) {
        this.labelExpression(expression, expression, comment, labelCssClass);
      },

      labelExpression: function(label, expression, comment, labelCssClass) {
        var labelFmt = formatLabel(label, labelCssClass);
        var commentFmt = tzGeneralUtils.isEmpty(comment) ? "" : " <small>(" + comment + ")</small>";

        // Ternary Operator is broken (tested via FF and Chrome).
        //var valueFmt = (expression === undefined) ? formatOutput("undefined", "red") : + formatOutput(eval(expression));
        var valueFmt;
        if (expression === undefined) {
          valueFmt = formatOutput("undefined", "red");
        } else {
          valueFmt = formatOutput(eval(expression));
        }

        doLog(labelFmt + " " + valueFmt + commentFmt)
      },

      /**
       * Log an error message.
       *
       * @param errMsg
       */
      error: function(errMsg) {
        doLog("<span style='color:red;'>" + errMsg + "</span>");
      },

      newline: function() {
        doLog("");
      },

      divider: function(color) {
        var hrColor = tzGeneralUtils.isEmpty(color) ? "#888" : color;
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

    function formatLabel(label, labelCssClass, sansColon) {
      // label title
      var styleAttribute = "";
      if (label === undefined) {
        label = "undefined";
        styleAttribute = " style='color:red'";
      }

      // label style
      var cssAttribute = labelCssClass === undefined ? "" : " class='" + labelCssClass + "'";

      // colon
      var colon = sansColon === true ? "" : ":";

      // render
      return "<label" + styleAttribute + cssAttribute + ">" + label + colon + "</label>";
    }

    function formatOutput(msg, cssClass) {
      var styleAttribute = "";
      var cssAttribute = "";

      if (msg === undefined) {
        msg = "undefined";
        styleAttribute = " style='color:red'";
      } else if (tzGeneralUtils.isNotEmpty(cssClass)) {
        cssAttribute = " class='" + cssClass + "'";
      }

      return "<output" + styleAttribute + cssAttribute + ">" + msg + "</output>";
    }

    function doLog(msg, withNewline) {
      tzLogHelper.debug(msg);

      showResultPanel();
      hideSpinner();

      // log a new line by default (withNewline is empty) or if withNewline is true
      var eol = "";
      if (tzGeneralUtils.isEmpty(withNewline) || withNewline == true) {
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

  // -------------------------------------------------
  // CacheLogger
  // -------------------------------------------------

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

  // ==============================================================================
  // lkResultLoggerModule
  // ==============================================================================

  return {

    createLogger: function(name, header, outputNode) {
      var result = loggers[name];

      if (tzGeneralUtils.isEmpty(result)) {
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

      if (tzGeneralUtils.isEmpty(result)) {
        throw "*The logger named '"+name+"' does not exist. If you are using the &lt;lk-js-example&gt; tag, make sure its ID is '"+name+"'.*";
      }

      if (reset == true) {
        result.reset();
      }

      return result;
    }
  };

}(tzGeneralUtilsModule, tzDomHelperModule, tzLogHelperModule));
