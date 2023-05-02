.PHONY: *

INSTALL_DIR := ~/.local/share/kwin/scripts/karousel

config:
	mkdir -p ./package/contents/config
	tsc ./src/config/definition.ts ./configgen/kcfg.ts --outFile /dev/stdout | node - > ./package/contents/config/main.xml

build:
	tsc --outFile ./package/contents/code/main.js

install: build config
	mkdir -p ${INSTALL_DIR}
	rm -r ${INSTALL_DIR}/*
	cp -r ./package/* ${INSTALL_DIR}

run: build
	./run.sh

logs:
	journalctl -t kwin_x11 -g '^qml:|^file://.*karousel' -f
