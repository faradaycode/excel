import { IpcprovProvider } from './../../providers/ipcprov/ipcprov';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MethodeProvider } from '../../providers/methode/methode';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  formReg: FormGroup;


  constructor(public navCtrl: NavController, public navParams: NavParams, private serv: MethodeProvider,
    private loading: LoadingController, private ipc: IpcprovProvider, private form: FormBuilder, public appCtrl: App) {
    this.formReg = this.form.group({
      username: this.form.control('', Validators.compose([Validators.minLength(1), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*'), Validators.required])),
      nickname: this.form.control('', Validators.compose([Validators.minLength(1), Validators.maxLength(10), Validators.pattern('[a-zA-Z ]*'), Validators.required])),
      kodebuku: this.form.control('', Validators.required)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  onRegs(val) {
    let errNo = [];
    let altmsg;

    if (this.formReg.controls.username.hasError('pattern')) {
      console.log('pattern');
      errNo.push("Hanya Huruf Saja Untuk Isi Nama.");
    }
    if (this.formReg.controls.username.hasError('maxlength')) {
      console.log('too long');
      errNo.push('Teks Nama Terlalu Panjang (Max 25 Karakter).');
    }
    if (this.formReg.controls.username.hasError('required')) {
      console.log('null');
      errNo.push('Nama Tidak Boleh Kosong.');
    }



    if (this.formReg.controls.nickname.hasError('pattern')) {
      console.log('pattern');
      errNo.push("Hanya Huruf Saja Untuk Isi Nama Panggilan.");
    }
    if (this.formReg.controls.nickname.hasError('maxlength')) {
      console.log('too long');
      errNo.push('Teks Nama Terlalu Panjang (Max 10 Karakter).');
    }
    if (this.formReg.controls.nickname.hasError('required')) {
      console.log('null');
      errNo.push('Nama Panggilan Tidak Boleh Kosong.');
    }



    if (this.formReg.controls.kodebuku.hasError('required')) {
      errNo.push('Kode Buku Tidak Boleh Kosong.');
    }


    if (errNo.length > 0) {
      this.serv.allertMethod('Error', errNo.join("<br>"));
    } else {
      let loader = this.loading.create({
        content: 'Please wait...'
      });

      this.ipc.send("onRegister", {
        fullname: val.username,
        kode: val.kodebuku,
        nick: val.nickname
      });

      loader.present();

      setTimeout(() => {
        let _ = this;

        this.ipc.once("alerting", function (ev, data) {
          if (data !== "" || data !== null) {
            console.log(data);
            altmsg = data;
          }
          this.serv.allertMethod("Warning", altmsg);
        });
        
        this.ipc.on("regstat", function (e, data) {
          if (data) {
            _.appCtrl.getRootNav().setRoot("HomePage");
          }
        });
        loader.dismiss();
      }, 3000);
    }
  }

  exitApp() {
    this.ipc.send("exitApp");
  }
}
