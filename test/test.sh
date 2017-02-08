#!/usr/bin/env bash

ROOT=$(cd "$(dirname "$0")" ; cd ..; pwd -P )

SITE=$1

CONFIG_FILE=test/${SITE}/conf.json

BUILD_GOT=$ROOT/build/
BUILD_EXPECTED=$ROOT/test/${SITE}/expected-build/

cd $ROOT

grunt --config-file=$CONFIG_FILE 1>/dev/null

diff -r $BUILD_GOT $BUILD_EXPECTED
