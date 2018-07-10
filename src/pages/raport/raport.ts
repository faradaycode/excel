import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { IpcprovProvider } from '../../providers/ipcprov/ipcprov';

/**
 * Generated class for the RaportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-raport',
  templateUrl: 'raport.html',
})
export class RaportPage {
  kls:number;
  totalN: number = 0;
  totalMapel: number = 5;
  arrdata: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private ipcp: IpcprovProvider, private modalCtrl: ModalController) {
    this.kls = this.navParams.get('kelas');
  }

  ionViewDidLoad() {
    this.getData();
  }

  getData() {
    let me = this;

    this.ipcp.send("selectData", {
      kelas: this.kls
    });

    this.ipcp.on("resultAll", function (ev, data) {
      me.arrdata = [];
      let mapel = "";
      for (let i in data) {
        if (data[i].mapel === "mtk") {
          mapel = "matematika";
        }
        if (data[i].mapel === "bindo") {
          mapel = "bahasa indonesia";
        }
        if (data[i].mapel !== "mtk" && data[i].mapel !== "bindo") {
          mapel = data[i].mapel;
        }
        me.arrdata.push({ mapels: mapel, nilais: data[i].nilai, mp: data[i].mapel });
      }
    });

    this.ipcp.on("resultSum", function (ev, data) {
      me.totalN = data[0].nl / me.totalMapel;
    })
  }

  backto() {
    this.navCtrl.pop();
  }

  getReview(mapel) {
    let an;
    let _ = this;
    this.ipcp.send("getReview", {
      kelas: this.kls,
      mapel: mapel
    });
    this.ipcp.once("setReview", function (ev, data) {
      an = data[0].analisis;
      let myModal = _.modalCtrl.create("ModanalisisPage", {
        'analisis': an
      });

      myModal.present();
    });
  }
}
