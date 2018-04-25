import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MainmenuPage } from './mainmenu';

@NgModule({
  declarations: [
    MainmenuPage,
  ],
  imports: [
    IonicPageModule.forChild(MainmenuPage),
  ],
})
export class MainmenuPageModule {}
