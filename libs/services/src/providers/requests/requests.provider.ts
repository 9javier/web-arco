import {Injectable} from "@angular/core";
import {AuthenticationService} from "../../lib/endpoint/authentication/authentication.service";
import {HttpRequestModel} from "../../models/endpoints/HttpRequest";

@Injectable({
  providedIn: 'root'
})
export class RequestsProvider {

  constructor(
    private auth: AuthenticationService,
  ) {}

  public get(url: string) : Promise<HttpRequestModel.Response> {
    return new Promise((resolve, reject) => {
      this.auth.getCurrentToken().then((authToken) => {
        let req = new XMLHttpRequest();

        req.open('GET', url, false);
        req.setRequestHeader('Authorization', authToken);
        req.send(null);

        let response = { error: 'Error to make GET Request' };

        if (req.responseText) {
          response = JSON.parse(req.responseText)
        }

        resolve(response);
      });
    });
  }

  public post(url: string, body: any) : Promise<HttpRequestModel.Response> {
    return new Promise((resolve, reject) => {
      this.auth.getCurrentToken().then((authToken) => {
        let req = new XMLHttpRequest();

        req.open('POST', url, false);
        req.setRequestHeader('Authorization', authToken);
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.send(JSON.stringify(body));

        let response = { error: 'Error to make POST Request' };

        if (req.responseText) {
          response = JSON.parse(req.responseText)
        }

        resolve(response);
      });
    });
  }

}
