ESBUILD=node_modules/esbuild/bin/esbuild

CXX=clang

CXXFLAGS=--target=wasm32 \
         -ffreestanding \
         -nostdlib \
	 -fvisibility=hidden \
         -O3

LD=wasm-ld

LDFLAGS=--no-entry --export-dynamic

all: bundle.js main.wasm

bundle.js: main.ts *.ts
	$(ESBUILD) --bundle $< --outfile=$@ --sourcemap


main.wasm: math.cpp.o
	$(LD) $(LDFLAGS) $^ -o $@


%.cpp.o: %.cpp
	$(CXX) $(CXXFLAGS) -c -o $@ $<


clean:
	rm -f *.js *.js.map *.cpp.o *.wasm
