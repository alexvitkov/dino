ESBUILD=node_modules/esbuild/bin/esbuild
TSC=node_modules/typescript/bin/tsc

bundle.js: main.ts *.ts
	$(ESBUILD) --bundle $< --outfile=$@ --sourcemap

clean:
	rm -f *.js *.js.map *.wasm

tsc: main.ts *.ts
	$(TSC) --noEmit
