import { MethodeProvider } from './../../providers/methode/methode';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';

/**
 * Generated class for the KunciPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kunci',
  templateUrl: 'kunci.html',
})
export class KunciPage {
  mapel: string;
  kl: string;
  newArr: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private serv: MethodeProvider,
    private modalCtrl: ModalController, private viewCtrl: ViewController) {
      this.kl = this.navParams.get('klas');
      this.mapel = this.navParams.get('mapel');
  }

  ngOnInit() {
    for (let i = 0; i < this.serv.theAnswer.length; i++) {
      this.newArr.push({
        myans: this.serv.myAnswer[i],
        answ: this.serv.theAnswer[i],
        bahas: this.serv.description[i]
      });
    }
  }

  bahas(val) {
    let urlA;
    let urlB;
    if (this.kl === '6A') {
      urlA = "assets/bahas/6/a/" + this.mapel + "/" + val;
      urlB = "assets/soal/6/a/" + this.mapel + "/" + val;
    }
    if (this.kl === "6B") {
      urlA = "assets/bahas/6/b/" + this.mapel + "/" + val;
      urlB = "assets/soal/6/b/" + this.mapel + "/" + val;
    }
    if (this.kl !== "6A" && this.kl !== "6B") {
      urlA = "assets/bahas/" + this.kl + "/" + this.mapel + "/" + val;
      urlB = "assets/soal/" + this.kl + "/" + this.mapel + "/" + val;
    }

    let profileModal = this.modalCtrl.create("ModalsPage", { soal: urlB, bahas: urlA });
    profileModal.present();

    console.log(this.mapel+" "+this.kl);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
