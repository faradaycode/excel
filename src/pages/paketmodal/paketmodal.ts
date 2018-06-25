import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the PaketmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-paketmodal',
  templateUrl: 'paketmodal.html',
})
export class PaketmodalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaketmodalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  goTo(kelas, paket = null) {
    this.navCtrl.push("MainmenuPage", { klas: kelas, pkt: paket });
  }
}
