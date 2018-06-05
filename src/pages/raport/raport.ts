import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MethodeProvider } from '../../providers/methode/methode';
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
  kls;
  totalN: number = 0;
  totalMapel: number = 5;
  arrdata: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private serv: MethodeProvider,
    private ipcp: IpcprovProvider) {
    this.kls = this.navParams.get('kelas');
  }

  ngOnInit() {
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
        me.arrdata.push({ mapels: mapel, nilais: data[i].nilai });
      }
    });
  }

  backto() {
    this.navCtrl.pop();
  }
}
