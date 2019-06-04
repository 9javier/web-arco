pushd %~dp0\..\..
copy /Y config_prod.xml config.xml
copy /Y libs\services\src\environments\environment.prod.ts libs\services\src\environments\environment.ts
call ionic cordova build android --release --project al
copy /Y config.xml config_prod.xml
copy /Y libs\services\src\environments\environment.ts libs\services\src\environments\environment.prod.ts
git checkout config.xml
git checkout libs\services\src\environments\environment.ts
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore _dev\android\krackal.keystore -storepass galvintec "platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" krackal
del Krack_AL_0_0_X.apk
zipalign -v 4 "platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" Krack_AL_0_0_X.apk
popd
