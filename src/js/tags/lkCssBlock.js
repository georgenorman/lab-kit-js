/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lkCssBlock> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/*
 * The <lkCssBlock> tag renders a <style> block, with the text extracted from the element
 * with the specified templateId.
 *
 * The tag attributes are read from the lkCssBlock element, as shown in the example below:
 *
 *    <lkCssBlock templateId="basicBoxModelCss"></lkCssBlock>
 *
 * @attribute templateId - ID of the element containing the CSS code to insert.
 */
var lkCssBlockTag = (function(tzDomHelper, tzCustomTagHelper) {
  "use strict";

  return {
    getTagName: function() {
      return "lkCssBlock";
    },

    /**
     * Render all <lkCssBlock> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <lkCssBlock> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given lkStyleTagNode.
     *
     * @param lkStyleTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(lkStyleTagNode) {
      // build the context
      var context = {
        "rawCss": tzDomHelper.getInnerHtml(lkStyleTagNode.getAttribute("templateId"))
      };

      // render the result
      this.render(lkStyleTagNode, context);
    },

    /**
     * Render the <style> block into the given containerNode.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            - rawCss the raw styles to render into the given containerNode.
     */
    render: function(containerNode, context) {
      if (tzDomHelper.isEmpty(context.rawCss)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"style.color":"red"}', "Raw CSS is missing");
      } else {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "style", null, context.rawCss);
      }
    }
  }

}(tzDomHelperModule, tzCustomTagHelperModule));
