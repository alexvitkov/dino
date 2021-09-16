
#define EXPORT(name) __attribute__((export_name(name)))
#define IMPORT(name) __attribute__((import_name(name)))
#define EXPORT_VAR __attribute__((visibility("default")))


IMPORT("alert") void alert(int n);
