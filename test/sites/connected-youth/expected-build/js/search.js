YUI().use(
    'node'
  , 'event'
  , 'io'
  , 'node-scroll-info'
  , 'handlebars'
  , 'json-parse'
  , 'jsonp'
  , 'jsonp-url'
  , 'gallery-idletimer'
  , 'querystring-parse'
  , 'dlts-util'
  , function ( Y ) {

    'use strict';

    // See https://jira.nyu.edu/jira/browse/NYUP-290:
    // "Open Access Books site -- lazy loading not loading in Chrome 61"
    //
    // We are going to remove infinite scrolling completely.  This is just a quick
    // emergency hack to fix the current Chrome problem.
    const DEFAULT_DOCSLENGTH = 1999;

    var body = Y.one('body')
      , container = Y.one('.library-items')
      , docslength = container.getAttribute("data-docslength") ? parseInt(container.getAttribute("data-docslength"), 10) : DEFAULT_DOCSLENGTH
      , query = Y.one('.query')
      , loadMoreButton = Y.one('.pure-button.loading')
      , totalFound = Y.one('.total-found')
      , itemsFoundText = Y.one('.items-found')
      , collectionCode = body.getAttribute('data-collection-code')
      , datasourceURL = body.getAttribute('data-discovery')      +
                        '/select?'                               +

                        'fq=collection_code%3A' + collectionCode +

                        '&'                                      +
                        'wt=json'                                +
                        '&'                                      +
                        'json.wrf=callback={callback}'           +
                        '&'                                      +
                        'hl=true'                                +
                        '&'                                      +
                        'hl.fl=title,description,text'           +
                        '&'                                      +
                        'fl='                                    +
                            'title,'                             +
                            'subtitle,'                          +
                            'description,'                       +
                            'author,'                            +
                            'identifier,'                        +
                            'coverHref,'                         +
                            'thumbHref'                          +

                        '&'                                      +
                        'defType=edismax'                        +
                        '&'                                      +

                        // Can't use encodeURIComponent on the whole value because
                        // Solr apparently gets confused by the encoded "+" characters.
                        // For details, see:
                        // https://jira.nyu.edu/jira/browse/NYUP-276?focusedCommentId=86023&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-86023
                        'qf='                                   +
                            encodeURIComponent( 'title^2' )     +
                            '+'                                 +
                            encodeURIComponent( 'subtitle^2' )  +
                            '+'                                 +
                            encodeURIComponent( 'author^2' )    +
                            '+'                                 +
                            encodeURIComponent( 'coverage' )    +
                            '+'                                 +
                            encodeURIComponent( 'description' ) +
                            '+'                                 +
                            encodeURIComponent( 'publisher' )   +

                        '&'                                      +
                        'rows=' + docslength                     +
                        '&'                                      +
                        'q='
      , searchString = '*:*'
      , transactions = []
      , href, pager = Y.one('ul.pure-paginator')
      , fold = 200
      , match = location.pathname.match(/\/search\/(.*)/)
      , source = Y.one('#list-template').getHTML()
      , template = Y.Handlebars.compile(source)
      , queryParams = Y.QueryString.parse( document.location.search.slice( 1 ) );

    // Fix bug https://jira.nyu.edu/jira/browse/NYUP-214
    if ( queryParams.searchbox ) {
        document.location.href = queryParams.searchbox;
    }

    Y.Handlebars.registerHelper('truncate', Y.DltsUtil.truncate);
    if ( ! Y.DltsUtil.truncate_page_path ) {
        var body_data = body.getData()
            , root = body_data.app
            , page_path = root + '/details';

        Y.DltsUtil.truncate_page_path = page_path;
    }

    function onFailure() {}

    function onTimeout() {}

    function onClick(e) {
        e.preventDefault();
        onScroll();
    }

    function onPaginatorAvailable() {
        if (this.get('region').top - fold < body.get('winHeight')) {
        onScroll();
        }
    }

    function onScroll(e) {

        if (body.hasClass('io-done')) return;

        var numfound = parseInt(container.getAttribute("data-numfound"), 10),
        start = parseInt(container.getAttribute("data-start"), 10),
        docslength = parseInt(container.getAttribute("data-docslength"), 10);

        if (
        start + docslength <= numfound
        ) {

        href = datasourceURL + searchString + '&start=' + (start + docslength);

        if (Y.Array.indexOf(transactions, href) < 0 && !body.hasClass('io-loading')) {

            if (
            body.scrollInfo.getScrollInfo().atBottom ||
            (
                Y.IdleTimer.isIdle() && pager.get('region').top - fold < body.get('winHeight')
            )
            ) {

            body.addClass('io-loading');

            loadMoreButton.addClass('pure-button-disabled');

            Y.jsonp(href, {
                on: {
                success: onSuccess,
                failure: onFailure,
                timeout: onTimeout
                },
                timeout: 3000
            });

            }
        }

        }

    }

    function onSuccess(response) {
        try {

        var numfound = parseInt(response.response.numFound, 10),
            start = parseInt(response.response.start, 10),
            docslength = parseInt(response.response.docs.length, 10);

        // store response url to avoid making multiple request to the same source
        transactions.push(this.url);

        container.setAttribute("data-numFound", numfound);

        container.setAttribute("data-start", start);

        container.setAttribute("data-docsLength", docslength);

        // set the number of items found
        totalFound.set('text', numfound);
        // plural or singular book
        itemsFoundText.set('text', ((numfound == "1" ? 'book' : 'books')));
        // show the number of items found
        totalFound.removeClass('hidden');

        // highlighting object in Solr is not part of the document; find the document
        // and add the highlight slash
        Y.each(response.response.docs, function(item, index) {

            if (response.highlighting && response.highlighting[item.identifier].description) {
            response.response.docs[index].slash = response.highlighting[item.identifier].description[0];
            } else {
            response.response.docs[index].slash = response.response.docs[index].description;
            }

        });

        // render HTML and append to container
        container.append(
            template({
            items: response.response.docs
            })
        );


      if ( start + docslength === numfound ) {
            container.append ("<div class='library-item empty-div'>&nbsp;</div>") ;
            container.append ("<div class='library-item empty-div'>&nbsp;</div>") ;
            container.append ("<div class='library-item empty-div'>&nbsp;</div>") ;
            body.addClass('io-done') ;
      }

       

        body.removeClass('io-loading');

        loadMoreButton.removeClass('pure-button-disabled');

        } catch (e) {
        Y.log('error');
        }
    }

    Y.IdleTimer.subscribe('idle', onScroll);

    // be opportunistic
    Y.IdleTimer.start(5000);

    // Plug ScrollInfo 
    body.plug(Y.Plugin.ScrollInfo, { scrollMargin: fold });

    body.scrollInfo.on({ scroll: onScroll });

    // test for query string
    if (match && match[1]) {

        // query string found
        searchString = decodeURIComponent(match[1].toLowerCase());

        // update the title of the page
        query.set('text', searchString);
    } else {
        // update the title of the page
        query.set('text', 'All titles');
    }

    // make the first request
    Y.jsonp(datasourceURL + searchString, { on: { success: onSuccess, failure: onFailure, timeout: onTimeout }, timeout: 3000 } ) ;

    loadMoreButton.on('click', onClick);

    pager.on('available', onPaginatorAvailable);

} ) ;
