import {
  API,
  HeaderEntity,
  Auth1,
  Body,
  ItemEntity
} from './postman/Api.Team.postman_collection';
import { ServerPostmanEnvironment } from './postman/Server.postman_environment';
// @ts-ignore
import API_COLLECTION from './postman/Api.Team.postman_collection.json';
// @ts-ignore
import ENV_COLLECTION from './postman/Server.postman_environment.json';

const ENV: ServerPostmanEnvironment = ENV_COLLECTION;
const API_BASE: API = API_COLLECTION;

export const URL: string = ENV.values.find(value => value.key === 'url').value;

export const ACCESS_TOKEN: string = ENV.values.find(
  value => value.key === 'access_token'
).value;

export const PATH: string | any = (collection: string, requestName: string) =>
  URL +
  '/' +
  API_BASE.item
    .find(it => it.name === collection)
    .item.find(it => it.name === requestName)
    .request.url.path.join('/');

export const HEADERS: HeaderEntity[] | any = (
  collection: string,
  requestName: string
) =>
  API_BASE.item
    .find(it => it.name === collection)
    .item.find(it => it.name === requestName).request.header;

export const AUTH: Auth1 | any = (collection: string, requestName: string) =>
  API_BASE.item
    .find(it => it.name === collection)
    .item.find(it => it.name === requestName).request.auth;

export const BODY: Body | any = (collection: string, requestName: string) =>
  API_BASE.item
    .find(it => it.name === collection)
    .item.find(it => it.name === requestName).request.body;

export const COLLECTIONS: ItemEntity[] = API_BASE.item;

export namespace AppInfo {
  export enum ClientSecretSGA {
    Username = 'krack-client-sga',
    Password = 'fGx4=yU-j4^jAAjZtV+YTDsm-@R$HAK3'
  }

  export enum ClientSecretAL {
    Username = 'krack-client-al',
    Password = 'k4a4yBrqW54L@uX_^p8EMGDFb?qj*TKe'
  }

  export enum Name {
    Sga = 'SGA',
    Al = 'AL'
  }
}

export const SCANDIT_API_KEY: String = 'AYBtJzuGJtJ6DFps/jgz/cIdIvvrMIv3nG9R4Zpy9ffIWcOtOn3EMh9CrQvQQbRzDULHf3Jz4dejcPRSaErYH+1JNGdYbc/TATI6DzdCAnEke6Ntj2PTdclmpqvGaq1Wv1CFLORNa73ZPIP5cihi84dEJx/mPLXo+a1lcjvTTz/U3OHceuKxdgygsV3cLwiMpQd/NFZ9vzQeAQ/VU306ZB9O09lE2mcb/zcm+GwF+lJC5nRgBOK9wlN4CKtUoO2yg5G/+GVPxIWauhhrorON0Ef0lIds16kzvjlXnu6AbSeFjb/kHOR/8Q1QzUWKdYjv9HxqC+NaMm0HXgXqv02XcO7sF+iJ9dciu9inSEtFYYJ1B5uSHybKrfhn4Lt7NiDXWsCS1pYrFQ/BQsfE0I8wjE5lk4rIDqG7liV8K4U96+mV4uUKk1/+Da8H0UP2lO+k4AfzV9OTXtKHGj/Mtl6oRHZbNw/Qj77KGb6vSet2pGq0L3vrNKzgZEW5PuMu4la86n/Lde+Sr69eCUkhG+Xq+wy0KpzzZE42zFSX1z0nnO+GwlmW9UmHUSM+heS8uU63YCarQP4JX5zzXMZR7+Pf009v481ioLm10YC0Ih9x3QTk2NjkIwPTgP35NO0ZUOBYtUF/s+NAPqi7D367lWTEfZk1t+Lk7RvP9jexC30057nuRSX5kS30Yu6IiRDUDP2Uk22hIh5qsCUE3tMr8BrFEsEaZiOBAhMG9Pt5/GjpMT5Jm+/hmWJu1/6Xorfyk8C1w185p/Ijcl44TXsPffAdhc6QQJOF3RXKR3JO4dTvYUZThWD78M/aItC7PptNccZbc3fthw==';
