import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, Content } from 'ionic-angular';
import { MethodeProvider } from '../../providers/methode/methode';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IpcprovProvider } from '../../providers/ipcprov/ipcprov';

/**
 * Generated class for the QuisPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-quis',
  templateUrl: 'quis.html',
})

export class QuisPage {
  @ViewChild(Content) content: Content;
  @ViewChild('zoom') zoom: ElementRef;

  nullAns: number = 0;
  tabBarElement: any;

  datas: any = [];
  question: any = [];

  klas: String;
  mapel: any;
  paket: any;
  count: number = 0;
  totalArr: number;
  timeInSeconds: number;
  remainingSeconds: number;
  hasFinished: boolean;
  displayTime: string;

  limiter: number = 0;
  trueAns: number = 0;
  saveAns = {};
  cbForm: FormGroup;
  pos: number = 0;
  sticky: boolean = false;

  limitedVal: number = 40;
  _ragu: boolean = false;
  singleValue: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private serv: MethodeProvider,
    private form: FormBuilder, private menuctrl: MenuController, private alertCtrl: AlertController,
    private ipcp: IpcprovProvider) {
    this.paket = this.navParams.get('pkt');
    this.klas = this.navParams.get('kelas');
    this.mapel = this.navParams.get('pel');

  }
  ionViewDidEnter(): void {
    this.serv._pinchZoom(this.zoom.nativeElement, this.content);
  }

  ngOnInit() {
    this.cbForm = this.form.group({
      listRadio: ['']
    });

    setTimeout(() => {
      this.startTimer();
    }, 1000);
    this.timeInSeconds = 5400;
    this.initTimer();

    //call out json quis
    this.serv.jsonCall('assets/cbtjson.json').subscribe(data => {
      this.totalArr = Object.keys(data).length;
      for (let a in data) {
        if (data[a].mapel === this.mapel && data[a].kls === this.klas) {
          this.datas.push(data[a]);
          this.datas.sort((a, b) => { return Math.random() - 0.5; });
        }
      }
      this.showQuestion();
    });
    this.onGo();
  }

  showQuestion() {
    let url;
    let n = '6';
    if (this.limiter < this.limitedVal) {
      if (this.klas === '4' || this.klas === '5') {
        url = "assets/soal/" + this.klas + "/" + this.mapel + "/";
      } else {
        if (this.klas === "6A") {
          url = "assets/soal/" + n + "/" + this.paket + "/" + this.mapel + "/";
        }
        if (this.klas === "6B") {
          url = "assets/soal/" + n + "/" + this.paket + "/" + this.mapel + "/";
        }
      }

      this.question = url + this.datas[this.limiter].soal + ".png";
    }
  }
  //timer countdown
  initTimer() {
    if (!this.timeInSeconds) {
      this.timeInSeconds = 0;
    }

    this.remainingSeconds = this.timeInSeconds;
    this.displayTime = this.getSecondsAsDigitalClock(this.remainingSeconds);
  }
  startTimer() {
    this.timerTick();
  }

  timerTick() {
    setTimeout(() => {
      this.remainingSeconds--;
      this.displayTime = this.getSecondsAsDigitalClock(this.remainingSeconds);

      //check wheter remainingSeconds value is not zero then run method 
      if (this.remainingSeconds > 0) {
        this.timerTick();
      }
      if (this.remainingSeconds == 0) {
        this.serv.playSound()
      }
    }, 1000);
  }

  getSecondsAsDigitalClock(inputSeconds: number) {
    var sec_num = parseInt(inputSeconds.toString(), 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    var hoursString = '';
    var minutesString = '';
    var secondsString = '';

    hoursString = (hours < 10) ? "0" + hours : hours.toString();
    minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
    secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
    return hoursString + ':' + minutesString + ':' + secondsString;
  }
  // end method

  //next and previous button 
  nextq(val) {
    this.pos++;
    this.limiter++;
    this.count = 0;
    this.answered(this.pos);
    this.showQuestion();
    this._ragu = (this._ragu) ? !this._ragu : this._ragu;
  }
  prevq(val) {
    this.pos--;
    this.limiter--;
    this.count = 0;
    this.answered(this.pos);
    this._ragu = (this._ragu) ? !this._ragu : this._ragu;
  }
  //end method

  jawab(numQst, ansVal) {
    //save user answer into object each time they click the radio button
    this.saveAns[numQst] = ansVal;
    var siden = document.getElementById('an-' + numQst);
    siden.innerHTML = ansVal;
  }

  finishAlt() {
    for (let i = 0; i < this.limitedVal; i++) {
      if (this.saveAns[i] === null || this.saveAns[i] === undefined) {
        this.nullAns += 1;
      }
    }

    let ms = "";
    if (this.count > 0) {
      ms = "Ada" + this.count + " Jawaban yang Masih Kamu Ragukan, Tetap Selesai?";
    } else {
      ms = "Masih Ada " + this.nullAns + " Soal Yang Kosong, Tetap Selesai?";
    }

    let alert = this.alertCtrl.create({
      title: "Peringatan",
      message: ms,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.nullAns = 0;
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.finishing();
          }
        }
      ]
    });

    if (this.nullAns > 0) {
      alert.present();
    } else {
      this.finishing();
    }

    console.log(this.nullAns);
  }

  finishing() {
    let answer: any = [];
    let na: number = 0;
    let nh: number = 0;
    let np: number = 0;
    let weaks: any = [];
    let intros: String = "";
    let analysis: String = "penguasaan ";
    answer = this.saveAns;
    this.serv.getGo(null);

    for (let i = 0; i < this.limitedVal; i++) {
      //if user answer same with the answer key, true answer variable will increase 1pt
      if (answer[i] === this.datas[i].jawaban) {
        this.trueAns += 1;
      }

      //if user answer wrong, it will count category for analysis
      if (answer[i] !== this.datas[i].jawaban) {
        var str: String = (this.datas[i].kode === null) ? 'no' : this.datas[i].kode;
        var cate = str.charAt(2);

        if (cate === "a") {
          na++;
        }
        if (cate === "h") {
          nh++;
        }
        if (cate === "p") {
          np++;
        }
      }

      this.serv.myAnswer.push(answer[i]);
      this.serv.theAnswer.push(this.datas[i].jawaban);
      this.serv.description.push(this.datas[i].bahasan);

      var siden = document.getElementById('an-' + i);
      siden.innerHTML = "";
    } //end loop

    if (na > 6) {
      weaks.push("aplikasi lemah");
    }
    if (np > 6) {
      weaks.push("penalaran lemah");
    }
    if (nh > 6) {
      weaks.push("hapalan lemah");
    }

    intros = "Hai ";
    console.log(analysis + weaks.join(", "));

    //upadte db
    this.ipcp.send("updateData", {
      kelas: this.klas.toLowerCase(),
      mapel: this.mapel,
      nilai: (this.trueAns / (this.limitedVal / 10)) * 10
    });

    console.log
    this.serv.getGo(null);
    this.navCtrl.push('HasilPage', {
      trueans: this.trueAns,
      totalar: this.limitedVal,
      kelass: this.klas,
      mapel: this.mapel,
      notAns: this.nullAns
    });
  }

  reseting() {
    this.cbForm.controls.listRadio.reset(); //clear checked ion-radio 
  }

  //this methode for get previous and next answered question 
  answered(pos) {
    if (this.saveAns[pos] !== undefined) {
      if (this.saveAns[pos] === "a") {
        this.cbForm.controls.listRadio.setValue(this.saveAns[pos]);
      }
      if (this.saveAns[pos] === "b") {
        this.cbForm.controls.listRadio.setValue(this.saveAns[pos]);
      }
      if (this.saveAns[pos] === "c") {
        this.cbForm.controls.listRadio.setValue(this.saveAns[pos]);
      }
      if (this.saveAns[pos] === "d") {
        this.cbForm.controls.listRadio.setValue(this.saveAns[pos]);
      }
    }
    if (this.saveAns[pos] === undefined || this.saveAns[pos] === null) {
      this.reseting();
    }
  }
  onGo() {
    this.serv.setGo().subscribe(res => {
      if (res === null) {
        console.log(".....");
      } else {
        this.pos = res;
        this.limiter = res;
        this.answered(this.pos);
        this.showQuestion();
        this._ragu = (this._ragu) ? !this._ragu : this._ragu;
      }
    })
  }
  ragu(numQst) {
    this.count++;
    var bt = document.getElementById("sc" + numQst);

    if (!this._ragu) {
      if (bt.style.backgroundColor === "orange") {
        bt.style.backgroundColor = "";
        this.count--;
      } else {
        this._ragu = !this._ragu;
        bt.style.backgroundColor = "orange";
        this.count++;
      }
    } else {
      this._ragu = !this._ragu;
      bt.style.backgroundColor = "";
      this.count--;
    }
  }
  jump(val) {
    this.serv.getGo(val);
    this.menuctrl.close();
  }
}