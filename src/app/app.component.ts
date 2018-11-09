import { IpcprovProvider } from './../providers/ipcprov/ipcprov';
import { Component } from '@angular/core';
import { Platform, MenuController } from 'ionic-angular';
import { MethodeProvider } from '../providers/methode/methode';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = '';
  mapel: any;
  list: String[];

  constructor(platform: Platform, private serv: MethodeProvider,
    private menuctrl: MenuController, private ipc: IpcprovProvider) {
      let _ = this;
      this.ipc.send("onStartWin");
      
      this.ipc.on("regstat", function(e, data) {
        console.log(data);
        if(!data) {
          _.rootPage = 'RegisterPage';
        } else {
          _.rootPage = 'HomePage';
        }
      });

      this.ipc.on("alerting", function(e,data) {
        _.serv.allertMethod("Warning",data);
      });
    }
  onGo(val) {
    this.serv.getGo(val);
    this.menuctrl.close();
  }
}

