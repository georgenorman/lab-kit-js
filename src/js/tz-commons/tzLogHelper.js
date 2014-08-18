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
