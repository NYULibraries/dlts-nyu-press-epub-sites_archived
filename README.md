NYU Press EPUB Sites
====================

Main repo for the building and testing of NYU Press websites:

* [Connected Youth](http://connectedyouth.nyupress.org/)
* [Open Access Books](http://openaccessbooks.nyupress.org/)

This repo replaces the original, individual repos:

* [dlts-connected-youth](https://github.com/NYULibraries/dlts-connected-youth)
* [dlts-open-access-books](https://github.com/NYULibraries/dlts-open-access-books)

### Setup

```bash
git clone git@github.com:NYULibraries/dlts-nyu-press-epub-sites.git nyu-press-epub-sites`
npm install
cd source/connected-youth/json/
cp default.conf.json conf.json
# Edit conf.json
cd ../../open-access-books/json/
cp default.conf.json conf.json
# Edit conf.json
```

### Build

`grunt connected-youth`

`grunt open-access-books`

### Test

`test/test.sh`

...or...

Convenience wrapper for test/test.sh:

`grunt test`
