import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MatDialogModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage';

import { ServicesModule } from '@suite/services';
import { PipesModule } from "../../../../libs/pipes/src";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpInterceptorService } from './interceptor/http-interceptor.service';
import { ErrordialogComponent } from './interceptor/errordialog-component/errordialog.component';
import {IncidencesButtonModule, ScannerConfigurationModule} from "@suite/common-modules";
import { AddTokenToRequestInterceptor } from '@suite/services';
import { BreadcrumbModule,MenuModule} from '@suite/common-modules';

@NgModule({
  declarations: [AppComponent, ErrordialogComponent],
  entryComponents: [ErrordialogComponent],
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
    ScannerConfigurationModule,
    IncidencesButtonModule,
    BreadcrumbModule,
    MenuModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
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
