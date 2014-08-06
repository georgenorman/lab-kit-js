# LabKit JS

LabKit is a simple JavaScript library that helps build web pages with live CSS and HTML examples (a DSL for web experiments).
The main functionality is provided by a set of tags that can be added to any HTML page.
For example, the `<lk-html-example>` tag renders the given CSS and HTML code-examples and then inserts them into the document, for a live rendering of the example.
To help organize the experiments, the `<lk-table-of-contents>` tag can be used to automatically generate a Table of Contents for the page.

## Demos

* [CSS Lab](http://www.thruzero.com/pages/jcat3/css-lab/index.html)
* [JS Lab](http://www.thruzero.com/pages/jcat3/js-lab/index.html)


## JSDoc

[LabKit JSDocs](http://www.thruzero.com/pages/jcat3/lab-kit-js-jsdoc/index.html)

## Overview of LabKit Tags

### ‣ CSS Example tag

The `<lk-css-example>` tag renders the given CSS code, with syntax highlighting and line numbers, as an example, and then injects the raw CSS into the DOM, so it will be rendered live.
The examples use nested code templates.

```xml
<lk-css-example width="111">
  <cssComment>A comment rendered beneath the CSS header.</cssComment>
  <script type="multiline-template">
    .foo {color: red;}
  </script>
</lk-css-example>
```

Tag attributes:

* **width** - Optional width of the rendered example.

### ‣ HTML Example tag

The `<lk-html-example>` tag renders the given HTML code, with syntax highlighting and line numbers, as an example, and then injects the raw HTML into the DOM, so it will be rendered live.
The examples use nested code templates.

```xml
<lk-html-example width="111">
  <htmlComment>A comment rendered beneath the HTML header.</htmlComment>
  <script type="multiline-template">
    <span class="foo">This is red</span>
  </script>
</lk-html-example>
```

Tag attributes:

* **width** - Optional width of the rendered example.

**[⬆ back to top](#readme)**

### ▸ Table Of Contents tag

The `<lk-table-of-contents>` tag auto-generates a simple two-level Table of Contents.

Example:

```xml
<lk-table-of-contents class="toc" level1ItemsTagName="h2" level2ItemsTagName="h3">
</lk-table-of-contents>
```

Limitations:

1. There can be only one Table of Contents section per page.
2. Maximum levels is two (e.g., h2 and h3 headings).

Tag attributes:

* **class** - CSS class used to render the Table of Contents.
* **level1ItemsTagName** - Tag name used to identify the level-1 headers to be included in the Table of Contents (e.g., "h2" would cause all h2 elements on the page, to be used as first-level items in the generated Table of Contents).
* **level2ItemsTagName** - Tag name used to identify the level-2 headers to be included under each level-1 header (e.g., "h3" would cause all h3 elements on the page, to be used as sub-items in the generated Table of Contents).
* **title** - Optional title (default is "Table of Contents").

First-level item Example:

```xml
<h2 id="basicFloats">Basic Floats</h2>
```

Second-level item Example (the ID from its parent item is prepended and uses a dot separator):

```xml
<h3 id="basicFloats.floatLeftNoFrills">Float Left No Frills</h3>
```

**[⬆ back to top](#readme)**

### ▸ Display Styles tag

The `<tz-display-styles>` tag renders the values of a specified set of styles for a specified set of elements.
It has several forms, each of which are described below:

##### ◖Compact unordered list

The style name is the same for each item in the list. The list items are defined in the tag body:

```xml
<tz-display-styles styleName="position">
  outermost, middleGrid, innerBox
</tz-display-styles>
```

##### ◖Verbose unordered list

The style name is unique for each item in the list. The style name and list items are defined in the tag body:

```xml
<tz-display-styles>
  { "outerMost": "position", "middleGrid": "margin", "innerMost": "padding" }
</tz-display-styles>
```

##### ◖Matrix

The styles are displayed in a table. The rows and columns are defined in the tag body along with optional legend images:

```xml
<tz-display-styles>
  <styleNames>padding, margin</styleNames>
  <legendImages>./img/outermost.png, ./img/middleGrid.png, ./img/innerBox.png</legendImages>
 <elementIds>outermost, middleGrid, innerBox</elementIds>
</tz-display-styles>
```

**[⬆ back to top](#readme)**

### ▸ Bullet Point tag

The `<lk-bullet-point>` tag behaves like a single list item - it renders a status icon on the left followed by an HTML block on the right:

```xml
<lk-bullet-point iconClass="success">
  This experiment successfully shows that...
</lk-bullet-point>
```

Tag attributes:

* **iconClass** - Class name used to style the element used as a placeholder for the icon. The following icons are predefined (see css/lkBulletPoint.css):
  * lk-bullet-point-pass
  * lk-bullet-point-fail
  * lk-bullet-point-star
  * lk-bullet-point-info
* **leftColumnWidth** - Optional width of the left column.
* **style** - Optional style for the wrapper div.


**[⬆ back to top](#readme)**

### ▸ Ancestor Styles tag

The `<lk-ancestor-styles>` tag renders a set of styles for all ancestors of a given element.
The ancestor styles are displayed in a table. The startElementId attribute specifies where to the start the traversal.
The styleNames tag specifies the list of styles to be rendered in the table.

```xml
<lk-ancestor-styles title="Genealogy of innermost" startElementId="innermost">
  <comment>A comment rendered beneath the Ancestors header</comment>
  <styleNames>position, display</styleNames>
</lk-ancestor-styles>
```

**[⬆ back to top](#readme)**

### ▸ Navigation Bar tag

The `<lk-navigation-bar>` tag renders navigation links (e.g., "Back to Index", "Back to Table of Contents", etc).
The tag can be configured globally, via an init function, or individually via attributes read from the lk-navigation-bar element:

Globally:

```javascript
lkNavigationBarTag.setGlobalLinks({"⬅ Back to Index":"./index.html", "⬆ Back to Table of Contents":"#tableOfContents"});
```

Locally:

```xml
<lk-navigation-bar links='{"⬅ Back to Index":"./index.html", "⬆ Back to Table of Contents":"#tableOfContents"}'>
</lk-navigation-bar>
```

**[⬆ back to top](#readme)**

## Building a Release

### Setup

The project's build process uses Node.js and Grunt.
If you don't have Grunt, you can follow the [Getting Started](http://gruntjs.com/getting-started) guide.
Next, just do an `npm install` which will install Grunt locally as well as all of the project dependencies:

```bash
npm install
```

### Default Build

The default build cleans the target directory and generates the current release.

```bash
grunt
```

**[⬆ back to top](#readme)**

## License

Copyright 2014 George Norman

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this software except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

**[⬆ back to top](#readme)**
