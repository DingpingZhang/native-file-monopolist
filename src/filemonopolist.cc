#include "filemonopolist.h"
#include <assert.h>

napi_ref FileMonopolist::constructor;

FileMonopolist::FileMonopolist(char* filePath)
	: isMonopolized_(false), filePath_(filePath), hFile_(nullptr), env_(nullptr), wrapper_(nullptr) {}

FileMonopolist::~FileMonopolist() {
	free(filePath_);
	filePath_ = nullptr;
	CloseHandle(hFile_);
	napi_delete_reference(env_, wrapper_);
}

void FileMonopolist::Destructor(napi_env env,
	void* nativeObject,
	void* /*finalize_hint*/) {
	reinterpret_cast<FileMonopolist*>(nativeObject)->~FileMonopolist();
}

#define DECLARE_NAPI_METHOD(name, func) { name, 0, func, 0, 0, 0, napi_default, 0 }

napi_value FileMonopolist::Init(napi_env env, napi_value exports) {
	napi_status status;

	napi_property_descriptor properties[] = {
		{ "filePath", 0, 0, GetFilePath, 0, 0, napi_default, 0 },
		{ "monopolized", 0, 0, GetMonopolized, 0, 0, napi_default, 0 },
		DECLARE_NAPI_METHOD("monopolize", Monopolize),
		DECLARE_NAPI_METHOD("dispose", Dispose),
	};

	napi_value cons;
	status = napi_define_class(env, "FileMonopolist", NAPI_AUTO_LENGTH, New, nullptr, 4, properties, &cons);
	assert(status == napi_ok);

	status = napi_create_reference(env, cons, 1, &constructor);
	assert(status == napi_ok);

	status = napi_set_named_property(env, exports, "FileMonopolist", cons);
	assert(status == napi_ok);

	return exports;
}

napi_value FileMonopolist::New(napi_env env, napi_callback_info info) {
	const int ARGS_COUNT = 1;
	napi_status status;

	napi_value target;
	status = napi_get_new_target(env, info, &target);
	assert(status == napi_ok);
	bool is_constructor = target != nullptr;

	if (is_constructor) {
		// Invoked as constructor: `new FileMonopolist(...)`
		size_t argc = ARGS_COUNT;
		napi_value args[ARGS_COUNT];
		napi_value jsthis;
		status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);
		assert(status == napi_ok);

		char* filePath;
		GetStringUtf8(env, args[0], &filePath);
		FileMonopolist* self = new FileMonopolist(filePath);

		self->env_ = env;
		status = napi_wrap(env,
			jsthis,
			reinterpret_cast<void*>(self),
			FileMonopolist::Destructor,
			nullptr,  // finalize_hint
			&self->wrapper_);
		assert(status == napi_ok);

		return jsthis;
	}
	else {
		// Invoked as plain function `FileMonopolist(...)`, turn into construct call.
		size_t argc = ARGS_COUNT;
		napi_value args[ARGS_COUNT];
		status = napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
		assert(status == napi_ok);

		napi_value argv[ARGS_COUNT] = { args[0] };

		napi_value ctor;
		status = napi_get_reference_value(env, constructor, &ctor);
		assert(status == napi_ok);

		napi_value instance;
		status = napi_new_instance(env, ctor, argc, argv, &instance);
		assert(status == napi_ok);

		return instance;
	}
}

napi_value FileMonopolist::Monopolize(napi_env env, napi_callback_info info) {
	napi_status status;

	FileMonopolist* self;
	GetThis(env, info, reinterpret_cast<void**>(&self));

	HANDLE hFile = CreateFile(self->filePath_, GENERIC_READ | GENERIC_WRITE, 0, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);

	napi_value result;
	if (hFile == INVALID_HANDLE_VALUE) {
		status = napi_create_int64(env, GetLastError(), &result);
		assert(status == napi_ok);
		return result;
	}

	self->hFile_ = hFile;
	self->isMonopolized_ = true;

	status = napi_create_int64(env, 0, &result);
	assert(status == napi_ok);
	return result;
}

napi_value FileMonopolist::Dispose(napi_env env, napi_callback_info info) {
	napi_status status;

	FileMonopolist* self;
	GetThis(env, info, reinterpret_cast<void**>(&self));

	BOOL success = CloseHandle(self->hFile_);
	if (success) {
		self->isMonopolized_ = false;
	}

	napi_value result;
	status = napi_create_int32(env, success, &result);
	assert(status == napi_ok);
	return result;
}

napi_value FileMonopolist::GetFilePath(napi_env env, napi_callback_info info)
{
	napi_status status;

	FileMonopolist* self;
	GetThis(env, info, reinterpret_cast<void**>(&self));

	napi_value result;
	status = napi_create_string_utf8(env, self->filePath_, strlen(self->filePath_), &result);
	assert(status == napi_ok);
	return result;
}

napi_value FileMonopolist::GetMonopolized(napi_env env, napi_callback_info info)
{
	napi_status status;

	FileMonopolist* self;
	GetThis(env, info, reinterpret_cast<void**>(&self));

	napi_value result;
	status = napi_create_int32(env, self->isMonopolized_, &result);
	assert(status == napi_ok);
	return result;
}

void GetThis(napi_env env, napi_callback_info info, void** self) {
	napi_status status;

	napi_value jsthis;
	status = napi_get_cb_info(env, info, nullptr, nullptr, &jsthis, nullptr);
	assert(status == napi_ok);

	status = napi_unwrap(env, jsthis, self);
	assert(status == napi_ok);
}

void GetStringUtf8(napi_env env, napi_value value, char** str) {
	napi_status status;

	size_t str_size;
	status = napi_get_value_string_utf8(env, value, nullptr, 0, &str_size);
	assert(status == napi_ok);
	str_size++;

	*str = (char*)calloc(str_size, sizeof(char));
	status = napi_get_value_string_utf8(env, value, *str, str_size, nullptr);
	assert(status == napi_ok);
}
