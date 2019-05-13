import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Oauth2Service } from './endpoint/oauth2/oauth2.service';
import { PermissionsService } from './endpoint/permissions/permissions.service';
import { AuthenticationService } from './endpoint/authentication/authentication.service';
import { OtroComponent } from './contact/otro/otro.component';

@NgModule({
  imports: [CommonModule],
  providers: [Oauth2Service, PermissionsService, AuthenticationService],
  declarations: [OtroComponent]
})
export class ServicesModule {}
