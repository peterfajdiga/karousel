SHELL := /bin/bash -O extglob

build:
	tsc --outFile ./karousel/contents/code/main.js

install: build
	cp -r ./karousel ~/.local/share/kwin/scripts

run: build
	./run.sh

logs:
	journalctl -t kwin_x11 -g '^qml:|^file://.*karousel' -f
