.PHONY: *

config:
	mkdir -p ./package/contents/config
	tsc ./src/config/definition.ts ./configgen/kcfg.ts --outFile /dev/stdout | node - > ./package/contents/config/main.xml

build:
	tsc --outFile ./package/contents/code/main.js

install: build config
	kpackagetool5 --type=KWin/Script -i ./package || kpackagetool5 --type=KWin/Script -u ./package

logs:
	journalctl -t kwin_x11 -g '^qml:|^file://.*karousel' -f
