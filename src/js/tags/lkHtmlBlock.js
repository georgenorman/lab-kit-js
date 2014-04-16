/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lkHtmlBlock> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/*
 * The <lkHtmlBlock> tag renders a heading, followed by a <code> block with the XML escaped text from the element of the given templateId.
 *
 * The tag attributes are read from the lkCodeExample element, as shown in the example below:
 *
 *    <lkHtmlBlock templateId="basicBoxModelHtml" heading="Rendered Result">
 *      <comment>Optional Comment</comment>
 *    </lkHtmlBlock>
 *
 * @attribute templateId - ID of the element containing the raw HTML code to render.
 * @attribute heading - heading text [optional]
 */
var lkHtmlBlockTag = (function(tzDomHelper, tzCustomTagHelper) {
  "use strict";

  var commentExpression = new RegExp("<comment>(.+?)</comment>", "ig");

  return {
    getTagName: function() {
      return "lkHtmlBlock";
    },

    /**
     * Render all <lkHtmlBlock> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <lkHtmlBlock> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given lkHtmlTagNode.
     *
     * @param lkHtmlTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(lkHtmlTagNode) {
      var templateId = lkHtmlTagNode.getAttribute("templateId");
      var heading = lkHtmlTagNode.getAttribute("heading");
      if (tzDomHelper.isEmpty(heading)) {
        heading = "Rendered Result";
      }

      // build the context
      var context = {
        "heading": heading,
        "resultComment": tzCustomTagHelper.getFirstMatchedGroup(lkHtmlTagNode, commentExpression),
        "rawHtml": tzDomHelper.getInnerHtml(templateId)
      };

      // remove all child nodes, previously added from render (or renderAll).
      tzDomHelper.removeAllChildNodes(lkHtmlTagNode);

      // render the result
      this.render(lkHtmlTagNode, context);
    },

    /**
     * Render the HTML code block into the given containerNode.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            - heading optional heading to display for the live code block.
     *            - resultComment optional comment to render above the live result.
     *            - rawHtml the code that will be rendered into the given containerNode.
     */
    render: function(containerNode, context) {
      // render optional heading, if present
      if (tzDomHelper.isNotEmpty(context.heading)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "h4", null, context.heading);
      }

      // render optional result comment, if present
      if (tzDomHelper.isNotEmpty(context.resultComment)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"className":"lk-html-block-comment"}', context.resultComment);
      }

      // render raw HTML from the template
      var div = tzDomHelper.createElementWithAdjacentHtml(containerNode, "div", '{"className":"lk-html-block"}', context.rawHtml);
      if (tzDomHelper.isNotEmpty(context.height)) {
        div.style.height = context.height;
      }
    }
  }
}(tzDomHelperModule, tzCustomTagHelperModule));
