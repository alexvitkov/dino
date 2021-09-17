ESBUILD=node_modules/esbuild/bin/esbuild

bundle.js: main.ts *.ts
	$(ESBUILD) --bundle $< --outfile=$@ --sourcemap

clean:
	rm -f *.js *.js.map *.wasm
