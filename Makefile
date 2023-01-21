SHELL := /bin/bash -O extglob

build:
	tsc --outFile ./basalt/contents/code/main.js

install: build
	cp -r ./basalt ~/.local/share/kwin/scripts/basalt

run: build
	./run.sh

logs:
	journalctl -t kwin_x11 -g '^qml:|^file://.*basalt' -f
