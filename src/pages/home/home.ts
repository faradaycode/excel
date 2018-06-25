import { NavController, IonicPage, ModalController } from 'ionic-angular';
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
        transform: 'rotateY(360deg)',
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
        opacity: 1
      })),
      state('invisible', style({
        opacity: 0
      })),
      transition('visible <=> invisible', animate('800ms ease-in'))
    ]),

    trigger('bounce', [
      transition('* => bouncing', [
        query('img', style({
          opacity: 0
        }), { optional: true }),
        query('img', stagger('500ms', [
          animate('500ms ease-in', keyframes([
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
  hidestat: boolean = false;
  fading: String = "invisible";
  lis: any = [];

  constructor(public navCtrl: NavController, private modalCtrl: ModalController) {

  }

  ionViewWillLeave() {
    this.hidestat = !this.hidestat
  }

  ngOnInit() {

    this.fliping = "flipped";
      this.bounceState = (this.bounceState === "noBounce") ? 'bouncing' : 'noBounce';
    setTimeout(() => {
      this.fading = (this.fading === "invisible") ? "visible" : "invisible";
    }, 2500);
  }

  goTo(kelas, paket = null) {
    this.navCtrl.push("MainmenuPage", { klas: kelas, pkt: paket });
  }

  openModal() {
    let myModal = this.modalCtrl.create("PaketmodalPage", "", {
      cssClass: "m-pakets"
    });
    myModal.present();
  }

  unhide() {
    this.hidestat = !this.hidestat;
  }
}
