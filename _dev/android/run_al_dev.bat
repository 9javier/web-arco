pushd %~dp0\..\..

call ionic cordova plugin remove com.mirasense.scanditsdk.plugin
call ionic cordova plugin add scandit\
call ionic cordova plugin remove cordova-plugin-zebra-printer
call ionic cordova plugin add plugin-zebra\

call ionic cordova run android --device --project al

popd
