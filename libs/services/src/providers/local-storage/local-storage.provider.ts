import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageProvider {

  public KEYS = {
    USERNAME: 'username',
    ACCESS_TOKEN: 'access_token',
    USER_ID: 'user_id',
    USER: 'user',
    REFRESH_TOKEN: 'refreshToken',
    DICTIONARY_ACCESS: 'dictionaryAcess'
  };

  public set(key: string, value: any) {
    return new Promise((resolve, reject) => {
      localStorage.setItem(key, value);
      resolve();
    });
  }

  public get(key: string) {
    return new Promise((resolve, reject) => {
      let value = localStorage.getItem(key);
      if (typeof value != 'undefined' && value != null) {
        resolve(value);
      } else {
        resolve('');
      }
    });
  }

  public remove(key: string) {
    return new Promise((resolve, reject) => {
      localStorage.removeItem(key);
      resolve();
    });
  }

  public clear() {
    return new Promise((resolve, reject) => {
      localStorage.clear();
      resolve();
    });
  }
}
