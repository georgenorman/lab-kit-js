/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-bullet-point> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/*
 * The <lk-bullet-point> tag behaves like a single list item - it renders a status icon on the left followed by an HTML block on the right.
 *
 * The tag attributes are read from the lk-bullet-point element, as shown in the example below:
 *
 *    <lk-bullet-point iconClass="success" widthLeft="25px">This experiment successfully shows that...</lk-bullet-point>
 *
 * @attribute iconClass class name used to style the <i> element used as a placeholder for the icon.
 *      The following icons are predefined: "lk-bullet-point-pass", "lk-bullet-point-fail" (see css/lkBulletPoint.css).
 * @attribute leftColumnWidth optional width of the left column.
 * @attribute style optional style for the wrapper div.
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
    getTagName: function() {
      return "lk-bullet-point";
    },

    /**
     * Render all <lk-bullet-point> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <lk-bullet-point> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given lkBulletPointTagNode.
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
     * Render the <lk-bullet-point> tag into the given containerNode.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            - iconClass css used to render an icon in the left column.
     *            - leftColumnWidth width of the left column.
     *            - rawRightColumnHtml the raw HTML to render into the right column.
     */
    render: function(containerNode, context) {
      //var template = tzCustomTagHelper.getTemplate(this.getTagName() + "Template"); // @-@:p1(geo) Experimental

      tzCustomTagHelper.renderTagFromTemplate(containerNode, template, context);
    }
  };

}(tzDomHelperModule, tzCustomTagHelperModule));
