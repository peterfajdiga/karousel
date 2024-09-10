#!/bin/bash
set -e
set -o pipefail

JS_FILE='./run-ts-tmp.js'

tsc -p "$1" --outFile "$JS_FILE"
node "$JS_FILE"
