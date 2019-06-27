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
import { ScannerConfigurationModule,MenuModule } from "@suite/common-modules";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import localeEs from '@angular/common/locales/es';
import {registerLocaleData} from "@angular/common";
import {MondayStartingDateAdapterService} from "../../../../libs/services/src/lib/monday-starting-date-adapter/monday-starting-date-adapter.service";

registerLocaleData(localeEs);

@NgModule({
  declarations: [AppComponent],
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
    ScannerConfigurationModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    MatDatepickerModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: DateAdapter, useClass: MondayStartingDateAdapterService },
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddTokenToRequestInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
