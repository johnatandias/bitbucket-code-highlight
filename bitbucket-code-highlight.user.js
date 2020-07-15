// ==UserScript==
// @name         Bitbucket code highlight
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add syntax highlight on bitbucket pull requests
// @author       Johnatan Dias
// @match        https://bitbucket.org/**/*
// @grant        none
// ==/UserScript==

/*global hljs: true */

(function () {
  'use strict';
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/styles/default.min.css';
  document.body.appendChild(style);

  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/highlight.min.js';
  document.body.appendChild(script);

  const highlightCode = () => {
    const notHighlightedCode = document.querySelectorAll(
      '.code-diff:not([data-highlighted="true"])'
    );

    if (!notHighlightedCode.length) return;

    const articleFilesElements = document.querySelectorAll(
      '[data-qa="pr-diff-file-styles"]'
    );

    if (!articleFilesElements.length) return;

    addEventListenerOnShowMoreButton();

    const handleExtensionName = extension => {
      const extensions = {
        jsx: 'js',
        json: 'js',
      }

      return extensions[extension] || extension;
    }

    for (let file of articleFilesElements) {
      const fileTitle = file.querySelector('[data-qa="bk-filepath"]')
        .firstChild
        .lastElementChild
        .innerText;

      const language = handleExtensionName(fileTitle.split('.').pop());

      const linesCode = file.querySelectorAll(
        '.code-diff:not([data-highlighted="true"])'
      );

      for (let codeElement of linesCode) {
        const code = codeElement.innerHTML;
        const highlighted = hljs.highlight(language, code);
        codeElement.innerHTML = highlighted.value;
        codeElement.dataset.highlighted = true;
      }
    }
  }

  const addEventListenerOnShowMoreButton = () => {
    const buttons = document.querySelectorAll(
      '[data-qa="pr-diff-show-more-lines"]:not([data-event-added="true"])'
    );

    for (let button of buttons) {
      button.addEventListener('click', highlightCode, false);
      button.dataset.eventAdded = true;
    }
  };

  window.addEventListener('scroll', highlightCode, false);
})();
