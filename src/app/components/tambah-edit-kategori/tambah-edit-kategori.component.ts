import { Component, OnInit } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { ModalController, NavParams } from '@ionic/angular';
import { GlobalService, KategoriData } from 'src/app/services/global.service';

@Component({
  selector: 'app-tambah-edit-kategori',
  templateUrl: './tambah-edit-kategori.component.html',
  styleUrls: ['./tambah-edit-kategori.component.scss'],
})
export class TambahEditKategoriComponent implements OnInit {

  public namaKategori: string;
  public jenisKategori: string;

  public isTambahKategori: boolean = false;

  constructor(private navParams: NavParams,
    private globalService: GlobalService,
    private modalController: ModalController) { }

  ngOnInit() {
    var aksiKategori = this.navParams.get('aksiKategori');
    if (aksiKategori == 'tambah')
      this.isTambahKategori = true;
    else {
      this.isTambahKategori = false;
      var kategoriData = this.navParams.get('kategoriData');
      this.namaKategori = kategoriData.namaKategori;
      this.jenisKategori = kategoriData.jenisKategori;
    }
  }

  public async TambahKategori() {
    if (!this.namaKategori || !this.jenisKategori) {
      this.globalService.PresentAlert('Silahkan lengkapi data isian terlebih dahulu');
    } else {
      var kategoriData = new KategoriData();
      kategoriData.namaKategori = this.namaKategori;
      kategoriData.jenisKategori = this.jenisKategori;

      var isAnyMatchDataFromExist = this.globalService.kategoriDataList.filter(kategori => {
        return kategori.namaKategori.toUpperCase() === kategoriData.namaKategori.toUpperCase() &&
          kategori.jenisKategori.toUpperCase() === kategoriData.jenisKategori.toUpperCase()
      });

      if (isAnyMatchDataFromExist.length > 0) {
        this.globalService.PresentAlert('Data Kategori sudah ada');
      } else {
        this.globalService.kategoriDataList.push(kategoriData);

        await Storage.set({ key: 'kategoriDataList', value: JSON.stringify(this.globalService.kategoriDataList) });

        this.modalController.dismiss(
          { dataPassing: "BerhasilCreate" },
          'confirm'
        );
      }
    }
  }

  public async EditKategori() {
    if (!this.namaKategori || !this.jenisKategori) {
      this.globalService.PresentAlert('Silahkan lengkapi data isian terlebih dahulu');
    } else {
      var kategoriData = new KategoriData();
      kategoriData.namaKategori = this.namaKategori;
      kategoriData.jenisKategori = this.jenisKategori;

      var isAnyMatchDataFromExist = this.globalService.kategoriDataList.filter(kategori => {
        return kategori.namaKategori.toUpperCase() === kategoriData.namaKategori.toUpperCase() &&
          kategori.jenisKategori.toUpperCase() === kategoriData.jenisKategori.toUpperCase()
      });

      if (isAnyMatchDataFromExist.length > 0) {
        this.globalService.PresentAlert('Data Kategori sudah ada');
      } else {
        var oldKategoriData = this.navParams.get('kategoriData');

        const index = this.globalService.kategoriDataList.findIndex(kategori => kategori.namaKategori.toUpperCase() == oldKategoriData.namaKategori.toUpperCase() &&
          kategori.jenisKategori.toUpperCase() == oldKategoriData.jenisKategori.toUpperCase());
        console.log(index);
  
        this.globalService.kategoriDataList.splice(index, 1, kategoriData);
  
        await Storage.set({ key: 'kategoriDataList', value: JSON.stringify(this.globalService.kategoriDataList) });
  
        this.modalController.dismiss(
          { dataPassing: "BerhasilEdit" },
          'confirm'
        );
      }
    }
  }

  public CloseTambahEditKategori(){
    this.modalController.dismiss(
      { dataPassing: "JUSTCANCEL" },
      'backdrop'
    );
  }

}
