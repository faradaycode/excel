import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modals',
  templateUrl: 'modals.html',
})
export class ModalsPage {
  modalTitle: String;
  Vsoal: any;
  Vbhs: any;
  Isoal: any;
  Ibhs: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.Vsoal = this.navParams.get('soal');
    this.Vbhs = this.navParams.get('bahas');
  }

  ngOnInit() {
    let ext = ".png";
    this.Isoal = this.Vsoal + ext;
    this.Ibhs = this.Vbhs + ext;
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
