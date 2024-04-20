#!/bin/bash
tsc -p "$1" --outFile ./run-ts-tmp.js && node ./run-ts-tmp.js
rm ./run-ts-tmp.js
