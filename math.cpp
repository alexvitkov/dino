
#define EXPORT(name) __attribute__((export_name(name)))
#define IMPORT(name) __attribute__((import_name(name)))
#define EXPORT_VAR __attribute__((visibility("default")))


IMPORT("alert") void alert(int n);

EXPORT("mat4_identity") void mat4_identity(float* mat) {
  mat[0] = 1;
  mat[1] = 0;
  mat[2] = 0;
  mat[3] = 0;

  mat[4] = 0;
  mat[5] = 1;
  mat[6] = 0;
  mat[7] = 0;

  mat[8] = 0;
  mat[9] = 0;
  mat[10] = 1;
  mat[11] = 0;

  mat[12] = 0;
  mat[13] = 0;
  mat[14] = 0;
  mat[15] = 1;
}

EXPORT("mat4_translate") void mat4_translate(float* mat, float* vec) {
  mat[12] += vec[0];
  mat[13] += vec[1];
  mat[14] += vec[2];
}

float the_matrix[16];
