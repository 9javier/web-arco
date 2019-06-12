pushd %~dp0\..\..
call ionic cordova plugin remove com.mirasense.scanditsdk.plugin
call ionic cordova plugin add scandit\
copy /Y libs\services\src\environments\environment.prod.ts libs\services\src\environments\environment.ts
call ionic cordova run android --device --project al
copy /Y libs\services\src\environments\environment.ts libs\services\src\environments\environment.prod.ts
git checkout libs\services\src\environments\environment.ts
popd
