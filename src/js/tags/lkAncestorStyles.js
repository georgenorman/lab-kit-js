/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-ancestor-styles> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 ~
 */

/**
 * Renders a set of styles, for all ancestors of a given element.
 * The ancestor styles are displayed in a table. The <code>startElementId</code> attribute specifies
 * where the traversal begins. The <code>styleNames</code> tag specifies the list of styles to
 * be rendered in the table.
 *
 * <pre style="background:#eee; padding:6px;">
 *  &lt;!-- Render the position and display styles for all ancestors of the "innermost" element. --&gt;
 *  &lt;lk-ancestor-styles title="Genealogy of innermost" startElementId="innermost"&gt;
 *    &lt;comment&gt;A comment rendered beneath the Ancestors header&lt;/comment&gt;
 *    &lt;styleNames&gt;position, display&lt;/styleNames&gt;
 *  &lt;/lk-ancestor-styles&gt;
 * </pre>
 *
 * @module lkAncestorStylesTag
 */
var lkAncestorStylesTag = (function(tzDomHelper, tzCustomTagHelper, lkDisplayStyles) {
  "use strict";

  var commentExpression = new RegExp("<comment>((.|\n)*)<\/comment>", "ig");
  var styleNamesExpression = new RegExp("<styleNames>(.+?)<\/styleNames>", "ig");

  return {
    /**
     * Return the name of this tag.
     *
     * @returns {string}
     */
    getTagName: function() {
      return "lk-ancestor-styles";
    },

    /**
     * Render all &lt;lk-ancestor-styles&gt; tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the &lt;lk-ancestor-styles&gt; tag identified by the given <code>tagId</code>.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given <code>AncestorStylesTagNode</code>.
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

      // remove child nodes (e.g., <code>rawRightColumnHtml</code> retrieved for use by the right column)
      tzDomHelper.removeAllChildNodes(ancestorStylesTagNode);

      // render the result
      this.render(ancestorStylesTagNode, context);
    },

    /**
     * Render into the given <code>containerNode</code>, the style property names and values, for the elements in the given <code>unorderedListItems</code>.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            <ul>
     *              <li>title: optional heading for the style list.
     *              <li>unorderedListItems: list of element-id/css-property-name pairs used to render the result. The element-id is used to lookup an
     *                  element and the css-property-name is used to read and display its property value.
     *              <li>useCompactUnorderedList: if true, then all property names are the same, so displays a list of property/value pairs without the property name;
     *                  otherwise, displays the same list, but includes the property name for each item in the list.
     *            </ul>
     */
    render: function(containerNode, context) {
      // render the result using the lkDisplayStyles tag
      lkDisplayStyles.render(containerNode, context);
    }
  }

}(tzDomHelperModule, tzCustomTagHelperModule, lkDisplayStylesTag));
