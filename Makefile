SHELL := /bin/bash -O extglob

build: $(wildcard ./src/*.js)
	mkdir -p ./build
	cat ./src/!(main).js ./src/main.js > ./build/main.js

run: build
	./run.sh

logs:
	journalctl -t kwin_x11 -g 'js:' -f
