import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import {
  ResponseLogin,
  RequestLogin,
  ErrorResponseLogin,
  Oauth2Service,
  IntermediaryService
} from '@suite/services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '@suite/services';

import { ToastController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AppInfo } from 'config/base';
import { Platform } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Observable, interval } from 'rxjs';
import { AppVersionService } from '../../../services/src/lib/endpoint/app-version/app-version.service';
import { AppVersionModel } from '../../../services/src/models/endpoints/appVersion.model';
import { ToolbarProvider } from 'libs/services/src/providers/toolbar/toolbar.provider';
import { stringify } from '@angular/core/src/render3/util';
import {config} from "../../../services/src/config/config";

const interUpdateVersion = interval(300000);

@Component({
  selector: 'suite-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginComponent implements OnInit {
  user: RequestLogin = {
    /**admin@krackonline.com*/
    username: '',
    /**ChangeMe.1234 */
    password: '',
    grant_type: 'password'
  };

  private loading = null;
  public versionNumber: string = config.version;
  public isMobileApp = false;
  public isNewVersion = false;

  constructor(
    private loginService: Oauth2Service,
    private router: Router,
    private authenticationService: AuthenticationService,
    public toastController: ToastController,
    public alertController: AlertController,
    private loadingController: LoadingController,
    private intermediaryService: IntermediaryService,
    private modalController: ModalController,
    public platform: Platform,
    private appVersion: AppVersion,
    private appVersionService: AppVersionService,
    private toolbarProvider: ToolbarProvider
  ) { }

  async ngOnInit() {
    this.user.username = '';
    this.user.password = '';
    this.getLastUsername();
    this.verifyNewVersion();
    interUpdateVersion.subscribe(x => this.verifyNewVersion());
    // Check if is mobile app and get appVersionNumber
  }

  verifyNewVersion() {
    if (window.cordova) {
      this.isMobileApp = true;

        this.appVersionService.getVersion().then((response: AppVersionModel.ResponseIndex) => {
          if (response && response.code === 200) {
            if (response.data) {

              const resultCompare = this.compareVersions(`${response.data['majorRelease']}.${response.data['minorRelease']}.${response.data['patchRelease']}`, this.versionNumber);
              if (resultCompare === 1) {
                this.isNewVersion = true;
                this.loginService.availableVersion.next({ status: true, version: response.data['majorRelease'] });
              } else {
                this.loginService.availableVersion.next({ status: false, version: 0 });
              }
            }
          }
        }, (error) => {
          console.log("Error::getVersion", error)
        }).catch((error) => {
          console.log("Error::getVersion", error)
        });

    } else {
      this.isMobileApp = false;
    }
  }

  /**
   * Get the last username thats been logged in the system
   */
  getLastUsername(): void {
    this.authenticationService.getUsername().subscribe(username => {
      this.user.username = username;
    });
  }

  compareVersions(versionDataBase, versionApp) {
    // Return 1 if versionDataBase > versionApp
    // Return -1 if versionDataBase < versionApp
    // Return 0 if versionDataBase == versionApp

    if (versionDataBase === versionApp) {
      return 0;
    }

    const a_components = versionDataBase.split(".");
    const b_components = versionApp.split(".");
    const len = Math.min(a_components.length, b_components.length);

    for (let i = 0; i < len; i++) {
      if (Number(a_components[i]) > Number(b_components[i])) {
        return 1;
      }

      if (Number(a_components[i]) < Number(b_components[i])) {
        return -1;
      }
    }

    if (a_components.length > b_components.length) {
      return 1;
    }

    if (a_components.length < b_components.length) {
      return -1;
    }
    return 0;
  }

  login(user: RequestLogin) {
    this.showLoading('Iniciando sesión...').then(() => {
      this.loginService.post_login(user, AppInfo.Name.Sga).subscribe(
        (data: HttpResponse<ResponseLogin>) => {
          if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
          }
          const response: ResponseLogin = data.body;

          this.authenticationService.login(data.body.data.access_token, data.body.data.user, data.body.data.accessPermitionsDictionary, data.body.data.refresh_token);
          this.toolbarProvider.currentPage.next('');
          this.router.navigate(['/home']);
        },
        (errorResponse: HttpErrorResponse) => {
          if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
          }
          if (errorResponse.status === 0) {
            this.intermediaryService.presentToastError("Ha ocurrido un error al conectar con el servidor");
          } else {
            this.intermediaryService.presentToastError("Error en usuario o contraseña");
          }
        }
      );
    });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 2750
    });
    toast.present();
  }

  async showLoading(message: string) {
    this.loading = await this.loadingController.create({
      message: message,
      translucent: true,
    });
    return await this.loading.present();
  }

  async presentPasswordAlert() {
    const alert = await this.alertController.create({
      header: '¿Contraseña?',
      message: `Si has olvidado tu contraseña o no tienes acceso a tu perfil ponte en contacto con tu
        supervisor y él buscará cual es tu contraseña actual o te dará nuevos datos de acceso.`,
      buttons: ['OK']
    });

    await alert.present();
  }

  ionViewWillEnter() {
    this.modalController.dismiss().catch(error=>{
      console.log(error);
      return;
    })
  }

  hide() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      const logo: HTMLElement = document.getElementById('logo');
      logo.setAttribute("style", "display: none;");
    }
  }

  recover() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      const logo: HTMLElement = document.getElementById('logo');
      logo.setAttribute("style", "display: flex;");
    }
  }

  loadUpdate() {
    window.open('https://drive.google.com/open?id=1p8wdD1FpXD_aiUA5U6JsOENNt0Ocp3_o', '_blank')
  }
}
