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

import {ToastController, AlertController, LoadingController} from '@ionic/angular';
import { AppInfo } from 'config/base';
import { ToolbarProvider } from 'libs/services/src/providers/toolbar/toolbar.provider';
@Component({
  selector: 'suite-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginComponent implements OnInit {
  user: RequestLogin = {
    username: 'admin@krackonline.com',
    password: 'ChangeMe.1234',
    grant_type: 'password'
  };

  private loading = null;

  constructor(
    private loginService: Oauth2Service,
    private router: Router,
    private authenticationService: AuthenticationService,
    public toastController: ToastController,
    public alertController: AlertController,
    private loadingController: LoadingController,
    private intermediaryService:IntermediaryService,
    private toolbarProvider: ToolbarProvider
  ) {}

  ngOnInit() {}

  login(user: RequestLogin) {
    this.showLoading('Iniciando sesión...').then(() => {
      this.loginService.post_login(user, AppInfo.Name.Al).subscribe(
        (data: HttpResponse<ResponseLogin>) => {
          if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
          }
          const response: ResponseLogin = data.body;
          this.authenticationService.login(data.body.data.access_token, data.body.data.user,data.body.data.accessPermitionsDictionary,data.body.data.refresh_token);
          this.router.navigate(['/home']);
        },
        (errorResponse: HttpErrorResponse | any) => {
          if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
          }
          //this.intermediaryService.presentToastError("Usuario o contraseña incorrecta");
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
}
