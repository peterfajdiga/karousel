.PHONY: *

VERSION = $(shell grep '"Version":' ./package/metadata.json | grep -o '[0-9\.]*')

config:
	mkdir -p ./package/contents/config
	./run-ts.sh ./src/generators/config > ./package/contents/config/main.xml

build:
	tsc -p ./src/main --outFile ./package/contents/code/main.js

tests:
	./run-ts.sh ./src/tests

install: build config
	kpackagetool6 --type=KWin/Script -i ./package || kpackagetool6 --type=KWin/Script -u ./package

uninstall:
	kpackagetool6 --type=KWin/Script -r karousel

package: build config
	tar -czf ./karousel_${subst .,_,${VERSION}}.tar.gz ./package

logs:
	journalctl -t kwin_x11 -g '^qml:|^file://.*karousel' -f

docs-key-bindings-bbcode:
	@./run-ts.sh ./src/generators/docs/keyBindingsBbcode

docs-key-bindings-table:
	@./run-ts.sh ./src/generators/docs/keyBindingsTable

docs-key-bindings-fmt:
	@./run-ts.sh ./src/generators/docs/keyBindingsFmt
