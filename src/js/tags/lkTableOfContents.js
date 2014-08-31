/*
 ~ Copyright (c) 2014 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Renders <lk-table-of-contents> tags - sharable among all projects.
 ~ --------------------------------------------------------------
 */

/**
 * Auto-generates a simple two-level Table of Contents.
 * A default title of "Table of Contents" will be used if the title is not provided.
 * The title is rendered as an h2 element.
 *<p>
 * Limitations:
 * <ol>
 *   <li> There can be only one Table of Contents section per page.
 *   <li> Maximum levels is two.
 * </ol>
 *
 * The tag attributes are read from the lkTableOfContents element, as shown in the example below:
 * <pre style="background:#eee; padding:6px;">
 *    &lt;lk-table-of-contents class="toc" level1ItemsTagName="h2" level2ItemsTagName="h3"&gt;
 *    &lt;/lk-table-of-contents&gt;
 * </pre>
 *
 * <p style="padding-left:12px;">
 * <h6>Tag Attributes:</h6>
 * <table class="params">
 *   <thead><tr><th>Name</th><th class="last">Description</th></tr></thead>
 *   <tr><td class="name"><code>class</code></td><td>the CSS class to apply to the rendered Table of Contents</td></tr>
 *   <tr><td class="name"><code>level1ItemsTagName</code></td>
 *       <td>
 *         tag name used to identify the level-1 headers to be included in the Table of Contents
 *         (e.g., "h2" would cause all h2 elements on the page, to be used as items in the generated Table of Contents).
 *       </td>
 *   </tr>
 *   <tr><td class="name"><code>level2ItemsTagName</code></td>
 *       <td>
 *         tag name used to identify the level-2 headers to be included under each level-1 header
 *         (e.g., "h3" would cause all h3 elements on the page, to be used as sub-items in the generated Table of Contents).
 *       </td>
 *   </tr>
 *   <tr><td class="name"><code>title</code></td><td>optional title (default is "Table of Contents").</td></tr>
 * </table>
 *
 * @module lkTableOfContentsTag
 */
var lkTableOfContentsTag = (function(tzGeneralUtils, tzDomHelper, tzCustomTagHelper) {
  "use strict";

  return {
    /**
     * Return the name of this tag.
     *
     * @returns {string}
     */
    getTagName: function() {
      return "lk-table-of-contents";
    },

    /**
     * Render the 'Table of Contents' tag.
     */
    renderAll: function() {
      // there can be only one 'table of contents' per page.
      tzCustomTagHelper.renderFirst(this);
    },

    /**
     * Render the 'Table of Contents' tag identified by the given <code>tagId</code>.
     *
     * @param tagId ID of the tag to render.
     */
    renderTagById: function(tagId) {
      tzCustomTagHelper.renderTagById(this, tagId);
    },

    /**
     * Render the given <code>lkHtmlTagNode</code>.
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
     * Render the 'Table of Contents' into the given <code>containerNode</code>.
     *
     * @param containerNode where to render the result.
     * @param context object containing the values needed to render the result:
     *           <ul>
     *             <li>cssClassName: css class name to use for the Table of Contents.
     *             <li>level1ItemsTagName: tag name used to identify the level-1 headers to be included in the Table of Contents.
     *             <li>level2ItemsTagName: tag name used to identify the level-2 headers to be included under each level-1 header.
     *             <li>title: optional title (default is "Table of Contents").
     *           <ul>
     */
    render: function(containerNode, context) {
      // find all level-1 nodes
      var level1NodeList = document.getElementsByTagName(context.level1ItemsTagName);

      // find all level-2 nodes (if tag name is given)
      var level2NodeList = null;
      if (tzGeneralUtils.isNotEmpty(context.level2ItemsTagName)) {
        level2NodeList = document.getElementsByTagName(context.level2ItemsTagName);
      }

      // start ToC
      var toc = tzDomHelper.createElement(null, "ul", '{"className":"'+tzGeneralUtils.coalesce(context.cssClassName, "toc")+'"}'); // default to "toc"

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
      context.title = tzGeneralUtils.coalesce(context.title, "Table of Contents");
      tzDomHelper.createElementWithAdjacentHtml(containerNode,"h2", '{"id":"tableOfContents"}', "<b>" + context.title + "</b>");

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

    var tocItemText = tzGeneralUtils.coalesce(node.innerHTML, node.id);
    result.insertAdjacentHTML("afterbegin", "<a href=\"#" + node.id + "\">" + tocItemText + "</a>");

    return result;
  }

}(tzGeneralUtilsModule, tzDomHelperModule, tzCustomTagHelperModule));
