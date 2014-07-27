/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-bullet-point> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * The <code>&lt;lk-bullet-point&gt;</code> tag behaves like a single list item - it renders a status icon on the left followed by an HTML block on the right.
 *<p>
 * The tag attributes are read from the <code>lk-bullet-point</code> element, as shown in the example below:
 * <pre style="background:#eee; padding:6px;">
 *    &lt;lk-bullet-point iconClass="success" leftColumnWidth="25px"&gt;
 *      This experiment successfully shows that...
 *    &lt;/lk-bullet-point&gt;
 * </pre>
 *
 * <p style="padding-left:12px;">
 * <h6>Tag Attributes:</h6>
 * <table class="params">
 *   <thead><tr><th>Name</th><th class="last">Description</th></tr></thead>
 *   <tr><td class="name"><code>iconClass</code></td><td>class name used to style the &lt;i&gt; element used as a placeholder for the icon. </td><tr>
 *   <tr><td class="name"><code>leftColumnWidth</code></td>
 *       <td>
 *         optional width of the left column.
 *         The following icons are predefined: "lk-bullet-point-pass", "lk-bullet-point-fail" (see css/lkBulletPoint.css).
 *       </td>
 *   <tr>
 *   <tr><td class="name"><code>style</code></td><td>optional style for the wrapper div.</td><tr>
 * </table>
 *
 * @module lkBulletPointTag
 */
var lkBulletPointTag = (function(tzDomHelper, tzCustomTagHelper) {
  "use strict";

  var template =
      ['<div class="group" {{context.styleAttribute}}>',
       '  <div><i class="{{context.iconClass}}"></i></div>',
       '  <div style="margin-left:{{context.leftColumnWidth}};">{{context.rawRightColumnHtml}}</div>',
       '</div>'
      ].join('\n');

  return {
    /**
     * Return the name of this tag.
     *
     * @returns {string}
     */
    getTagName: function() {
      return "lk-bullet-point";
    },

    /**
     * Render all <code>&lt;lk-bullet-point&gt;</code> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <code>&lt;lk-bullet-point&gt;</code> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given <code>lkBulletPointTagNode</code>.
     *
     * @param lkBulletPointTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(lkBulletPointTagNode) {
      // build the context
      var style = lkBulletPointTagNode.getAttribute("style");
      var context = {
        "iconClass": lkBulletPointTagNode.getAttribute("iconClass"), // class name
        "styleAttribute": tzDomHelper.isEmpty(style) ? "" : "style='" + style + "'", // complete style attribute
        "leftColumnWidth": tzDomHelper.coalesce(lkBulletPointTagNode.getAttribute("leftColumnWidth"), "24px"),
        "rawRightColumnHtml": lkBulletPointTagNode.innerHTML
      };

      // remove child nodes (e.g., rawRightColumnHtml retrieved for use by the right column)
      tzDomHelper.removeAllChildNodes(lkBulletPointTagNode);

      // render the result
      this.render(lkBulletPointTagNode, context);
    },

    /**
     * Render the <code>&lt;lk-bullet-point&gt;</code> tag into the given <code>containerNode</code>.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *           <ul>
     *             <li>iconClass: css used to render an icon in the left column.
     *             <li>leftColumnWidth: width of the left column.
     *             <li>rawRightColumnHtml: the raw HTML to render into the right column.
     *           </ul>
     */
    render: function(containerNode, context) {
      //var template = tzCustomTagHelper.getTemplate(this.getTagName() + "Template"); // @-@:p1(geo) Experimental

      tzCustomTagHelper.renderTagFromTemplate(containerNode, template, context);
    }
  };

}(tzDomHelperModule, tzCustomTagHelperModule));
