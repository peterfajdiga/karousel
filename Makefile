VERSION = $(shell grep '"Version":' ./package/metadata.json | grep -o '[0-9\.]*')
CHECKS := true

.PHONY: *

build: lint tests
	tsc -p ./src/main --outFile ./package/contents/code/main.js
	mkdir -p ./package/contents/config
	./run-ts.sh ./src/generators/config > ./package/contents/config/main.xml

npm-install:
	npm install

lint: npm-install
ifeq (${CHECKS}, true)
	npx eslint ./src
endif

lint-fix: npm-install
	npx eslint ./src --fix

tests:
ifeq (${CHECKS}, true)
	./run-ts.sh ./src/tests
endif

install: build
	kpackagetool6 --type=KWin/Script --install=./package || kpackagetool6 --type=KWin/Script --upgrade=./package

uninstall:
	kpackagetool6 --type=KWin/Script --remove=karousel

package: build
	tar -czf ./karousel_${subst .,_,${VERSION}}.tar.gz ./package --transform s/package/karousel/

docs-key-bindings-bbcode:
	@./run-ts.sh ./src/generators/docs/keyBindingsBbcode

docs-key-bindings-markdown:
	@./run-ts.sh ./src/generators/docs/keyBindingsMarkdown

docs-key-bindings-fmt:
	@./run-ts.sh ./src/generators/docs/keyBindingsFmt
