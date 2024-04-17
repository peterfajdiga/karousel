#!/bin/bash
tsc -p "$1" --outFile /dev/stdout | node -
