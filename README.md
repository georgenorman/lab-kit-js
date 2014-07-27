# LabKit JS

LabKit is a simple JavaScript library that helps build web pages with live CSS and HTML examples (a DSL for web experiments).
The main functionality is provided by a set of tags that can be added to any HTML page.
For example, the `<lk-css-html-example>` tag renders the given CSS and HTML code-examples and then inserts them into the document, for a live rendering of the example.
To help organize the experiments, the `<lk-table-of-contents>` tag can be used to automatically generate a Table of Contents for the page.

## Demo

[CSS Lab](http://www.thruzero.com/pages/jcat3/css-lab/index.html)

## Tags

### ‣ CSS and HTML Example tag

The `<lk-css-html-example>` tag renders the CSS and HTML code as examples, and then injects them into the DOM, so they will be rendered live.
The code examples use code templates, identified by the cssTemplateId and htmlTemplateId attributes.

The following example uses separate IDs for the CSS and HTML code templates:

```xml
<lk-css-html-example cssTemplateId="basicBoxModelCss" htmlTemplateId="basicBoxModelHtml">
</lk-css-html-example>
```

This example renders only the HTML portion (since the CSS ID is missing):

```xml
<lk-css-html-example htmlTemplateId="tmplExampleRelInStaticNoMarginHtml">
</lk-css-html-example>
```

Tag attributes:

* **cssTemplateId** - Optional ID of the element containing the CSS code to use as example code and live CSS.
* **htmlTemplateId** - Required ID of the element containing the HTML code to use as example code and live HTML.
* **templateId** - Optional form for defining the CSS and HTML template IDs. It combines the cssTemplateId and htmlTemplateId into a single templateId, where "Css" and "Html" are appended to the given templateId.

##### Complete Example:

◖CSS Template:

```xml
<script type="multiline-template" id="simpleTemplateCss">
  .foo {color: red;}
</script>
```

◖HTML Template:

```xml
<script type="multiline-template" id="simpleTemplateHtml">
  <span class="foo">This is red</span>
</script>
```

◖CSS and HTML Example plus live rendered Result (plus comments):

```xml
<lk-css-html-example templateId="simpleTemplate" width="750px">
  <cssComment>A comment rendered beneath the CSS header.</cssComment>
  <htmlComment>A comment rendered beneath the HTML header.</htmlComment>
  <resultComment>A comment rendered beneath the Result header.</resultComment>
</lk-css-html-example>
```

**[⬆ back to top](#readme)**

### ▸ CSS Block tag

The `<lk-css-block>` tag renders a &lt;style&gt; block, with the text extracted from the element with the specified templateId.

Example:

```xml
<lk-css-block templateId="basicBoxModelCss"></lk-css-block>
```

Tag attributes:

* **templateId** - ID of the element containing the CSS code to insert.

**[⬆ back to top](#readme)**

### ▸ HTML Block tag

The `<lk-html-block>` tag renders an optional heading and comment, followed by the raw text from the element of the given templateId.

Example:

```xml
<lk-html-block templateId="basicBoxModelHtml" heading="Rendered Result">
  <comment>Optional Comment</comment>
</lk-html-block>
```

Tag attributes:

* **templateId** - ID of the element containing the raw HTML code to render.
* **heading** - Optional heading text

**[⬆ back to top](#readme)**

### ▸ Code Example tag

The `<lk-code-example>` tag renders an optional heading and comment, followed by a &lt;code&gt; block with the XML escaped text extracted from the element with the specified templateId.
The code block used to render the example also uses a primitive syntax highlighter (which is a bit buggy).

CSS example:

```xml
<lk-code-example templateId="codeExampleCssTemplate" heading="CSS" lang="css" width="300px">
  <comment>CSS code example comment.</comment>
</lk-code-example>
```

HTML example:

```xml
<lk-code-example templateId="codeExampleHtmlTemplate" heading="HTML" lang="*ml" width="350px">
  <comment>HTML code example comment.</comment>
</lk-code-example>
```

Tag attributes:

* **templateId** - ID of the element containing the HTML code to render.
* **heading** - Optional heading (h4).
* **lang** - Language ID for the code syntax highlighter (e.g., "css", "*ml").
* **width** - Optional width (hack) to force the zebra stripes to fill the entire code area when scrolling is required.

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


### ▸ Back To tag

The `<lk-back-to>` tag renders back-to links (e.g., "Back to Index", "Back to Table of Contents", etc).
The tag can be configured globally, via an init function, or individually via attributes read from the lk-back-to element:

Globally:

```javascript
lkBackToTag.setGlobalLinks({"⬅ Back to Index":"./index.html", "⬆ Back to Table of Contents":"#tableOfContents"});
```

Locally:

```xml
<lk-back-to links='{"⬅ Back to Index":"./index.html", "⬆ Back to Table of Contents":"#tableOfContents"}'>
</lk-back-to>
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
