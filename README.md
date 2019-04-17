NYU Press EPUB Sites - ARCHIVED
===============================

---

This is an archive of the application that generated the old
[Open Access Books](http://openaccessbooks.nyupress.org/) and
[Connected Youth](http://connectedyouth.nyupress.org/) websites.  It is no longer in use
but it contains archived development branches that we might want to refer to later.
The Open Access Books website was replaced by [Open Square](http://opensquare.nyupress.org/).
The Connected Youth website is being maintained with just home and about pages, with
most of the content moved to [Open Square](http://opensquare.nyupress.org/).

This repo is superseded by [opensquare-nyudlts](https://github.com/nyudlts/opensquare-nyudlts),
which builds the [Open Square](http://opensquare.nyupress.org/) website as well as the new
Connected Youth website.

For details, see:

* [NYUP-144](https://jira.nyu.edu/browse/NYUP-144)
* [NYUP-605](https://jira.nyu.edu/jira/browse/NYUP-605)

---

Main repo for the building and testing of NYU Press websites:

* [Connected Youth](http://connectedyouth.nyupress.org/)
* [Open Access Books](http://openaccessbooks.nyupress.org/)

This repo replaces the original, individual repos:

* [dlts-connected-youth](https://github.com/NYULibraries/dlts-connected-youth)
* [dlts-open-access-books](https://github.com/NYULibraries/dlts-open-access-books)

This is just a temporary, in-process repo for consolidating existing builders, to be used until we decide whether we
want to migrate this to a generalized static site generation system.

### Setup

```bash
git clone git@github.com:NYULibraries/dlts-nyu-press-epub-sites.git nyu-press-epub-sites
npm install

# Create local conf files for local builds.  These local.json files are ignored
# by git.
cd source/connected-youth/json/conf/
cp dev.json local.json
# Edit local.json
cd ../../../open-access-books/json/conf/
cp dev.json local.json
# Edit local.json
```

#### Sample `local.json` files

Assuming:

* Built instances will be served from ```http://localhost/[SITE]```
* ReadiumJS viewer `cloud-reader` is being used and is accessed at ```http://localhost/readium-js-viewer/dist/cloud-reader```.
 (Note: do not include "/cloud-reader" in the ```readiumUrl``` value)
* Metadata is from the prod Solr index

source/connected-youth/json/conf/local.json:

```json
{
  "appName": "New York University Press",

  "collectionCode": "connected-youth",

  "appUrl": "http://localhost/connected-youth",
  "appRoot": "",

  "discovery": "http://discovery.dlib.nyu.edu:8080/solr3_discovery/nyupress",

  "readiumUrl" : "http://localhost/readium-js-viewer/dist",

  "EnableGoogleAnalytics": false,
  "GoogleAnalyticsUA" : "[DISABLED]",
  "GoogleAnalyticsDomain" : "[DISABLED]"
}
```

source/open-access-books/json/conf/local.json:

```json
{
  "appName": "New York University Press",

  "collectionCode": "oa-books",

  "appUrl": "http://localhost/open-access-books",
  "appRoot": "",

  "discovery": "http://discovery.dlib.nyu.edu:8080/solr3_discovery/nyupress",

  "readiumUrl" : "http://localhost/readium-js-viewer/dist",

  "EnableGoogleAnalytics": false,
  "GoogleAnalyticsUA" : "[DISABLED]",
  "GoogleAnalyticsDomain" : "[DISABLED]"
}
```

### Build

#### Local builds using git-ignored local.conf file

* `grunt connected-youth:local`
* `grunt open-access-books:local`

#### Builds for dev, stage, and prod servers using dev.json, stage.json, and prod.json conf files

* `grunt connected-youth:dev`
* `grunt connected-youth:stage`
* `grunt connected-youth:prod`
* `grunt open-access-books:dev`
* `grunt open-access-books:stage`
* `grunt open-access-books:prod`

#### Builds using test environment in test.json conf files

* `grunt connected-youth:test`
* `grunt open-access-books:test`

Note that test builds ignore the `discovery` URL in `test.json`, instead using
`test/lib/solr-stub/` to dependency inject a `request` function that returns
canned Solr responses based on request URL.

### Test

`test/test.sh`

...or...

Convenience wrapper for test/test.sh:

`grunt test`
