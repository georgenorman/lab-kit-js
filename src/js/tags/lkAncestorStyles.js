/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lkDisplayStyles> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 ~
 */

/*
 * The <lkAncestorStyles> tag renders a set of styles for all ancestors of a given element.
 * The ancestor styles are displayed in a table. The startElementId attribute specifies
 * where to the start the traversal. The styleNames tag specifies the list of styles to
 * be rendered in the table
 *
 *  <lkAncestorStyles title="Genealogy of innermost" startElementId="innermost">
 *    <comment>A comment rendered beneath the Ancestors header</comment>
 *    <styleNames>position, display</styleNames>
 *  </lkAncestorStyles>
 */
var lkAncestorStylesTag = (function(tzDomHelper, tzCustomTagHelper, lkDisplayStyles) {
  "use strict";

  var commentExpression = new RegExp("<comment>((.|\n)*)<\/comment>", "ig");
  var styleNamesExpression = new RegExp("<styleNames>(.+?)<\/styleNames>", "ig");

  return {
    getTagName: function() {
      return "lkAncestorStyles";
    },

    /**
     * Render all <lkAncestorStyles> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <lkAncestorStyles> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given AncestorStylesTagNode.
     *
     * @param ancestorStylesTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(ancestorStylesTagNode) {
      // get the title, width and startElementId from the tag
      var title = ancestorStylesTagNode.getAttribute("title");
      var width = ancestorStylesTagNode.getAttribute("width");
      var startElementId = ancestorStylesTagNode.getAttribute("startElementId");

      // get the child tags
      var comment = tzCustomTagHelper.getFirstMatchedGroup(ancestorStylesTagNode, commentExpression);
      var styleNames = ancestorStylesTagNode.innerHTML.match(styleNamesExpression)[0].replace(styleNamesExpression, "$1");

      // traverse the ancestry
      var elementArray = new Array();
      var element = document.getElementById( startElementId );
      while (element.parentNode != null) {
        elementArray.push(element);
        element = element.parentNode;
      }

      // create the matrix object
      var matrix = {
        "elements": elementArray,
        "styleNames": tzDomHelper.splitWithTrim(styleNames),
        "columnOptions": "[id][name]"
      };

      // create the context object
      var context = {
        "title": title,
        "comment": comment,
        "width": width,
        "useCompactUnorderedList": null,
        "unorderedListItems": null,
        "matrix": matrix
      };

      // remove child nodes (e.g., rawRightColumnHtml retrieved for use by the right column)
      tzDomHelper.removeAllChildNodes(ancestorStylesTagNode);

      // render the result
      this.render(ancestorStylesTagNode, context);
    },

    /**
     * Render into the given containerNode, the style property names and values, for the elements in the given unorderedListItems.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            - title optional heading for the style list.
     *            - unorderedListItems list of element-id/css-property-name pairs used to render the result. The element-id is used to lookup an
     *              element and the css-property-name is used to read and display its property value.
     *            - useCompactUnorderedList if true, then all property names are the same, so displays a list of property/value pairs without the property name;
     *              otherwise, displays the same list, but includes the property name for each item in the list.
     */
    render: function(containerNode, context) {
      // render the result using the lkDisplayStyles tag
      lkDisplayStyles.render(containerNode, context);
    }
  }

}(tzDomHelperModule, tzCustomTagHelperModule, lkDisplayStylesTag));
