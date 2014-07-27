# LabKit JS

LabKit is a simple JavaScript library that helps build web pages with live CSS and HTML examples (a DSL for web experiments).
The main functionality is provided by a set of tags that can be added to any HTML page.
For example, the `<lk-css-html-example>` tag renders the given CSS and HTML code-examples and then inserts them into the document, for a live rendering of the example.
To help organize the experiments, the `<lk-table-of-contents>` tag can be used to automatically generate a Table of Contents for the page.

**LabKit Base Modules:**

* [`baseKitModule`](module-baseKitModule.html): Manages LabKit (e.g., causes all tags to be rendered).

**LabKit Tags:**

* [`lkAncestorStylesTag`](module-lkAncestorStylesTag.html): Renders a requested set of styles, for all ancestors of a given element.
* [`lkBackToTag`](module-lkBackToTag.html): Renders a navigation bar, with the following links: "Back to Index" and "Back to Table of Contents".
* [`lkBulletPointTag`](module-lkBulletPointTag.html): Behaves like a single list item - it renders a status icon on the left followed by an HTML block on the right.
* [`lkCodeExampleTag`](module-lkCodeExampleTag.html): Renders the specified code with syntax highlighting and line numbers.
* [`lkCssBlockTag`](module-lkCssBlockTag.html): Extracts the raw CSS, from a given template, and injects it live into the DOM, so that the styles may be applied to the current document.
* [`lkCssHtmlExampleTag`](module-lkCssHtmlExampleTag.html): Renders syntax-highlighted CSS and HTML code examples and then injects them into the DOM so the browser will render the examples live.
* [`lkDisplayStylesTag`](module-lkDisplayStylesTag.html): Renders the name and value of one or more styles from a specified set of elements (used to display styles that can affect the outcome of an experiment).
* [`lkHtmlBlockTag`](module-lkHtmlBlockTag.html): Injects the specified code, into the DOM, so that the HTML is rendered live by the current document.
* [`lkTableOfContentsTag`](module-lkTableOfContentsTag.html): Auto-generates a simple two-level Table of Contents.

**Common Modules (tz-commons):**

* [`tzCodeHighlighterModule`](module-tzCodeHighlighterModule.html): A crude (hack), SINGLE-LINE code highlighter, that only highlights basic code elements.
* [`tzCustomTagHelperModule`](module-tzCustomTagHelperModule.html): Provides helper methods for custom tags.
* [`tzDomHelperModule`](module-tzDomHelperModule.html): Provides helper methods for DOM manipulation and node retrieval.
* [`tzLogHelperModule`](module-tzLogHelperModule.html): Formats strings, for use in a console log.

<hr style="border:0; border-bottom: 1px dashed #ccc; background: #eee;">

⬅ [Back To LabKit JS on GitHub](https://github.com/georgenorman/lab-kit-js#readme)
