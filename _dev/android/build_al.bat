pushd %~dp0\..\..
copy /Y config_prod.xml config.xml
call ionic cordova build android --release --project al
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore _dev\android\krackal.keystore -storepass galvintec "platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" krackal
del Krack_AL_0_0_X.apk
zipalign -v 4 "platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" Krack_AL_0_0_X.apk
popd
