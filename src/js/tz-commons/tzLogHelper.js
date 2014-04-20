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
