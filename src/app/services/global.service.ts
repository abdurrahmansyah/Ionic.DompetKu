import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  IndexPageData: IndexPage;
  jenisKategoriData: JenisKategoriData;
  pageIndex: JenisKategoriData;

  kategoriDataList: KategoriData[] = [];
  transaksiDataList: TransaksiData[] = [];
  laporanTransaksiDataListInDay: TransaksiDataInDay[] = [];
  laporanTransaksiDataListInMonth: TransaksiDataInMonth[] = [];

  constructor(private alertController: AlertController,
    private toastController: ToastController) {
    this.IndexPageData = new IndexPage();
    this.jenisKategoriData = new JenisKategoriData();
  }

  public async GetDataFromStorage(): Promise<Boolean> {

    var kategoriDataList = (await Storage.get({ key: 'kategoriDataList' })).value;
    if (kategoriDataList)
      this.kategoriDataList = JSON.parse(kategoriDataList);
    // console.log('kategoriDataList from storage', this.kategoriDataList);

    var transaksiDataList = (await Storage.get({ key: 'transaksiDataList' })).value;
    if (transaksiDataList)
      this.transaksiDataList = JSON.parse(transaksiDataList);
    // console.log('transaksiDataList from storage', this.transaksiDataList);

    this.LoadAndReloadAllTransaksiDataList();

    return true;
  }

  public LoadAndReloadAllTransaksiDataList() {
    // console.log('transaksiDataList', this.transaksiDataList);
    this.laporanTransaksiDataListInDay = [];
    this.laporanTransaksiDataListInMonth = [];
    
    this.transaksiDataList = this.transaksiDataList.sort((a, b) => {
      return b.tanggal - a.tanggal;
    })

    //
    var tanggalList = [...new Set(this.transaksiDataList.map(x => x.tanggalString))];
    tanggalList.forEach((x: string) => {
      var laporanTransaksiDataListInDay = this.transaksiDataList.filter(y => { return y.tanggalString == x });

      var transaksiDataInDay = new TransaksiDataInDay();
      transaksiDataInDay.transaksiInDay = x;
      transaksiDataInDay.transaksiDataList = laporanTransaksiDataListInDay;

      this.laporanTransaksiDataListInDay.push(transaksiDataInDay)
    });
    // console.log('laporanTransaksiDataListInDay', this.laporanTransaksiDataListInDay);
    //

    var filterBulanTahun = [...new Set(this.laporanTransaksiDataListInDay.map(x => (this.GetDate(x.transaksiInDay).szMonth + " " + this.GetDate(x.transaksiInDay).decYear).toString()))];
    filterBulanTahun.forEach((x: string) => {
      var laporanTransaksiDataListInMonth = this.laporanTransaksiDataListInDay.filter(y => (this.GetDate(y.transaksiInDay).szMonth + " " + this.GetDate(y.transaksiInDay).decYear) == x);

      var transaksiDataInMonth = new TransaksiDataInMonth();
      transaksiDataInMonth.filterBulanTahun = x;
      transaksiDataInMonth.transaksiDataListInDay = laporanTransaksiDataListInMonth;

      this.laporanTransaksiDataListInMonth.push(transaksiDataInMonth)
    });
    // console.log('laporanTransaksiDataListInMonth', this.laporanTransaksiDataListInMonth);

    this.transaksiDataList.forEach(transaksiData => {
    });
  }

  public GetDate(param?): DateData {
    var dateData = new DateData();
    var months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    // var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    if (param) var date = new Date(param);
    else var date = new Date();

    dateData.date = date;
    dateData.decYear = date.getFullYear();
    dateData.szMonth = months[date.getMonth()];
    dateData.decMonth = date.getMonth() + 1;
    dateData.decDate = date.getDate();
    dateData.szDay = days[date.getDay()];
    dateData.decMinute = date.getMinutes();
    dateData.szMinute = dateData.decMinute < 10 ? "0" + dateData.decMinute : dateData.decMinute.toString();
    dateData.decHour = date.getHours();
    dateData.szHour = dateData.decHour < 10 ? "0" + dateData.decHour : dateData.decHour.toString();
    dateData.decSec = date.getSeconds();
    dateData.szAMPM = dateData.decHour > 12 ? "PM" : "AM";

    return dateData;
  }

  PresentAlert(msg: string) {
    this.alertController.create({
      mode: 'ios',
      message: msg,
      buttons: ['OK']
    }).then(alert => {
      return alert.present();
    });
  }

  async PresentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: "dark",
      mode: "ios"
    });
    toast.present();
  }
}

export class IndexPage {
  public readonly Home: string = "Home";
  public readonly MenuKategori: string = "Menu Kategori";
  public readonly RiwayatTransaksi: string = "Riwayat Transaksi Terakhir";
  public readonly LaporanBulanan: string = "Laporan Bulanan";
  public readonly Tentang: string = "Tentang";
}

export class DateData {
  public date: Date;
  public szDay: string;
  public decDate: number;
  public szMonth: string;
  public decYear: number;
  public decHour: number;
  public szHour: string;
  public decMinute: number;
  public szMinute: string;
  public szAMPM: string;
  public decSec: number;
  public decMonth: number;

  constructor() { }
}

export class JenisKategoriData {
  public readonly pemasukan: string = "Pemasukan";
  public readonly pengeluaran: string = "Pengeluaran";
}

export class KategoriData {
  public namaKategori: string;
  public jenisKategori: string;

  constructor() { }
}

export class TransaksiData {
  public namaTransaksi: string;
  public jenisKategori: string;
  public kategori: string;
  public nominal: number;
  public nominalString: string;
  public tanggal: number;
  public tanggalString: string;
  public ket: string;

  constructor() { }
}

export class TransaksiDataInMonth {
  public filterBulanTahun: string;
  public transaksiDataListInDay: TransaksiDataInDay[];

  constructor() { }
}

export class TransaksiDataInDay {
  public transaksiInDay: string;
  public transaksiDataList: TransaksiData[];

  constructor() { }
}