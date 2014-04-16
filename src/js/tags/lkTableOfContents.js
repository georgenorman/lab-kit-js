/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lkTableOfContents> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * The &lt;lkTableOfContents&gt; tag auto-generates a simple two-level Table of Contents.
 * A default title of "Table of Contents" will be used if the title is not provided.
 * The title is rendered as an h2 element.
 *
 * Limitations:
 *   1. There can be only one Table of Contents section per page.
 *   2. Maximum levels is two.
 *
 * The tag attributes are read from the lkTableOfContents element, as shown in the example below:
 *
 *    &lt;lkTableOfContents class="toc" level1ItemsTagName="h2" level2ItemsTagName="h3"&gt;&lt;/lkTableOfContents&gt;
 *
 * @attribute class - the CSS class to apply to the rendered Table of Contents
 * @attribute level1ItemsTagName - tag name used to identify the level-1 headers to be included in the Table of Contents
 *        (e.g., "h2" would cause all h2 elements on the page, to be used as items in the generated Table of Contents).
 * @attribute level2ItemsTagName - tag name used to identify the level-2 headers to be included under each level-1 header
 *        (e.g., "h3" would cause all h3 elements on the page, to be used as sub-items in the generated Table of Contents).
 * @attribute title - optional title (default is "Table of Contents").
 */
var lkTableOfContentsTag = (function(tzDomHelper, tzCustomTagHelper) {
  "use strict";

  return {
    getTagName: function() {
      return "lkTableOfContents";
    },

    /**
     * Render the 'Table of Contents' tag.
     */
    renderAll: function() {
      // there can be only one 'table of contents' per page.
      tzCustomTagHelper.renderFirst(this);
    },

    /**
     * Render the 'Table of Contents' tag identified by the given tagId.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given lkHtmlTagNode.
     *
     * @param tocNode the node to retrieve the attributes from and then render the result to.
     */
    renderTag: function(tocNode) {
      // get the attributes
      var context = {
        "cssClassName": tocNode.getAttribute("class"),
        "level1ItemsTagName": tocNode.getAttribute("level1ItemsTagName"),
        "level2ItemsTagName": tocNode.getAttribute("level2ItemsTagName"),
        "title": tocNode.getAttribute("title")
      };

      // render the result
      this.render(tocNode, context);
    },

    /**
     * Render the 'Table of Contents' into the given containerNode.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *            - cssClassName css class name to use for the Table of Contents.
     *            - level1ItemsTagName tag name used to identify the level-1 headers to be included in the Table of Contents.
     *            - level2ItemsTagName tag name used to identify the level-2 headers to be included under each level-1 header.
     *            - title optional title (default is "Table of Contents").
     */
    render: function(containerNode, context) {
      // find all level-1 nodes
      var level1NodeList = document.getElementsByTagName(context.level1ItemsTagName);

      // find all level-2 nodes (if tag name is given)
      var level2NodeList = null;
      if (tzDomHelper.isNotEmpty(context.level2ItemsTagName)) {
        level2NodeList = document.getElementsByTagName(context.level2ItemsTagName);
      }

      // start ToC
      var toc = tzDomHelper.createElement(null, "ul", '{"className":"'+tzDomHelper.coalesce(context.cssClassName, "toc")+'"}'); // default to "toc"

      // generate list of level-1 and level-2 ToC items
      for (var i = 0; i < level1NodeList.length; i++) {
        // there will always be a level-1 item, so create and initialize
        var tocLevel1Item = createTableOfContentsItem(level1NodeList[i]);

        // level-2 items are optional
        var currentLevel2Nodes = findAllNodesWithIdsThatBeginWith(level2NodeList, level1NodeList[i].id + ".");
        if (currentLevel2Nodes.length > 0) {
          var level2ItemList = document.createElement("ul");

          for (var j = 0; j < currentLevel2Nodes.length; j++) {
            level2ItemList.appendChild(createTableOfContentsItem(currentLevel2Nodes[j]));
          }

          tocLevel1Item.appendChild(level2ItemList);
        }

        toc.appendChild(tocLevel1Item);
      }

      // add heading
      context.title = tzDomHelper.coalesce(context.title, "Table of Contents");
      tzDomHelper.createElementWithAdjacentHtml(containerNode,"h2", null, "<b>" + context.title + "</b>");

      // add all items to ToC element
      containerNode.appendChild(toc);
    }
  };

  // --------------------------------------------------------
  // private functions
  // --------------------------------------------------------

  /**
   * Return the subset of given nodesToSearch, that have IDs that begin with the given searchString.
   *
   * @param nodesToSearch list of nodes to search
   * @param searchString string
   */
  function findAllNodesWithIdsThatBeginWith(nodesToSearch, searchString) {
    var result = [];

    if (nodesToSearch != null) {
      for (var i = 0; i < nodesToSearch.length; i++) {
        if (nodesToSearch[i].id.indexOf(searchString) == 0) {
          result.push(nodesToSearch[i]);
        }
      }
    }

    return result;
  }

  function createTableOfContentsItem(node) {
    var result = document.createElement("li");

    if (node.hasAttribute("lkBulletPointPass")) {
      result.className += " pass";
    } else if (node.hasAttribute("lkBulletPointFail")) {
      result.className += " fail";
    }

    var tocItemText = tzDomHelper.coalesce(node.innerHTML, node.id);
    result.insertAdjacentHTML("afterbegin", "<a href=\"#" + node.id + "\">" + tocItemText + "</a>");

    return result;
  }

}(tzDomHelperModule, tzCustomTagHelperModule));
