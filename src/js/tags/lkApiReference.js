/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-api-reference> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * Renders a simple panel for displaying a link to the API reference documentation, plus a summary of key interfaces.
 *<p>
 * The tag attributes are read from the <code>lk-api-reference</code> element, as shown in the example below:
 * <pre style="background:#eee; padding:6px;">
 *    &lt;lk-api-reference href="http://api.jquery.com/ready/"&gt;
 *      $( document ).ready( handler )<br>
 *      $( handler )
 *    &lt;/lk-api-reference&gt;
 * </pre>
 *
 * <p style="padding-left:12px;">
 * <h6>Tag Attributes:</h6>
 * <table class="params">
 *   <thead><tr><th>Name</th><th class="last">Description</th></tr></thead>
 *   <tr><td class="name"><code>href</code></td><td>URL to the API reference documentation.</td></tr>
 *   <tr><td class="name"><code>width</code></td><td>optional width for the wrapper div.</td></tr>
 * </table>
 *
 * @module lkApiReferenceTag
 */
var lkApiReferenceTag = (function(tzDomHelper, tzCustomTagHelper) {
  "use strict";

  var template =
      ['<div class="group">',
       '  <div><a href="{{context.href}}">api</a></div>',
       '  <div>{{context.rawRightColumnHtml}}</div>',
       '</div>'
      ].join('\n');

  return {
    /**
     * Return the name of this tag.
     *
     * @returns {string}
     */
    getTagName: function() {
      return "lk-api-reference";
    },

    /**
     * Render all <code>&lt;lk-api-reference&gt;</code> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <code>&lt;lk-api-reference&gt;</code> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given <code>lkApiReferenceTagNode</code>.
     *
     * @param lkApiReferenceTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(lkApiReferenceTagNode) {
      // build the context
      var width = lkApiReferenceTagNode.getAttribute("width");
      var context = {
        "href": lkApiReferenceTagNode.getAttribute("href"),
        "width": lkApiReferenceTagNode.getAttribute("width"),
        "rawRightColumnHtml": lkApiReferenceTagNode.innerHTML.trim()
      };

      // remove child nodes (e.g., rawRightColumnHtml retrieved for use by the right column)
      tzDomHelper.removeAllChildNodes(lkApiReferenceTagNode);

      // render the result
      this.render(lkApiReferenceTagNode, context);
    },

    /**
     * Render the <code>&lt;lk-api-reference&gt;</code> tag into the given <code>containerNode</code>.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *           <ul>
     *             <li>href: URL to the API reference documentation.
     *             <li>width: optional width for the wrapper div.
     *             <li>rawRightColumnHtml: the raw HTML to render into the right column (e.g., APIs to be referenced).
     *           </ul>
     */
    render: function(containerNode, context) {
      //var template = tzCustomTagHelper.getTemplate(this.getTagName() + "Template"); // @-@:p1(geo) Experimental

      tzCustomTagHelper.renderTagFromTemplate(containerNode, template, context);

      // update the width
      if (tzDomHelper.isNotEmpty(context.width)) {
        containerNode.style.width = context.width;
      }
    }
  };

}(tzDomHelperModule, tzCustomTagHelperModule));
