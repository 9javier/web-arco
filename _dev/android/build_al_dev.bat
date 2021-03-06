pushd %~dp0\..\..

call ionic cordova plugin remove com.mirasense.scanditsdk.plugin
call ionic cordova plugin add scandit\
call ionic cordova plugin remove cordova-plugin-zebra-printer
call ionic cordova plugin add plugin-zebra\

copy /Y apps\al\src\environments\environment.dev.ts apps\al\src\environments\environment.ts
copy /Y libs\services\src\environments\environment.dev.ts libs\services\src\environments\environment.ts
copy /Y resources.dev\icon.png resources\icon.png
copy /Y resources.dev\android\icon\drawable-hdpi-icon.png resources\android\icon\drawable-hdpi-icon.png
copy /Y resources.dev\android\icon\drawable-ldpi-icon.png resources\android\icon\drawable-ldpi-icon.png
copy /Y resources.dev\android\icon\drawable-mdpi-icon.png resources\android\icon\drawable-mdpi-icon.png
copy /Y resources.dev\android\icon\drawable-xhdpi-icon.png resources\android\icon\drawable-xhdpi-icon.png
copy /Y resources.dev\android\icon\drawable-xxhdpi-icon.png resources\android\icon\drawable-xxhdpi-icon.png
copy /Y resources.dev\android\icon\drawable-xxxhdpi-icon.png resources\android\icon\drawable-xxxhdpi-icon.png

del "platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk"
call ionic cordova build android --release --project al

copy /Y apps\al\src\environments\environment.ts apps\al\src\environments\environment.dev.ts
copy /Y libs\services\src\environments\environment.ts libs\services\src\environments\environment.dev.ts
copy /Y resources\icon.png resources.dev\icon.png
copy /Y resources\android\icon\drawable-hdpi-icon.png resources.dev\android\icon\drawable-hdpi-icon.png
copy /Y resources\android\icon\drawable-ldpi-icon.png resources.dev\android\icon\drawable-ldpi-icon.png
copy /Y resources\android\icon\drawable-mdpi-icon.png resources.dev\android\icon\drawable-mdpi-icon.png
copy /Y resources\android\icon\drawable-xhdpi-icon.png resources.dev\android\icon\drawable-xhdpi-icon.png
copy /Y resources\android\icon\drawable-xxhdpi-icon.png resources.dev\android\icon\drawable-xxhdpi-icon.png
copy /Y resources\android\icon\drawable-xxxhdpi-icon.png resources.dev\android\icon\drawable-xxxhdpi-icon.png

git checkout apps\al\src\environments\environment.ts
git checkout libs\services\src\environments\environment.ts
git checkout resources\icon.png
git checkout resources\android\icon\drawable-hdpi-icon.png
git checkout resources\android\icon\drawable-ldpi-icon.png
git checkout resources\android\icon\drawable-mdpi-icon.png
git checkout resources\android\icon\drawable-xhdpi-icon.png
git checkout resources\android\icon\drawable-xxhdpi-icon.png
git checkout resources\android\icon\drawable-xxxhdpi-icon.png

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore _dev\android\krackal.keystore -storepass galvintec "platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" krackal

del Krack_AL_0_0_X.apk
del Krack_AL_0_0_X_dev.apk
zipalign -v 4 "platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" Krack_AL_0_0_X_dev.apk

popd
