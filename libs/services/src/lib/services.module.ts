import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Oauth2Service } from './endpoint/oauth2/oauth2.service';
import { PermissionsService } from './endpoint/permissions/permissions.service';
import { AuthenticationService } from './endpoint/authentication/authentication.service';
import { ScanditService } from "./scandit/scandit.service";
import { MondayStartingDateAdapterService } from "./monday-starting-date-adapter/monday-starting-date-adapter.service";

@NgModule({
  imports: [CommonModule],
  providers: [Oauth2Service, PermissionsService, AuthenticationService, ScanditService, MondayStartingDateAdapterService]
})
export class ServicesModule {}
