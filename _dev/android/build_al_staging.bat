pushd %~dp0\..\..
call ionic cordova plugin remove com.mirasense.scanditsdk.plugin
call ionic cordova plugin add scandit\
copy /Y config.staging.xml config.xml
copy /Y libs\services\src\environments\environment.staging.ts libs\services\src\environments\environment.ts
call ionic cordova build android --project al
copy /Y config.xml config.staging.xml
copy /Y libs\services\src\environments\environment.ts libs\services\src\environments\environment.staging.ts
git checkout config.xml
git checkout libs\services\src\environments\environment.ts
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore _dev\android\krackal.keystore -storepass galvintec "platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" krackal
del Krack_AL_0_0_X.apk
del Krack_AL_0_0_X_test.apk
zipalign -v 4 "platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" Krack_AL_0_0_X_test.apk
popd
