.PHONY: *

TSC_SCRIPT_FLAGS = --lib es2020 ./src/extern/qt.d.ts
VERSION = $(shell grep '"Version":' ./package/metadata.json | grep -o '[0-9\.]*')

config:
	mkdir -p ./package/contents/config
	tsc ${TSC_SCRIPT_FLAGS} ./src/config/definition.ts ./generators/config/kcfg.ts --outFile /dev/stdout | node - > ./package/contents/config/main.xml

build:
	tsc --outFile ./package/contents/code/main.js

install: build config
	kpackagetool6 --type=KWin/Script -i ./package || kpackagetool6 --type=KWin/Script -u ./package

uninstall:
	kpackagetool6 --type=KWin/Script -r karousel

package: build config
	tar -czf ./karousel_${subst .,_,${VERSION}}.tar.gz ./package

logs:
	journalctl -t kwin_x11 -g '^qml:|^file://.*karousel' -f

docs-key-bindings-bbcode:
	@tsc ${TSC_SCRIPT_FLAGS} ./src/keyBindings/definition.ts ./generators/docs/keyBindings.ts ./generators/docs/keyBindingsBbcode.ts --outFile /dev/stdout | node -

docs-key-bindings-table:
	@tsc ${TSC_SCRIPT_FLAGS} ./src/keyBindings/definition.ts ./generators/docs/keyBindings.ts ./generators/docs/keyBindingsTable.ts --outFile /dev/stdout | node -

docs-key-bindings-fmt:
	@tsc ${TSC_SCRIPT_FLAGS} ./src/keyBindings/definition.ts ./generators/docs/keyBindings.ts ./generators/docs/keyBindingsFmt.ts --outFile /dev/stdout | node -
