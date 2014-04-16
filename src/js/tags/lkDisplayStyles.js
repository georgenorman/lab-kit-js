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
 * The <lkDisplayStyles> tag renders one or more styles from one or more elements.
 * It has several forms, each of which are described below:
 *
 * 1. Compact unordered list: The style name is the same for each item in the list. The list items are defined in the tag body.
 *
 *      <lkDisplayStyles styleName="position">outermost, middleGrid, innerBox</lkDisplayStyles>
 *
 * 2. Verbose unordered list: The style name is unique for each item in the list. The list items are defined in the tag body
 *
 *      <lkDisplayStyles>
 *        { "outerMost": "position", "middleGrid": "margin", "innerMost": "padding" }
 *      </lkDisplayStyles>
 *
 * 3. Matrix: The styles are displayed in a table. The rows and columns are defined in the tag body.
 *
 *      <lkDisplayStyles>
 *        <styleNames>padding, margin</styleNames>
 *        <legendImages>./img/outermost.png, ./img/middleGrid.png, ./img/innerBox.png</legendImages>
 *        <elementIds>outermost, middleGrid, innerBox</elementIds>
 *      </lkDisplayStyles>
 *
 */
var lkDisplayStylesTag = (function(tzDomHelper, tzCustomTagHelper) {
  "use strict";

  var commentExpression = new RegExp("<comment>(.+?)</comment>", "ig");
  var legendImagesExpression = new RegExp("<legendImages>(.+?)</legendImages>", "ig");
  var elementIdsExpression = new RegExp("<elementIds>(.+?)</elementIds>", "ig");
  var styleNamesExpression = new RegExp("<styleNames>(.+?)</styleNames>", "ig");

  // --------------------------------------------------------------
  // variantMgr
  // --------------------------------------------------------------

  var variantMgr = {
    handleCompactListVariant: function(displayStylesTagNode, context) {
      // variant: compact unordered list, where the styleName is the same for each item
      context["useCompactUnorderedList"] = "true"; // all property names are the same

      if (tzDomHelper.isEmpty(context["title"])) {
        context["title"] = "Rendered '" + context["styleName"] + " styles:";
      }
      var itemIds = displayStylesTagNode.innerHTML.replace(/\s+/g, '');

      context["unorderedListItems"] = listItemsToMap(itemIds, context["styleName"]); // e.g., {"id1": "margin", "id2": "margin"}
    },

    handleVerboseListVariant: function(displayStylesTagNode, context) {
      // variant: verbose unordered list, where the styleName is contained in tag content: {"elementID": "styleName"}, ...
      if (tzDomHelper.isEmpty(context["title"])) {
        context["title"] = "Rendered styles:";
      }

      context["useCompactUnorderedList"] = "false";
      var itemsAsString = displayStylesTagNode.innerHTML.trim();
      context["unorderedListItems"] = JSON.parse(itemsAsString);
    },

    handleMatrixVariant: function(displayStylesTagNode, context) {
      if (tzDomHelper.isEmpty(context["title"])) {
        context["title"] = "Rendered styles:";
      }

      var legendImages = "";
      if (displayStylesTagNode.innerHTML.match(legendImagesExpression)) {
        legendImages = displayStylesTagNode.innerHTML.match(legendImagesExpression)[0].replace(legendImagesExpression, "$1");
      }
      var elementIds = displayStylesTagNode.innerHTML.match(elementIdsExpression)[0].replace(elementIdsExpression, "$1");
      var styleNames = displayStylesTagNode.innerHTML.match(styleNamesExpression)[0].replace(styleNamesExpression, "$1");

      try {
        var elements = elementIdsToElements(tzDomHelper.splitWithTrim(elementIds));

        var matrix = {};
        matrix["legendImages"] = tzDomHelper.splitWithTrim(legendImages);
        matrix["elements"] = elements;
        matrix["styleNames"] = tzDomHelper.splitWithTrim(styleNames);
        matrix["columnOptions"] = "[id]";

        context["matrix"] = matrix;
      } catch (e) {
        console.log(e);
      }
    }
  };

  // =================================================================
  // lkDisplayStylesTag
  // =================================================================

  return {
    getTagName: function() {
      return "lkDisplayStyles";
    },

    /**
     * Render all <lkDisplayStyles> tags on the page.
     */
    renderAll: function() {
      tzCustomTagHelper.renderAll(this);
    },

    /**
     * Render the <lkDisplayStyles> tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given displayStylesTagNode.
     *
     * @param title optional heading for the style list.
     * @param displayStylesTagNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(displayStylesTagNode) {
      var context = {
        "title": null,
        "comment": null,
        "width": null,
        "useCompactUnorderedList": null,  // all property names are the same
        "unorderedListItems": null,
        "matrix": null
      };

      // get optional title
      context["title"] = displayStylesTagNode.getAttribute("title");

      // get optional comment block
      if (displayStylesTagNode.innerHTML.match(commentExpression)) {
        context["comment"] = displayStylesTagNode.innerHTML.match(commentExpression)[0].replace(commentExpression, "$1");
      }

      // get optional width and style name
      context["width"] = displayStylesTagNode.getAttribute("width");
      var styleName = displayStylesTagNode.getAttribute("styleName");

      // handle tag variants (constant styleName for all items or unique styleName per item, etc)
      if (tzDomHelper.isNotEmpty(displayStylesTagNode.innerHTML)) {
        if (tzDomHelper.isEmpty(styleName)) {
          // styleName was not given, so it must be table or verbose list
          if (elementIdsExpression.test(displayStylesTagNode.innerHTML)) {
            variantMgr.handleMatrixVariant(displayStylesTagNode, context);
          } else {
            variantMgr.handleVerboseListVariant(displayStylesTagNode, context);
          }
        } else {
          // all styles use the same styleName (making a compact list)
          variantMgr.handleCompactListVariant(displayStylesTagNode, context);
        }
      }

      // remove child nodes (e.g., child tag of item IDs)
      tzDomHelper.removeAllChildNodes(displayStylesTagNode);

      // render the result
      this.render(displayStylesTagNode, context);
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
       // handle optional title
      if (tzDomHelper.isNotEmpty(context.title)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "h4", null, context.title);
      }

      // handle optional comment
      if (tzDomHelper.isNotEmpty(context.comment)) {
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "p", '{"className":"lk-code-example-comment"}', context.comment);
      }

      // render as matrix, unordered list, or error.
      if (tzDomHelper.isNotEmpty(context.matrix)) {
        renderAsMatrix(containerNode, context);
      } else if (tzDomHelper.isNotEmpty(context.unorderedListItems)) {
        renderAsUnorderedList(containerNode, context);
      } else {
        // property list was not provided, so display an error.
        tzDomHelper.createElementWithAdjacentHtml(containerNode, "div", '{"style.color":"red"}', "ERROR: Table or Unordered list items were not specified or items not found.");
      }
    }
  };

  // --------------------------------------------------------------
  // private functions
  // --------------------------------------------------------------

  function renderAsMatrix(containerNode, context) {
    var matrix = context.matrix;
    var table, tr, th, td;

    // create a wrapper div, so that the child table can scroll on small screens. Do appendChild on containerNode, after entire element is built
    var wrapper = tzDomHelper.createElement(null, "div", '{"className":"lk-display-styles-matrix"}');

    // create table and optionally set the width
    table = tzDomHelper.createElement(wrapper, "table");
    if (tzDomHelper.isNotEmpty(context.width)) {
      table.style.width = context.width;
    }

    // render the header ("legend", "name", "id", then styleNames)
    tr = tzDomHelper.createElement(table, "tr");

    //   - optionally, display legend
    if (tzDomHelper.isNotEmpty(matrix.legendImages)) {
      tzDomHelper.createElementWithAdjacentHtml(tr, "th", null, "legend");
    }

    //   - optionally, display element name
    if (matrix.columnOptions.indexOf("[name]") >= 0) {
      tzDomHelper.createElementWithAdjacentHtml(tr, "th", null, "name");
    }

    //   - optionally, display element id
    if (matrix.columnOptions.indexOf("[id]") >= 0) {
      tzDomHelper.createElementWithAdjacentHtml(tr, "th", null, "id");
    }

    //   - display all style names
    for (var styleIndex in matrix.styleNames) {
      tzDomHelper.createElementWithAdjacentHtml(tr, "th", null, matrix.styleNames[styleIndex]);
    }

    // render the table body (one row for each requested element)
    for (var eleIndex in matrix.elements) {
      tr = tzDomHelper.createElement(table, "tr");

      // first column is the legend
      if (tzDomHelper.isNotEmpty(matrix.legendImages)) {
        td = tzDomHelper.createElement(tr, "td", '{"className": "center"}');
        if (matrix.legendImages.length > eleIndex) {
          tzDomHelper.createElement(td, "img", '{"src": "'+matrix.legendImages[eleIndex]+'"}');
        } else {
          tzDomHelper.createElementWithAdjacentHtml(td, "div", null, "???");
        }
      }

      // optionally, display element name
      if (matrix.columnOptions.indexOf("[name]") >= 0) {
        tzDomHelper.createElementWithAdjacentHtml(tr, "td", null, matrix.elements[eleIndex].nodeName);
      }

      // optionally, display element id
      if (matrix.columnOptions.indexOf("[id]") >= 0) {
        tzDomHelper.createElementWithAdjacentHtml(tr, "td", null, matrix.elements[eleIndex].id);
      }

      // remaining columns are the element's styles
      for (var styleIndex in matrix.styleNames) {
        var styleValue = tzDomHelper.getStyleValue(matrix.elements[eleIndex], matrix.styleNames[styleIndex]);
        tzDomHelper.createElementWithAdjacentHtml(tr, "td", null, styleValue);
      }
    }

    containerNode.appendChild(wrapper);
  }

  function renderAsUnorderedList(containerNode, context) {
    var ul = tzDomHelper.createElement(null, "ul");
    for (var elementId in context.unorderedListItems) {
      var generatedHtml;
      var styleName = context.unorderedListItems[elementId];

      if (context.useCompactUnorderedList == 'true') {
        generatedHtml = "Element '" + elementId + "' is: " + tzDomHelper.getStyleValueById(elementId, styleName);
      } else {
        generatedHtml = "Element '" + elementId + "' has " + styleName + ": " + tzDomHelper.getStyleValueById(elementId, styleName);
      }
      tzDomHelper.createElementWithAdjacentHtml(ul, "li", null, generatedHtml);
    }

    containerNode.appendChild(ul);
  }

  /**
   * Return a map using the given itemIds as the key and the given styleName for every value
   * (e.g., {"id1": "margin", "id2": "margin"} ).
   *
   * @param itemIds element IDs
   * @param styleName
   * @returns {{}}
   */
  function listItemsToMap(itemIds, styleName) {
    var result = {};
    var itemIdList = tzDomHelper.splitWithTrim(itemIds);

    for (var i = 0; i < itemIdList.length; i++) {
      result[itemIdList[i]] = styleName;
    }

    return result;
  }

  /**
   * Return the set of elements, found in the document, matching the given set of elementIds.
   *
   * @param elementIds IDs of elements to retrieve from the document
   * @returns {Array}
   */
  function elementIdsToElements(elementIds) {
    var result = new Array();

    for (var elementId in elementIds) {
      var element = document.getElementById( elementIds[elementId] );

      if (element == null) {
        throw "Element not found. The bad elementId is: " + elementIds[elementId];
      }

      result.push(element);
    }

    return result;
  }

}(tzDomHelperModule, tzCustomTagHelperModule));
