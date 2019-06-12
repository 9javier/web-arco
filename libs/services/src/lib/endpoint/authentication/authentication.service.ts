import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'access_token';
const USER_ID_KEY = 'user_id';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authenticationState = new BehaviorSubject(null);

  constructor(private storage: Storage) {
    console.log(storage);
  }

  async checkToken() {
    return await this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
        return true;
      } else {
        this.authenticationState.next(false);
        return false;
      }
    }, error => {
      return false
    });
  }

  async login(accessToken: string, userId?: number, refreshToken?:string) {
    if (userId) {
      await this.storage.set(USER_ID_KEY, userId);
    }
    if(refreshToken)
      await this.storage.set("refreshToken",refreshToken);
    return this.storage.set(TOKEN_KEY, `Bearer ${accessToken}`).then(() => {
      this.authenticationState.next(true);
    });
  }

  logout() {
    this.storage.remove(USER_ID_KEY);

    return this.storage.remove(TOKEN_KEY).then((data) => {
      if(this.authenticationState.value) {
        this.authenticationState.next(false);
      }
    });
  }

  isAuthenticated() {
    return this.authenticationState.getValue();
  }

  getCurrentToken(): Promise<string> {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        return res;
      }
    });
  }

  /**
   * @returns the stored refresh token
   */
  getCurrentRefreshToken():Promise<string>{
    return this.storage.get("refreshToken").then(res=>{
      if(res)
        return res;
    });
  }

  getCurrentUserId(): Promise<number> {
    return this.storage.get(USER_ID_KEY).then(res => {
      if (res) {
        return res;
      }
    });
  }
}
