import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable, from } from 'rxjs';
import {WarehouseModel} from "@suite/services";

const TOKEN_KEY = 'access_token';
const USER_ID_KEY = 'user_id';
const USER_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  authenticationState = new BehaviorSubject(null);
  dictionaryAcessState = new BehaviorSubject(null);

  constructor(private storage: Storage) {
    console.log(storage);
    console.log("dictionaryManagement", "AuthenticationService: constructor, before getDictionaryAccess");
    this.getDictionaryAccess();
  }

    /**
   * Get the last sucessfull login username
   * @returns the last username loged from this terminal
   */
  getUsername():Observable<string>{
    return from(this.storage.get("username"));
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

  async getDictionaryAccess(){
    console.log("set dictionary access");
    console.log("dictionaryManagement", "AuthenticationService: getDictionaryAccess, before storage.get");
    return await this.storage.get("dictionaryAcess").then(access=>{
      console.log("set dictionary access",access);
      console.log("dictionaryManagement", "AuthenticationService: getDictionaryAccess, storage.get callback", JSON.stringify(access));
      this.dictionaryAcessState.next(access);
    });
  }

  async login(accessToken: string, user?: any, dictionary?, refreshToken?:string) {
    if (user) {
      await this.storage.set(USER_ID_KEY, user.id);
      await this.storage.set(USER_KEY, JSON.stringify(user));
    }
    if(refreshToken)
      await this.storage.set("refreshToken",refreshToken);
    if(dictionary) {
      console.log("dictionaryManagement", "AuthenticationService: login, before storage.set", JSON.stringify(dictionary));
      await this.storage.set("dictionaryAcess",dictionary).then(()=> {
        console.log("dictionaryManagement", "AuthenticationService: login, storage.set callback");
        return this.getDictionaryAccess();
      });
    }
    return this.storage.set(TOKEN_KEY, `Bearer ${accessToken}`).then(() => {
      this.authenticationState.next(true);
    });
  }

  logout() {
    this.storage.remove(USER_ID_KEY);
    this.storage.remove(USER_KEY);

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

  getCurrentUser(): Promise<any> {
    return this.storage.get(USER_KEY).then(res => {
      if (res) {
        return JSON.parse(res);
      }
    });
  }

  getWarehouseCurrentUser(): Promise<WarehouseModel.Warehouse> {
    return this.storage.get(USER_KEY).then(res => {
      if (res) {
        return JSON.parse(res).warehouse;
      }
    });
  }
}
