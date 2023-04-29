SHELL := /bin/bash -O extglob
INSTALL_DIR := ~/.local/share/kwin/scripts/karousel

build:
	tsc --outFile ./package/contents/code/main.js

install: build
	mkdir -p ${INSTALL_DIR}
	rm -r ${INSTALL_DIR}/*
	cp -r ./package/* ${INSTALL_DIR}

run: build
	./run.sh

logs:
	journalctl -t kwin_x11 -g '^qml:|^file://.*karousel' -f
