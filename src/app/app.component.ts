import { Component } from '@angular/core';
import { Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MethodeProvider } from '../providers/methode/methode';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'HomePage';
  mapel: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private serv: MethodeProvider,
    private menuctrl: MenuController) {
    this.serv.bgget().subscribe(data => {
      if (data !== null) {
        this.mapel = "assets/imgs/" + data + ".jpg";
      }
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  onGo(val) {
    this.serv.getGo(val);
    this.menuctrl.close();
  }
}

