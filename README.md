# Lab Kit

Lab Kit is a simple JavaScript library that helps build web pages with live CSS and HTML examples.
The main functionality is provided by a set of tags that can be added to any HTML page.
For example, the &lt;lkCssHtmlExample&gt; tag renders the given CSS and HTML code-examples and then inserts them into the document, for a live rendering of the example.
To help organize the experiments, the &lt;lkTableOfContents&gt; tag can be used to automatically generate a Table of Contents for the page.

## Demo

[CSS Lab demo](http://www.thruzero.com/pages/jcat3/css-lab/index.html).

## Features

### Css and Html Example tag

The &lt;lkCssHtmlExample&gt; tag renders the CSS style, CSS style code-example, HTML code-example and then the live HTML, for the result, using the code templates identified by the cssTemplateId and htmlTemplateId attributes.
The tag attributes are read from the lkCssHtmlExample element, as shown in the examples below:

```html
<lkCssHtmlExample cssTemplateId="basicBoxModelCss" htmlTemplateId="basicBoxModelHtml"></lkCssHtmlExample>
<lkCssHtmlExample htmlTemplateId="tmplExampleRelInStaticNoMarginHtml"></lkCssHtmlExample>
```

Tag attributes:

* cssTemplateId - ID of the element containing the CSS code to insert.
* htmlTemplateId - ID of the element containing the HTML code to insert.
* templateId - optional; use this instead of cssTemplateId and htmlTemplateId to simplify the code. "Css" and "Html" will be appended to the given templateId, to form the IDs to the CSS and HTML templates.

Example:

```html
<script type="multiline-template" id="simpleTemplateCss">
  .foo {color: red;}
</script>

<script type="multiline-template" id="simpleTemplateHtml">
  <span class="foo">This is red</span>
</script>

<lkCssHtmlExample templateId="simpleTemplate" width="750px">
  <cssComment>A comment rendered beneath the CSS header.</cssComment>
  <htmlComment>A comment rendered beneath the HTML header.</htmlComment>
  <resultComment>A comment rendered beneath the Result header.</resultComment>
</lkCssHtmlExample>
```

### Css Block tag

The &lt;lkCssBlock&gt; tag renders a &lt;style&gt; block, with the text extracted from the element with the specified templateId.

The tag attributes are read from the lkCssBlock element, as shown in the example below:

```html
<lkCssBlock templateId="basicBoxModelCss"></lkCssBlock>
```

Tag attributes:

* templateId - ID of the element containing the CSS code to insert.

### Html Block tag

The <lkHtmlBlock> tag renders a heading, followed by a <code> block with the XML escaped text from the element of the given templateId.

The tag attributes are read from the lkCodeExample element, as shown in the example below:

```html
<lkHtmlBlock templateId="basicBoxModelHtml" heading="Rendered Result">
  <comment>Optional Comment</comment>
</lkHtmlBlock>
```

Tag attributes:

* templateId - ID of the element containing the raw HTML code to render.
* heading - heading text [optional]

### Code Example tag

The &lt;lkCodeExample&gt; tag renders an optional heading and comment, followed by a &lt;code&gt; block with the XML escaped text extracted from the element with the specified templateId.
The tag attributes are read from the lkCodeExample element, as shown in the examples below:

```html
<lkCodeExample templateId="lkCodeExampleHtmlTemplate" heading="HTML" lang="*ml" width="350px">
  <comment>HTML lkCodeExample comment.</comment>
</lkCodeExample>
```

```html
<lkCodeExample templateId="lkCodeExampleCssTemplate" heading="CSS" lang="css" width="300px">
  <comment>CSS lkCodeExample comment.</comment>
</lkCodeExample>
```

Tag attributes:

* templateId - ID of the element containing the HTML or JavaScript code to render.
* heading - heading text (optional)
* lang - language ID for the code syntax highlighter (e.g., "css", "*ml").
* width - optional width (hack) to force the zebra stripes to fill the entire code area when scrolling is required.

### Table Of Contents tag

The &lt;lkTableOfContents&gt; tag auto-generates a simple two-level Table of Contents.

```html
<lkTableOfContents class="toc" level1ItemsTagName="h2" level2ItemsTagName="h3"></lkTableOfContents>
```

Limitations:

1. There can be only one Table of Contents section per page.
2. Maximum levels is two.

Tag attributes:

* class - the CSS class to apply to the rendered Table of Contents
* level1ItemsTagName - tag name used to identify the level-1 headers to be included in the Table of Contents (e.g., "h2" would cause all h2 elements on the page, to be used as items in the generated Table of Contents).
* level2ItemsTagName - tag name used to identify the level-2 headers to be included under each level-1 header (e.g., "h3" would cause all h3 elements on the page, to be used as sub-items in the generated Table of Contents).
* title - optional title (default is "Table of Contents").

### Display Styles tag

The &lt;lkDisplayStyles&gt; tag renders the values of a set of specified styles for a set of specified elements.
It has several forms, each of which are described below:

##### Compact unordered list

The style name is the same for each item in the list. The list items are defined in the tag body.

```html
<lkDisplayStyles styleName="position">outermost, middleGrid, innerBox</lkDisplayStyles>
```

##### Verbose unordered list

The style name is unique for each item in the list. The list items are defined in the tag body

```html
<lkDisplayStyles>
  { "outerMost": "position", "middleGrid": "margin", "innerMost": "padding" }
</lkDisplayStyles>
```

##### Matrix

The styles are displayed in a table. The rows and columns are defined in the tag body.

```html
<lkDisplayStyles>
  <styleNames>padding, margin</styleNames>
  <legendImages>./img/outermost.png, ./img/middleGrid.png, ./img/innerBox.png</legendImages>
 <elementIds>outermost, middleGrid, innerBox</elementIds>
</lkDisplayStyles>
```

### Bullet Point tag

The &lt;lkBulletPoint&gt; tag behaves like a single list item - it renders a status icon on the left followed by an HTML block on the right.

```html
<lkBulletPoint iconClass="success">This experiment successfully shows that...</lkBulletPoint>
```

Tag attributes:

* iconClass - class name used to style the <i> element used as a placeholder for the icon. The following icons are predefined: "lk-bullet-point-pass", "lk-bullet-point-fail" (see css/lkBulletPoint.css).
* leftColumnWidth - optional width of the left column.
* style - optional style for the wrapper div.


### Ancestor Styles tag

The &lt;lkAncestorStyles&gt; tag renders a set of styles for all ancestors of a given element.
The ancestor styles are displayed in a table. The startElementId attribute specifies where to the start the traversal.
The styleNames tag specifies the list of styles to be rendered in the table.

```html
<lkAncestorStyles title="Genealogy of innermost" startElementId="innermost">
  <comment>A comment rendered beneath the Ancestors header</comment>
  <styleNames>position, display</styleNames>
</lkAncestorStyles>
```

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
