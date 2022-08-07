import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { LoadingController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-blank-loading',
  templateUrl: './blank-loading.page.html',
  styleUrls: ['./blank-loading.page.scss'],
})
export class BlankLoadingPage implements OnInit {

  constructor(private loadingController: LoadingController,
    private globalService: GlobalService,
    private router: Router) {
    this.InitializeData();
  }

  async InitializeData() {
    const loading = await this.PresentLoading();

    if (await this.globalService.GetDataFromStorage()) {
      // await Storage.set({ key: BLANKPAGE_KEY, value: 'true' });
      await loading.dismiss();
      this.router.navigateByUrl('/folder/Home', { replaceUrl: true });
    }
  }

  private async PresentLoading() {
    const loading = await this.loadingController.create({
      mode: "ios",
      spinner: "circles"
    });
    await loading.present();
    return loading;
  }

  ngOnInit() {
  }
}
