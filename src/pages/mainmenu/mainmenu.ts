import { MethodeProvider } from './../../providers/methode/methode';
import { Component } from '@angular/core';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MainmenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mainmenu',
  templateUrl: 'mainmenu.html',
  animations: [
    trigger('flyInOut', [
      transition('* => appearing', [
        query('.col', style({ opacity: 0 }), { optional: true }),
        query('.col', stagger('500ms', [
          animate('1s ease-in', keyframes([
            style({ opacity: 0, transform: 'translate3d(-100%, 0, 0)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translate3d(0, 0, 0)', offset: 1.0 }),
          ]))]), { optional: true })
      ]),
      transition('* => anim-b', [
        query('.item-list', style({ opacity: 0 }), { optional: true }),
        query('.item-list', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({ opacity: 0, transform: 'translate3d(0, 100px, 0)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translate3d(0, 0, 0)', offset: 1.0 }),
          ]))]), { optional: true })
      ])
    ])
  ]
})
export class MainmenuPage {
  animVar = '';
  paket: String;
  kls: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private serv: MethodeProvider) {
    this.kls = this.navParams.get("klas");
  }

  ionViewDidLoad() {
    console.log(this.navCtrl.getActive().id);
  }

  ngOnInit() {
    this.animVar = 'appearing';
  }

  goto(page, mapel) {
    if (mapel !== undefined || mapel !== null) {
      this.serv.bgset(mapel);
      this.navCtrl.push(page, { kelas: this.kls, pel: mapel }).then(mess => console.log(mess)).catch(err => console.log(err));
    } else {
      this.navCtrl.push(page).catch(err => console.log(err));
    }
  }
  getPk(val) {
    var pk = document.getElementById('paketan');
    var mp = document.getElementById('mapel-menu');
    
    this.paket = val;
    pk.style.display = 'none';
    mp.style.display = 'block';
  }
}
