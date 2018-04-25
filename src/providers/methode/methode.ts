import { AlertController, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs/Rx';

/*
  Generated class for the MethodeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MethodeProvider {
  myAnswer: any = [];
  theAnswer: any = [];
  description: any = [];
  posi: BehaviorSubject<any>;
  mapel: BehaviorSubject<any>;;
  kodes: String;

  constructor(public http: HttpClient, private alertCtrl: AlertController, private toast: ToastController,
    private store: Storage) {
    console.log('Hello MethodeProvider Provider');
    this.posi = new BehaviorSubject(null);
    this.mapel = new BehaviorSubject(null);
    this.kodes = "mypassion";
  }
  allertMethod(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  onToast(msg) {
    let tos = this.toast.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    tos.present();
  }

  setKey(keyname, value) {
    return this.store.set(keyname, value);
  }

  getKeyVal(keyname) {
    return this.store.get(keyname);
  }

  jsonCall(jsonfile) {
    return this.http.get(jsonfile);
  }

  playSound() {
    let audio = new Audio();
    audio.src = "assets/alarm.mp3";
    audio.load();
    audio.play();
  }

  getGo(val) {
    this.posi.next(val);
  }

  setGo() {
    return this.posi.asObservable();
  }
  
  bgset(val) {
    this.mapel.next(val);
  }

  bgget() {
    return this.mapel.asObservable();
  }
}
