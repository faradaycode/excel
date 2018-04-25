import { MethodeProvider } from './../../providers/methode/methode';
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
        opacity: 1
      })),
      state('invisible', style({
        opacity: 0
      })),
      transition('invisible <=> visible', animate('800ms ease-in'))
    ]),

    trigger('bounce', [
      transition('* => bouncing', [
        query('.col', style({ transform: 'translate3d(0,-100%,0)' }), { optional: true }),
        query('.col', stagger('1000ms', [
          animate('1s ease-in', keyframes([
            style({ transform: 'translate3d(0,-100%,0)', offset: 0 }),
            style({ transform: 'translate3d(0,100%,0)', offset: 0.5 }),
            style({ transform: 'translate3d(0,0,0)', offset: 1 })
          ]))]), { optional: true })
      ])
    ])
  ]
})
export class HomePage {
  fliping: String;
  bounceState: String = 'noBounce';
  faded: String = 'invisible';

  constructor(public navCtrl: NavController, private serv: MethodeProvider) { }

  ngOnInit() {
    this.fliping = "flipped";
    setTimeout(() => {
      this.faded = (this.faded === 'invisible') ? 'visible' : 'invisible';
    }, 1000);
  }

  mulai() {
    document.getElementById('grade-div').style.display = "block";
    document.getElementById('home-div').style.display = "none";

    this.bounceState = (this.bounceState === 'noBounce') ? 'bouncing' : 'noBounce';
  }

  goTo(kelas) {
    this.navCtrl.push("MainmenuPage", { klas: kelas });
    setTimeout(() => {
      document.getElementById('grade-div').style.display = "none";
      document.getElementById('home-div').style.display = "block";
    }, 1000);
  }
}
