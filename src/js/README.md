# LabKit JS

LabKit JS is a JavaScript library for building experiments with CSS, HTML and JavaScript (a DSL for HTML5 experiments).
An experiment consists of one or more code examples.
Each code example is rendered with syntax highlighting and line numbers.
Additionally, the code is injected into the DOM, for a live rendering of the experiment.
These two features keep the displayed code in sync with the executing code.

The core functionality is provided by a set of tags that can be added to any HTML page.
For example, the `<lk-css-example>` and `<lk-html-example>` tags render example CSS and HTML, with syntax highlighting and raw code injection.
To help organize the experiments, the `<lk-table-of-contents>` tag can be used to automatically generate a Table of Contents.

**LabKit Base Modules:**

* [`baseKitModule`](module-baseKitModule.html): LabKit initialization module (e.g., causes all tags to be rendered).
* [`lkResultLoggerModule`](module-lkResultLoggerModule.html): A simple message logger that caches items to a list, for future retrieval
  (e.g., an experiment using the eval tag can use this to log results that will be rendered to the DOM).

**LabKit Tags:**

*Navigation:*

* [`lkTableOfContentsTag`](module-lkTableOfContentsTag.html): Auto-generates a simple two-level Table of Contents.
* [`lkBulletPointTag`](module-lkBulletPointTag.html): Renders a status icon on the left followed by an HTML block on the right.
* [`lkApiReferenceTag`](module-lkApiReferenceTag.html): Renders a simple panel for displaying a link to the API reference documentation, plus a summary of key interfaces.
* [`lkNavigationBarTag`](module-lkNavigationBarTag.html): Renders a navigation bar, typically configured with the following links: "Back to Index" and "Back to Table of Contents".

*Code blocks and examples:*

* [`lkCssExampleTag`](module-lkCssExampleTag.html): Renders a syntax-highlighted CSS code example and then injects the raw code into the DOM so the browser will render the example live.
* [`lkHtmlExampleTag`](module-lkHtmlExampleTag.html): Renders a syntax-highlighted HTML code example and then injects the raw code into the DOM so the browser will render the example live.
* [`lkJsExampleTag`](module-lkJsExampleTag.html): Renders example code with syntax highlighting and then executes it (using eval). Output can be logged to a results panel.

*Supplemental Info:*

* [`lkAncestorStylesTag`](module-lkAncestorStylesTag.html): Renders a set of styles, for all ancestors of a given element.
* [`lkDisplayStylesTag`](module-lkDisplayStylesTag.html): Renders the style name and value, for a specified set of elements (used to display styles that can affect the outcome of an experiment).

**Common Modules (tz-commons):**

* [`tzDomHelperModule`](module-tzDomHelperModule.html): Provides helper methods for DOM manipulation and node retrieval.
* [`tzGeneralUtilsModule`](module-tzGeneralUtilsModule.html): Provides general purpose helper functions.
* [`tzCustomTagHelperModule`](module-tzCustomTagHelperModule.html): Provides helper methods for custom tags.
* [`tzLogHelperModule`](module-tzLogHelperModule.html): Formats strings, for use in a console log.
* [`tzCodeHighlighterModule`](module-tzCodeHighlighterModule.html): A crude (hack), SINGLE-LINE code highlighter, that only highlights basic code elements.

<hr style="border:0; border-bottom: 1px dashed #ccc; background: #eee;">

⬅ [Back To LabKit JS on GitHub](https://github.com/georgenorman/lab-kit-js#readme)
