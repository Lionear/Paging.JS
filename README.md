# Paging.JS

[![NPM version][npm-image]][npm-url]

> A ES2015+ class to provide a simple but powerfull pagination.

This library is written for use in [EVE Wreckbench](https://evewreckbench.com) to provide a powerfull but easy to use paging library without the need for jQuery or other JavaScript frameworks.

Can be used in stateless and stateful mode and has many options to configure it to your needs.

> I'm still writing the docs... :)

# Installation or download
`npm install paging.js` or download [paging.js (full)](dist/paging.js) - [paging.min.js (minified)](dist/paging.min.js) from this repository.

# Getting started

```html
<script src="dist/paging.min.js" />
```

```js
window.pagingHandler = new Paging({
    url: '/remote/data.json',
    locator: '',
    element: 'paging',
    totalNumber: 'searchCount',
    callback: results => {
        console.log(results);
    }
});
```

# Available constructor setup
```js
{
    url: null, // URL to the AJAX / XHR source
    element: null, // Can be a DOM element or element ID
    locator: null, // Element to search in
    totalNumber: null, // The element or function used to determine the page numbers
    pageSize: 20, // Results per page,
    hashPaging: false, // Enable hashpaging in the url (ex: /#/page/1 (default: false)
    stateful: {
        enabled: false, // Make the paging stateful or not (default: false)
        reload: false, // Reload the data based on the page where you are currently are (default: false),
        storage: 'session', // 'session' or 'local' (default: 'session')
    },
    texts: {
        prev: '&laquo;',
        next: '&raquo;',
        ellipsis: '...',
    },
    callback: e => {}, // The callback function for the results to be parsed
}
```

# License

Released under the MIT license. See [LICENSE](/LICENSE)