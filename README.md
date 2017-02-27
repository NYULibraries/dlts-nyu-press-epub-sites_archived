NYU Press EPUB Sites
====================

Main repo for the building and testing of NYU Press websites:

* [Connected Youth](http://connectedyouth.nyupress.org/)
* [Open Access Books](http://openaccessbooks.nyupress.org/)

This repo replaces the original, individual repos:

* [dlts-connected-youth](https://github.com/NYULibraries/dlts-connected-youth)
* [dlts-open-access-books](https://github.com/NYULibraries/dlts-open-access-books)

This is just a working, in-process repo until we decide whether we want to migrate
this to a generalized static site generation system.

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

Sample `local.json`:

```json
{
  "appName": "New York University Press",

  "collectionCode": "oa-books",

  "appUrl": "http://openaccessbooks-local",
  "appRoot": "",

  "discovery": "http://dev-discovery.dlib.nyu.edu:8080/solr3_discovery/nyupress",

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
