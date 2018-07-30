import { MethodeProvider } from './../../providers/methode/methode';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, Content } from 'ionic-angular';

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
  @ViewChild(Content) content: Content;
  @ViewChild('zoom') zoom: ElementRef;

  mapel: string;
  kl: string;
  newArr: any = [];
  t_soal: number = 40;
  pos: number = 0;
  soals: any = [];
  bahass: any = [];

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

  jump(val, position) {
    let url;
    let url2;

    if (this.kl === '4' || this.kl === '5') {
      url = "assets/soal/" + this.kl + "/" + this.mapel + "/";
      if (this.mapel === "mtk") {
        url2 = "assets/bahas/" + this.kl + "/" + this.mapel + "/";
      }
    } else {
      if (this.kl === "6A") {
        url = "assets/soal/6/a/" + this.mapel + "/";

        if (this.mapel === "mtk") {
          url2 = "assets/bahas/6/a/" + this.mapel + "/";
        }
      }
      if (this.kl === "6B") {
        url = "assets/soal/6/b/" + this.mapel + "/";

        if (this.mapel === "mtk") {
          url2 = "assets/bahas/6/b/" + this.mapel + "/";
        }
      }
    }
    this.pos = position + 1;
    this.soals = url + val + ".png";
    this.bahass = (this.mapel === "mtk") ? url2 + val + ".png" : "assets/imgs/nodesc.png";
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

    console.log(this.mapel + " " + this.kl);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
