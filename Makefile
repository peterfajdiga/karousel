SHELL := /bin/bash -O extglob

build: $(wildcard ./src/*)
	mkdir -p ./build
	cat ./src/!(main).js ./src/main.js > ./build/main.js
	cp ./src/main.qml ./build/main.qml

run: build
	./run.sh

logs:
	journalctl -t kwin_x11 -g 'qml:' -f
