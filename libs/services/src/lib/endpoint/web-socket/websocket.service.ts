import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';
import { AuthenticationService } from '../authentication/authentication.service';
import {environment} from '../../../environments/environment';
import {BehaviorSubject} from "rxjs";
import { type } from "./enums/typeData";
type Socket = SocketIOClient.Socket;   

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {

  // public eventData = new EventEmitter();
  private socket : Socket;
  private socketUrl : string;
  static emitData = new BehaviorSubject({}); 
  private emitData$ = WebsocketService.emitData.asObservable();
  // public notificationHandler : Function = console.log;

  constructor(
    private authenticationService : AuthenticationService,
    private http:HttpClient
  ) {
    // this.setNotificationHandler(this.notificationHandler);
    if (!this.isConnected()){
      this.openConnection(environment.apiBase+"/discover_websocket");
    }
  }

  handshake = () =>{
    this.authenticationService.getCurrentToken()
    .then(async (authentication) => {
      console.log(authentication);
      return (await this.socket).emit('identity', authentication);
    });
  }

  errorHandler = (reason? : string) => {
    const message = `Error: [${this.socketUrl}]: ${reason}`;
    this.notificationHandler(message);
  }

  processDiscoveredSocket = (data : any) => {
    this.socketUrl = data.data.url;
    this.init(this.socketUrl);
  }
  
  getSocket() : Socket {
    return this.socket;
  }
  
  isConnected() : boolean {
    return !!this.socket;
  }
  
  disconnect() : void {
    this.socket.disconnect;
    delete this.socket;
  }

  async init(socketUrl : string = 'ws://localhost/ '){
    this.socket = io(socketUrl );
    this.socket.on('connect', this.handshake);
    this.socket.on('notification', this.notificationHandler);
    this.socket.on('connect_error', this.errorHandler );
    this.socket.on('disconnect', this.errorHandler);
  }

  // setNotificationHandler(notificationHandler : Function){
  //   this.notificationHandler = notificationHandler;
  // }

  /**
   * [openConnection Initialice new connection with a SocketIO Server]
   * @param  requestUrl URL to discover Web Socket
  **/
  openConnection(requestUrl : string = 'http://localhost'){
    return this.http.get(requestUrl).subscribe(this.processDiscoveredSocket);
  }

  notificationHandler(data : string | Object, acknowledge? : Function){
    if(acknowledge){
      acknowledge(this.getSocket().id );
    }

    switch (typeof data) {
      case 'object':{
        data = {
          'type': type.OBJECT,
          'data': <object>data
        }
        break;
      }
      case 'string':{
        data = {
          'type': type.STRING,
          'data': <string>data
        }
        break;
      }
      case 'boolean':{
        data = {
          'type': type.BOOLEAN,
          'data': <boolean>data
        }
        break;
      }
      case 'number':{
        data = {
          'type': type.NUMBER,
          'data': <number>data
        }
        break;
      }
      default:
        break;
    }
    if(typeof data === 'object'){
      WebsocketService.setEmitData(data);
    }
  }

  static setEmitData(data: any){
    WebsocketService.emitData.next(data);
  }
  getEmitData(){
    return this.emitData$;
  }
}