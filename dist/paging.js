/**
 * Paging.JS
 * @author Lionear <hello@lioneargaming.com>
 * @version 1.0.0
 */
 'use strict';

 class Paging
 {
     setup;
     currentPage;
     constructor(init) {
         let _setup = {
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
             callback: e => {},
         };
 
         this.currentPage = 1;
         this.maxPages = -1;
         this.totalResults = -1;
 
         this.setup = Object.assign(_setup, init ?? {});
         
         if(this.setup.hashPaging)
         {
             if(window.location.hash.includes(`/page/`))
             {
                 let pageNo = parseInt(window.location.hash.replace(`#/page/`, ''));
                 if(!isNaN(pageNo))
                 {
                     this.currentPage = pageNo;
                 }
             }
         }
 
         if(this.setup.element == null)
         {
             throw ('Pager element not set');
         }
 
         if(this.setup.totalNumber == null)
         {
             throw (`the totalNumber should be setup`);
         }
 
         if(this.setup.url == null)
         {
             throw (`The datasource (url) should be defined.`);
         }
         
         if(!this.stateful()) {
             this.getPage(this.currentPage);
         }
     }
 
     setupPager()
     {
         let element = null;
 
         if('string' === typeof this.setup.element)
         {
             element = document.getElementById(this.setup.element);
         }
 
         if(!(element !== null && element !== 'undefined'))
         {
             throw `Paging element couldn't be found!`;
         }
 
         let startPage = (this.currentPage >= 5 && this.maxPages > 7) ? (this.currentPage -2) : 1;
         let toPage = (this.maxPages < 7) ? this.maxPages : startPage + 4;
         if(toPage > this.maxPages)
         {
             toPage = this.maxPages;
         }
         
         
         let prevDisabled = (this.currentPage === 1);
         let nextDisabled = (this.currentPage === this.maxPages);
 
         let pageElements = [];
         pageElements.push(`<li class="paging-js-page paging-js-prev${(prevDisabled ? ` disabled` : ``)}" ${(!prevDisabled ? `data-num="${(this.currentPage - 1)}"` : ``)}><a${(!prevDisabled ? ` href` : ``)}>${this.setup.texts.prev}</a></li>`);
         
         if(startPage !== 1)
         {
             pageElements.push(`<li class="paging-js-page" data-num="1"><a href>1</a></li>`);
             pageElements.push(`<li class="paging-js-ellipsis disabled"><a>${this.setup.texts.ellipsis}</a></li>`);
         }
         
         for(let i = startPage; i <= toPage; i++)
         {
             pageElements.push(`<li class="paging-js-page${(this.currentPage === i ? ` active` : ``)}" ${(this.currentPage !== i ? `data-num="${i}"` : ``)}><a${(this.currentPage !== i ? ` href` : ``)}>${i}</a></li>`);
         }
 
         if(toPage !== this.maxPages && this.maxPages !== 6)
         {
             pageElements.push(`<li class="paging-js-ellipsis disabled"><a>${this.setup.texts.ellipsis}</a></li>`);
             pageElements.push(`<li class="paging-js-page" data-num="${this.maxPages}"><a href>${this.maxPages}</a></li>`);
         }
 
         pageElements.push(`<li class="paging-js-page paging-js-next${(nextDisabled ? ` disabled` : ``)}" ${(!nextDisabled ? `data-num="${(this.currentPage + 1)}"` : ``)}><a${(!nextDisabled ? ` href` : ``)}>${this.setup.texts.next}</a></li>`);
 
 
         element.innerHTML = `<div class="paging-js"><ul class="paging-js-pages">${pageElements.join('')}</ul></div>`;
 
         let els = document.getElementsByClassName(`paging-js-page`);
         let _this = this;
         for(let i = 0; i < els.length; i++)
         {
             els[i].addEventListener('click', function (event) {
                 event.preventDefault();
                 if(_this.setup.hashPaging)
                 {
                     window.location.hash = `/page/${this.dataset.num}`;    
                 }
                 _this.getPage(parseInt(this.dataset.num));
             });
         }
     }
     
     getPage(page)
     {
         this.currentPage = page;
         fetch(`${this.setup.url}${(this.setup.url.includes('?') ? '&' : '?' )}pageSize=${this.setup.pageSize}&pageNumber=${page}`)
             .then(r => r.json())
             .then(r => this.parseData(r));
     }
     
     parseData(r)
     {
         if('string' === typeof this.setup.totalNumber)
         {
             this.totalResults = r[this.setup.totalNumber];
         } else if('function' === typeof this.setup.totalNumber)
         {
             this.totalResults = this.setup.totalNumber(r);
         }
 
         if(this.totalResults > 0)
         {
             this.maxPages = Math.ceil(this.totalResults / this.setup.pageSize);
         }
 
         // The best way is to return the locator
         if(this.setup.locator != null)
         {
             this.setup.callback(r[this.setup.locator]);
         } else {
             this.setup.callback(r);
         }
 
         this.setupPager();
 
         // Stateful settings
         if(this.setup.stateful.enabled)
         {
             const storage = (this.setup.stateful.storage === 'session') ? sessionStorage : localStorage;
             storage.setItem(`${encodeURI(window.location.href.replace(location.hash, ''))}_${this.setup.url}_${this.setup.element}`, JSON.stringify({
                 page: this.currentPage,
                 data: r
             }));
         }
     }
     
     stateful()
     {
         // If stateful is disabled return false, this to trigger the system to act normally
         if(!this.setup.stateful.enabled)
         {
             return false;
         }
 
         const storage = (this.setup.stateful.storage === 'session') ? sessionStorage : localStorage;
         const storageData = storage.getItem(`${encodeURI(window.location.href.replace(location.hash, ''))}_${this.setup.url}_${this.setup.element}`);
         if(storageData == null)
             return false;
         
         const results = JSON.parse(storageData);
         
         if(this.setup.hashPaging && this.currentPage !== results.page && window.location.hash.includes('/page/'))
         {
             return false;
         }
         
         this.currentPage = results.page;
         
         // If the current page is 1 make sure to reload, just to avoid issues
         if(this.currentPage == 1)
         {
             return false;
         }
         
         if(!this.setup.stateful.reload)
         {
             this.parseData(results.data);
         } else {
             this.reload();
         }
         
         return true;
     }
     
     reload(fullReload)
     {
         fullReload = !!fullReload;
         if(fullReload)
         {
             this.getPage(1);
         } else {
             this.getPage(this.currentPage);
         }
     }
 }