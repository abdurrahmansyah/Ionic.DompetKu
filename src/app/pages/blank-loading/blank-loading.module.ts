import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlankLoadingPageRoutingModule } from './blank-loading-routing.module';

import { BlankLoadingPage } from './blank-loading.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlankLoadingPageRoutingModule
  ],
  declarations: [BlankLoadingPage]
})
export class BlankLoadingPageModule {}
