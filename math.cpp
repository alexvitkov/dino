
#define EXPORT(name) __attribute__((export_name(name)))
#define IMPORT(name) __attribute__((import_name(name)))


IMPORT("alert") void alert(int n);
