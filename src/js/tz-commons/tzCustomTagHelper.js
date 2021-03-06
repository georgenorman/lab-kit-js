/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Simple custom tag helper functions - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * A module that provides helper methods for custom tags.
 *
 * @module tzCustomTagHelperModule
 */
var tzCustomTagHelperModule = (function( tzGeneralUtils, tzDomHelper ) {
  "use strict";

  var templateVariableExpression = new RegExp( "{{(.*?)}}", "g" );

  return {
    /**
     * Return a generated template ID, by concatenating "-tag-template" to the tagModule's tag name.
     * <p>
     * Example: <code>tagModule.getTagName() + "-tag-template" =&gt; "lk-bullet-point-tag-template"</code>.
     *
     * @param tagModule the module that's responsible for rendering a particular custom tag.
     */
    getTemplateId: function( tagModule ) {
      return tagModule.getTagName() + "-tag-template";
    },

    /**
     * Render all custom tags, represented by the given <code>tagModule</code>, that appear on the current page.
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
     * Render the first custom tag found in the DOM, represented by the given <code>tagModule</code>.
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
     * Render the single custom tag identified by the given <code>tagId</code>.
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
     * Render the custom tag, into the given <code>containerNode</code>, using an HTML <code>template</code>
     * that may have variables needing transliteration using the given <code>context</code>.
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
     * Return the template text from the node identified by the given <code>templateId</code>.
     *
     * @param templateId ID of the node that contains the template text.
     */
    getTemplate: function( templateId ) {
      var result = tzDomHelper.getInnerHtml( templateId );

      if (tzGeneralUtils.isEmpty( result )) {
        result = '<span style="color:red;">Template was not found: ' + templateId + '</span>';
      }

      return result;
    },

    /**
     * Return the first group, from the given <code>tagNode</code>, matching the given <code>innerTagExpression</code>.
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
}( tzGeneralUtilsModule, tzDomHelperModule ));
