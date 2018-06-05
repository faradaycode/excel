import { Component, ChangeDetectorRef } from '@angular/core';
import { Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MethodeProvider } from '../providers/methode/methode';
import { IpcprovProvider } from '../providers/ipcprov/ipcprov';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'HomePage';
  mapel: any;
  list: String[];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private serv: MethodeProvider,
    private menuctrl: MenuController, private ref: ChangeDetectorRef, private ipcp: IpcprovProvider) {
    this.serv.bgget().subscribe(data => {
      if (data !== null) {
        this.mapel = "assets/imgs/" + data + ".jpg";
      }
    });
  }
  ngOnInit() {
  }
  onGo(val) {
    this.serv.getGo(val);
    this.menuctrl.close();
  }
}

