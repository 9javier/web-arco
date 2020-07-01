import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MatDatepickerModule, MatDialogModule, MatNativeDateModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage';

import { ServicesModule } from '@suite/services';
import { PipesModule } from "../../../../libs/pipes/src";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpInterceptorService } from './interceptor/http-interceptor.service';
import { ErrordialogComponent } from './interceptor/errordialog-component/errordialog.component';
import { AddTokenToRequestInterceptor } from '@suite/services';
import { MenuModule} from '@suite/common-modules';

import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import localeEs from '@angular/common/locales/es';
import {registerLocaleData} from "@angular/common";
import {MondayStartingDateAdapterService} from "../../../../libs/services/src/lib/monday-starting-date-adapter/monday-starting-date-adapter.service";
import { NgxMaskModule } from 'ngx-mask';
import { VirtualKeyboardComponent } from '../../../../libs/modules/src/components/virtual-keyboard/virtual-keyboard.component';
import { VirtualKeyboardModule } from '../../../../libs/modules/src/components/virtual-keyboard/virtual-keyboard.module';

 
registerLocaleData(localeEs);
@NgModule({
  declarations: [AppComponent, ErrordialogComponent],
  entryComponents: [ErrordialogComponent, VirtualKeyboardComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    ServicesModule,
    PipesModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MenuModule,
    NgxMaskModule.forRoot(),
    VirtualKeyboardModule,
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
   /* {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
