#!/usr/bin/env bash

ROOT=$(cd "$(dirname "$0")" ; cd ..; pwd -P )

function testBuild() {
    local site=$1

    config_file=test/${site}/conf.json
    build_got=$ROOT/build/
    build_expected=$ROOT/test/${site}/expected-build/

    cd $ROOT

    grunt --config-file=$config_file $site 1>/dev/null

    diffCmd="diff -r $build_got $build_expected"

    eval "$diffCmd 1>/dev/null"

    if [ $? -eq 0 ]
    then
        echo "OK: build ${site}"
    else
        echo >&2 "FAIL: build ${site}"
        echo -e >&2 "\nTo see the differences, run:\n\n\t${diffCmd}\n"
    fi
}

testBuild $1

