pushd %~dp0\..\..

call ionic cordova plugin remove com.mirasense.scanditsdk.plugin
call ionic cordova plugin add scandit\

copy /Y apps\al\src\environments\environment.prod.ts apps\al\src\environments\environment.ts
copy /Y libs\services\src\environments\environment.prod.ts libs\services\src\environments\environment.ts
copy /Y config.prod.xml config.xml

del "platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk"
call ionic cordova build android --release --project al

copy /Y config.xml config.prod.xml
copy /Y apps\al\src\environments\environment.ts apps\al\src\environments\environment.prod.ts
copy /Y libs\services\src\environments\environment.ts libs\services\src\environments\environment.prod.ts

git checkout config.xml
git checkout apps\al\src\environments\environment.ts
git checkout libs\services\src\environments\environment.ts

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore _dev\android\krackal.keystore -storepass galvintec "platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" krackal

del Krack_AL_0_0_X.apk
del Krack_AL_0_0_X_release.apk
zipalign -v 4 "platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" Krack_AL_0_0_X_release.apk

popd
