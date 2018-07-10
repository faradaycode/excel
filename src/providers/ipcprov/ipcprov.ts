import { ElectronService } from 'ngx-electron';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the IpcprovProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IpcprovProvider {

  constructor(public http: HttpClient, private _electronService: ElectronService) {
    console.log('Hello IpcprovProvider Provider');
  }

  public on(channel: string, listener: Function): void {
    this._electronService.ipcRenderer.on(channel, listener);
  }

  public send(channel: string, ...args): void {
    this._electronService.ipcRenderer.send(channel, args);
  }

  public once(channel: string, listener: Function): void {
    this._electronService.ipcRenderer.once(channel, listener);
  }

}
