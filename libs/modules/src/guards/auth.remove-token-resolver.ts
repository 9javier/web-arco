import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from '@angular/core';
import { AuthenticationService } from '@suite/services';

@Injectable()

export class RemoteTokenResolver implements Resolve<boolean> {

  constructor(private auth: AuthenticationService) {}
 
  async resolve(): Promise<boolean> {
    await this.auth.logout();
    return true;
  }
}