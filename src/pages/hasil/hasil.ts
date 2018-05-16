import { MethodeProvider } from './../../providers/methode/methode';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

/**
 * Generated class for the HasilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hasil',
  templateUrl: 'hasil.html',
})
export class HasilPage {

  mapel: any;
  kl: any;
  trueans: any;
  totalar: any;
  newArr: any = [];
  bahasVal: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private serv: MethodeProvider,
    private modalCtrl: ModalController) {
    this.trueans = this.navParams.get('trueans');
    this.totalar = this.navParams.get('totalar');
    this.kl = this.navParams.get('kelass');
    this.mapel = this.navParams.get('mapel');
  }

  bahasan() {
    let myModal = this.modalCtrl.create("KunciPage", {
      mapel: this.mapel,
      klas: this.kl
    });
    myModal.present();
  }

  toHome() {
    this.serv.myAnswer = [];
    this.serv.theAnswer = [];
    this.serv.description = [];

    this.navCtrl.popToRoot();
  }
}
