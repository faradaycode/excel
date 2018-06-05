import { IpcprovProvider } from '../../providers/ipcprov/ipcprov';
import { NavController, IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { trigger, style, transition, animate, keyframes, query, stagger, state } from '@angular/animations';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('flip', [
      state('*', style({
        opacity: 0
      })),
      state('flipped', style({
        opacity: 1,
        transform: 'rotate(360deg)',
      })),
      transition('* => flipped', animate('1s ease'))
    ]),

    //right and left flyin
    trigger('flyin', [
      state('default', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('right', style({
        transform: 'translate3d(250%, 0, 0)'
      })),
      state('left', style({
        transform: 'translate3d(-250%, 0, 0)'
      })),
      transition('right => default', animate('800ms ease-out')),
      transition('left => default', animate('800ms ease-out'))
    ]),

    trigger('fade', [
      state('visible', style({
        opacity: 1,
        display: 'block'
      })),
      state('invisible', style({
        opacity: 0,
        display: 'none'
      })),
      transition('visible <=> invisible', animate('800ms ease-in'))
    ]),

    trigger('bounce', [
      transition('* => bouncing', [
        query('.col', style({
          opacity: 0
        }), { optional: true }),
        query('.col', stagger('1000ms', [
          animate('1s ease-in', keyframes([
            style({ transform: 'translate3d(0,-100%,0)', offset: 0 }),
            style({ transform: 'translate3d(0,100%,0)', offset: 0.5, opacity: 1 }),
            style({ transform: 'translate3d(0,0,0)', offset: 1 })
          ]))]), { optional: true })
      ])
    ])
  ]
})
export class HomePage {
  fliping: String;
  bounceState: String = 'noBounce';
  invis: String = 'invisible';
  fliping2: String;
  vis: String = 'visible';
  hidestat: boolean = false;
  lis: any = [];

  constructor(public navCtrl: NavController, private ipcp: IpcprovProvider) {

  }

  ionViewWillLeave() {
    this.hidestat = !this.hidestat
  }

  ngOnInit() {

    this.fliping = "flipped";
    // setTimeout(() => {
    //   this.faded = (this.faded === 'invisible') ? 'visible' : 'invisible';
    // }, 1000);
  }

  goTo(kelas, paket = null) {
    this.navCtrl.push("MainmenuPage", { klas: kelas, pkt: paket });
    // let kls = "4";
    // let mapel = "mtk";
    // let nilai = 100;
    // this.ipcp.send("updateData", {
    //   kelas: kls,
    //   mp: mapel,
    //   nilais: nilai
    // });
  }

  unhide() {
    this.hidestat = !this.hidestat;
  }
}
