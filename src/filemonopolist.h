#include <node_api.h>
#include <Windows.h>

class FileMonopolist {
 public:
  static napi_value Init(napi_env env, napi_value exports);
  static void Destructor(napi_env env, void* nativeObject, void* finalize_hint);

 private:
  explicit FileMonopolist(char* filePath);
  ~FileMonopolist();

  static napi_ref constructor;

  static napi_value New(napi_env env, napi_callback_info info);
  static napi_value Monopolize(napi_env env, napi_callback_info info);
  static napi_value Dispose(napi_env env, napi_callback_info info);
  static napi_value GetFilePath(napi_env env, napi_callback_info info);
  static napi_value GetMonopolized(napi_env env, napi_callback_info info);

  bool isMonopolized_;
  char* filePath_;
  HANDLE hFile_;
  napi_env env_;
  napi_ref wrapper_;
};

void GetThis(napi_env env, napi_callback_info info, void** self);
void GetStringUtf8(napi_env env, napi_value value, char** str);
