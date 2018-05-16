import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { MethodeProvider } from '../../providers/methode/methode';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  tabBarElement: any;

  datas: any = [];
  question: any = [];

  klas: any;
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private serv: MethodeProvider,
    private form: FormBuilder, private menuctrl: MenuController) {
    this.paket = this.navParams.get('paket');
    this.klas = this.navParams.get('kelas');
    this.mapel = this.navParams.get('pel');

  }
  ionViewDidLoad() {
    console.log(this.klas);
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
    if (this.limiter < this.limitedVal) {
      if (this.klas !== 6) {
        url = "assets/soal/" + this.klas + "/" + this.mapel + "/";
      } else {
        url = "assets/soal/" + this.klas + "/" + this.paket + "/" + this.mapel + "/";
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
  }
  prevq(val) {
    this.pos--;
    this.limiter--;
    this.count = 0;
    this.answered(this.pos);
    this.showQuestion();
  }
  //end method

  jawab(numQst, ansVal) {
    //save user answer into object each time they click the radio button
    this.saveAns[numQst] = ansVal;
    var siden = document.getElementById('an-' + numQst);
    siden.innerHTML = ansVal;
  }

  finishing() {
    let answer: any = [];
    answer = this.saveAns;
    this.serv.getGo(null);

    for (let i = 0; i < this.limitedVal; i++) {
      //if user answer same with the answer key, true answer variable will increase 1pt
      if (answer[i] === this.datas[i].jawaban) {
        this.trueAns += 1;
      }
      this.serv.myAnswer.push(answer[i]);
      this.serv.theAnswer.push(this.datas[i].jawaban);
      this.serv.description.push(this.datas[i].bahasan);

      var siden = document.getElementById('an-' + i);
      siden.innerHTML = "";
    }
    this.serv.getGo(null);
    this.navCtrl.push('HasilPage', { 
      trueans: this.trueAns, 
      totalar: this.limitedVal, 
      kelass: this.klas,
      mapel: this.mapel
    });

    console.log(this.klas+" "+this.mapel);
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
      }
    })
  }
  ragu(numQst) {
    this.count++;
    var bt = document.getElementById("sc" + numQst);

    if (this.count === 1) {
      if (!bt.classList.contains('warning')) {
        bt.classList.add('warning');
      } else {
        bt.classList.remove('warning')
      }
    }

    if (this.count > 1) {
      bt.classList.remove('warning');
      this.count = 0;
    }

    console.log(this.count);
  }
  jump(val) {
    this.serv.getGo(val);
    this.menuctrl.close();
  }
}