import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModanalisisPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modanalisis',
  templateUrl: 'modanalisis.html',
})
export class ModanalisisPage {

  analis: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.analis = this.navParams.get("analisis");
    console.log(this.analis);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModanalisisPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
