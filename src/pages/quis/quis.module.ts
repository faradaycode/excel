import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuisPage } from './quis';

@NgModule({
  declarations: [
    QuisPage,
  ],
  imports: [
    IonicPageModule.forChild(QuisPage)
  ],
})
export class QuisPageModule {}
