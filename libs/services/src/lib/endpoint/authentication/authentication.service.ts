import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authenticationState = new BehaviorSubject(null);

  constructor(private storage: Storage) {}

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

  login(accessToken: string) {
    return this.storage.set(TOKEN_KEY, `Bearer ${accessToken}`).then(() => {
      this.authenticationState.next(true);
    });
  }

  logout() {
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
}
