import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage';

import { ServicesModule, AddTokenToRequestInterceptor } from '@suite/services';
import {ScannerConfigurationModule, MenuModule, ToolbarAlModule} from "@suite/common-modules";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import localeEs from '@angular/common/locales/es';
import {registerLocaleData} from "@angular/common";
import {MondayStartingDateAdapterService} from "../../../../libs/services/src/lib/monday-starting-date-adapter/monday-starting-date-adapter.service";
import {NativeAudio} from "@ionic-native/native-audio/ngx";
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { ReviewImagesModule } from '../../../../libs/modules/src/incidents/components/review-images/review-images.module';
import { RegistryDetailsModule } from '../../../../libs/modules/src/components/modal-defective/registry-details-al/registry-details-al.module';
registerLocaleData(localeEs);

@NgModule({
  declarations: [AppComponent,],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MenuModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    ServicesModule,
    BrowserAnimationsModule,
    ScannerConfigurationModule,
    ToolbarAlModule,
    ReviewImagesModule,
    RegistryDetailsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    MatDatepickerModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: DateAdapter, useClass: MondayStartingDateAdapterService },
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddTokenToRequestInterceptor,
      multi: true
    },
    NativeAudio,
    AppVersion,
    Keyboard,
    Camera,
    FileTransfer
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
