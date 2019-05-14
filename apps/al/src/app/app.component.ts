import { Component, OnInit } from '@angular/core';
import {
  Router,
  NavigationStart,
  ResolveStart,
  ResolveEnd
} from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ResponseLogout, Oauth2Service } from '@suite/services';
import { HttpResponse } from '@angular/common/http';
import { AuthenticationService } from '@suite/services';
import {ScanditService} from "../../../../libs/services/src/lib/scandit/scandit.service";

interface MenuItem {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'suite-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  public appPages: MenuItem[] = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'Ubicar/Escanear',
      icon: 'qr-scanner',
      url: 'positioning'
    },
    {
      title: 'Logout',
      url: '/home',
      icon: 'log-out'
    }
  ];

  navStart: Observable<NavigationStart>;
  navResStart: Observable<ResolveStart>;
  navResEnd: Observable<ResolveEnd>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private menu: MenuController,
    private loginService: Oauth2Service,
    private authenticationService: AuthenticationService,
    private scanditService: ScanditService
  ) {
    this.initializeApp();
    this.menu.enable(false, 'sidebar');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      /* Check for Authenticated user */
      this.authenticationService.authenticationState.subscribe(state => {
        if (state) {
          this.router.navigate(['home']);
          this.menu.enable(true, 'sidebar');
          if (this.platform.is('android')) {
            this.scanditService.setApiKey();
          }
        } else {
          this.router.navigate(['login']);
          this.menu.enable(false, 'sidebar');
        }
      });
    });
  }

  ngOnInit() {}

  tapOption(p: MenuItem) {
    console.log(p);
    if (p.title === 'Logout') {
      this.authenticationService.getCurrentToken().then(accessToken => {
        this.loginService
          .get_logout(accessToken)
          .subscribe((data: HttpResponse<ResponseLogout>) => {
            this.authenticationService.logout();
            console.log(data.body.data.msg);
          });
      });
    } else if(p.url === 'positioning'){
      this.scanditService.positioning();
    }
  }
}
