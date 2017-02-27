#!/usr/bin/env bash

ROOT=$(cd "$(dirname "$0")" ; cd ..; pwd -P )

test_result=0

function testBuild() {
    local site=$1

    config_file=test/sites/${site}/conf.json
    build_got=$ROOT/build/${site}
    build_expected=$ROOT/test/sites/${site}/expected-build/

    # Don't count on 'grunt clean' running successfully.
    rm -fr $build_got

    cd $ROOT

    grunt ${site}:test 1>/dev/null

    diffCmd="diff -r $build_got $build_expected"

    eval "$diffCmd 1>/dev/null"

    if [ $? -eq 0 ]
    then
        echo "OK: build ${site}"
    else
        test_result=1
        echo >&2 "FAIL: build ${site}"
        echo -e >&2 "\nTo see the differences, run:\n\n\t${diffCmd}\n"
    fi
}

testBuild 'open-access-books'
testBuild 'connected-youth'

# For 'grunt test'
exit $test_result