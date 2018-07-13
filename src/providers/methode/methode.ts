import { AlertController, ToastController, Content, Gesture } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  mapel: BehaviorSubject<any>;

  scales: number;

  constructor(public http: HttpClient, private alertCtrl: AlertController, private toast: ToastController) {
    console.log('Hello MethodeProvider Provider');
    this.posi = new BehaviorSubject(null);
    this.mapel = new BehaviorSubject(null);
    this.scales = 1;
  }
  allertMethod(title, text) {
    var st = text;
    st = st.toLowerCase().replace(/\b[a-z]/g, function (letter) {
      return letter.toUpperCase();
    });

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: st,
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

  public clicknZoom(varscale, elm: HTMLElement, content: Content) {
    let ow = 0;
    let oh = 0;
    for (let i = 0; i < elm.children.length; i++) {
      let c = <HTMLElement>elm.children.item(i);
      ow = c.offsetWidth;
      oh += c.offsetHeight;
    }
    const original_x = content.contentWidth - ow;
    const original_y = content.contentHeight - oh;
    let max_x = original_x;
    let max_y = original_y;
    let min_x = 0;
    let min_y = 0;
    let x = 0;
    let y = 0;
    let last_x = 0;
    let last_y = 0;
    let scale = varscale;

    setBounds();
    transform(0 / 2, 0 / 2);

    function setBounds() {
      // I am scaling the container not the elements
      // since container is fixed, the container scales from the middle, while the
      // content scales down and right, with the top and left of the container as boundaries
      // scaled = absolute width * scale - already set width divided by 2;
      let scaled_x = Math.ceil((elm.offsetWidth * scale - elm.offsetWidth) / 2);
      let scaled_y = Math.ceil((elm.offsetHeight * scale - elm.offsetHeight) / 2);
      // for max_x && max_y; adds the value relevant to their overflowed size
      let overflow_x = Math.ceil(original_x * scale - original_x); // returns negative
      let overflow_y = Math.ceil(oh * scale - oh);

      max_x = original_x - scaled_x + overflow_x;
      min_x = 0 + scaled_x;
      // remove added height from container
      max_y = original_y + scaled_y - overflow_y;
      min_y = 0 + scaled_y;

      setCoor(-scaled_x, scaled_y);
      console.info(`x: ${x}, scaled_x: ${scaled_x}, y: ${y}, scaled_y: ${scaled_y}`)
      console.log(scale);
    }
    function setCoor(xx: number, yy: number) {
      x = Math.min(Math.max((last_x + xx), max_x), min_x);
      y = Math.min(Math.max((last_y + yy), max_y), min_y);
    }
    // xx && yy are for resetting the position when the scale return to 1.
    function transform(xx?: number, yy?: number) {
      elm.style.webkitTransform = `translate3d(${xx || x}px, ${yy || y}px, 0) scale3d(${scale}, ${scale}, 1)`;
    }

  }

  public _pinchZoom(elm: HTMLElement, content: Content): void {
    const _gesture = new Gesture(elm);
    // max translate x = (container_width - element absolute_width)px
    // max translate y = (container_height - element absolute_height)px
    let ow = 0;
    let oh = 0;
    for (let i = 0; i < elm.children.length; i++) {
      let c = <HTMLElement>elm.children.item(i);
      ow = c.offsetWidth;
      oh += c.offsetHeight;
    }
    const original_x = content.contentWidth - ow;
    const original_y = content.contentHeight - oh;
    let max_x = original_x;
    let max_y = original_y;
    let min_x = 0;
    let min_y = 0;
    let x = 0;
    let y = 0;
    let last_x = 0;
    let last_y = 0;
    let scale = this.scales;
    let base = scale;

    _gesture.listen();
    _gesture.on('pan', onPan);
    _gesture.on('panend', onPanend);
    _gesture.on('pancancel', onPanend);
    _gesture.on('tap', onTap);
    _gesture.on('pinch', onPinch);
    _gesture.on('pinchend', onPinchend);
    _gesture.on('pinchcancel', onPinchend);


    function onPan(ev) {
      setCoor(ev.deltaX, ev.deltaY);
      transform();
    }
    function onPanend() {
      // remembers previous position to continue panning.
      last_x = x;
      last_y = y;
    }
    function onTap(ev) {

      //for desktop, detect left click only to zoom
      if (ev.tapCount === 2) {
        let reset = false;
        scale += .5;
        if (scale > 2) {
          scale = 1;
          reset = true;
        }

        setBounds();
        // reset ? transform(max_x / 2, max_y / 2) : transform();
        reset ? transform(0 / 2, 0 / 2) : transform();
      }

    }

    function onPinch(ev) {
      // formula to append scale to new scale
      scale = base + (ev.scale * scale - scale) / scale

      setBounds();
      transform();
    }
    function onPinchend(ev) {
      if (scale > 4) {
        scale = 4;
      }
      if (scale < 0.5) {
        scale = 0.5;
      }
      // lets pinch know where the new base will start
      base = scale;
      setBounds();
      transform();
    }
    function setBounds() {
      // I am scaling the container not the elements
      // since container is fixed, the container scales from the middle, while the
      // content scales down and right, with the top and left of the container as boundaries
      // scaled = absolute width * scale - already set width divided by 2;
      let scaled_x = Math.ceil((elm.offsetWidth * scale - elm.offsetWidth) / 2);
      let scaled_y = Math.ceil((elm.offsetHeight * scale - elm.offsetHeight) / 2);
      // for max_x && max_y; adds the value relevant to their overflowed size
      let overflow_x = Math.ceil(original_x * scale - original_x); // returns negative
      let overflow_y = Math.ceil(oh * scale - oh);

      max_x = original_x - scaled_x + overflow_x;
      min_x = 0 + scaled_x;
      // remove added height from container
      max_y = original_y + scaled_y - overflow_y;
      min_y = 0 + scaled_y;

      setCoor(-scaled_x, scaled_y);
      console.info(`x: ${x}, scaled_x: ${scaled_x}, y: ${y}, scaled_y: ${scaled_y}`)
      console.log(scale);
    }
    function setCoor(xx: number, yy: number) {
      x = Math.min(Math.max((last_x + xx), max_x), min_x);
      y = Math.min(Math.max((last_y + yy), max_y), min_y);
    }
    // xx && yy are for resetting the position when the scale return to 1.
    function transform(xx?: number, yy?: number) {
      elm.style.webkitTransform = `translate3d(${xx || x}px, ${yy || y}px, 0) scale3d(${scale}, ${scale}, 1)`;
    }
  }
}
