import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@capacitor/storage';
import { ModalController, NavParams } from '@ionic/angular';
import { GlobalService, KategoriData, TransaksiData } from 'src/app/services/global.service';

@Component({
  selector: 'app-tambah-edit-transaksi',
  templateUrl: './tambah-edit-transaksi.component.html',
  styleUrls: ['./tambah-edit-transaksi.component.scss'],
})
export class TambahEditTransaksiComponent implements OnInit {
  credentials: FormGroup;
  kategoriList = [];
  isTambahTransaksi: boolean = false;

  // Temporary Data
  savedJenisKategori: string;

  constructor(private fb: FormBuilder,
    private globalService: GlobalService,
    private modalController: ModalController,
    private navParams: NavParams) {
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      namaTransaksi: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      jenisKategori: ['', [Validators.required]],
      kategori: ['', [Validators.required]],
      nominal: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      tanggal: [{ value: '', disabled: true }, [Validators.required]],
      ket: ['', [Validators.required]],
    });

    this.credentials.valueChanges.subscribe(data => this.onValueChanged(data));

    var aksiTransaksi = this.navParams.get('aksiTransaksi');
    if (aksiTransaksi == 'tambah')
      this.isTambahTransaksi = true;
    else {
      this.isTambahTransaksi = false;
      var transaksiData: TransaksiData = this.navParams.get('transaksiData');
      this.credentials.controls['namaTransaksi'].setValue(transaksiData.namaTransaksi);
      this.credentials.controls['jenisKategori'].setValue(transaksiData.jenisKategori);
      this.credentials.controls['kategori'].setValue(transaksiData.kategori);
      this.credentials.controls['nominal'].setValue(transaksiData.nominal);
      this.credentials.controls['tanggal'].setValue(transaksiData.tanggalString);
      this.credentials.controls['ket'].setValue(transaksiData.ket);
    }

  }

  onValueChanged(data?: any) {
    if (data.jenisKategori != this.savedJenisKategori) {
      this.savedJenisKategori = data.jenisKategori;
      this.kategoriList = [];
      this.credentials.controls['kategori'].setValue('');

      this.globalService.kategoriDataList.forEach(kategoriData => {
        if (kategoriData.jenisKategori == data.jenisKategori)
          this.kategoriList.push({ id: kategoriData.namaKategori });
      })
    }
  }

  public showdate(event?) {
    console.log(event);
    console.log(event.detail);
    console.log(event.detail.value);

    const formattedString = formatDate(event.detail.value, 'YYYY-MM-dd', 'en-US');
    this.credentials.controls['tanggal'].setValue(formattedString);
  }

  get jenisKategori() {
    return this.credentials.get('jenisKategori');
  }

  get kategori() {
    return this.credentials.get('kategori');
  }

  get namaTransaksi() {
    return this.credentials.get('namaTransaksi');
  }

  get nominal() {
    return this.credentials.get('nominal');
  }

  get tanggal() {
    return this.credentials.get('tanggal');
  }

  get ket() {
    return this.credentials.get('ket');
  }

  public async TambahTransaksi() {
    this.credentials.controls['tanggal'].enable();

    if (this.credentials.value.tanggal == undefined || this.credentials.value.tanggal == '') {
      this.globalService.PresentAlert('Tanggal tidak boleh kosong!');
      this.credentials.controls['tanggal'].disable();
    } else {
      var date = new Date(formatDate(this.credentials.value.tanggal, 'YYYY-MM-dd', 'en-US'));
      var format = this.credentials.value.nominal.toString().split('').reverse().join('');
      var convert = format.match(/\d{1,3}/g);

      var transaksiData = new TransaksiData();
      transaksiData.namaTransaksi = this.credentials.value.namaTransaksi;
      transaksiData.jenisKategori = this.credentials.value.jenisKategori;
      transaksiData.kategori = this.credentials.value.kategori;
      transaksiData.nominal = this.credentials.value.nominal;
      transaksiData.nominalString = 'Rp ' + convert.join('.').split('').reverse().join('');
      transaksiData.tanggal = date.valueOf();
      transaksiData.tanggalString = this.credentials.value.tanggal;
      transaksiData.ket = this.credentials.value.ket;

      this.globalService.transaksiDataList.push(transaksiData);

      await Storage.set({ key: 'transaksiDataList', value: JSON.stringify(this.globalService.transaksiDataList) });

      this.credentials.controls['tanggal'].disable();

      this.modalController.dismiss(
        { dataPassing: "BerhasilCreate" },
        'confirm'
      );
    }
  }

  public async EditTransaksi() {
    this.credentials.controls['tanggal'].enable();

    if (this.credentials.value.tanggal == undefined || this.credentials.value.tanggal == '') {
      this.globalService.PresentAlert('Tanggal tidak boleh kosong!');
      this.credentials.controls['tanggal'].disable();
    } else {
      var date = new Date(formatDate(this.credentials.value.tanggal, 'YYYY-MM-dd', 'en-US'));
      var format = this.credentials.value.nominal.toString().split('').reverse().join('');
      var convert = format.match(/\d{1,3}/g);

      var transaksiData = new TransaksiData();
      transaksiData.namaTransaksi = this.credentials.value.namaTransaksi;
      transaksiData.jenisKategori = this.credentials.value.jenisKategori;
      transaksiData.kategori = this.credentials.value.kategori;
      transaksiData.nominal = this.credentials.value.nominal;
      transaksiData.nominalString = 'Rp ' + convert.join('.').split('').reverse().join('');
      transaksiData.tanggal = date.valueOf();
      transaksiData.tanggalString = this.credentials.value.tanggal;
      transaksiData.ket = this.credentials.value.ket;

      var oldTransaksiData: TransaksiData = this.navParams.get('transaksiData');

      const index = this.globalService.transaksiDataList.findIndex(transaksi =>
        transaksi.namaTransaksi.toUpperCase() == oldTransaksiData.namaTransaksi.toUpperCase() &&
        transaksi.jenisKategori.toUpperCase() == oldTransaksiData.jenisKategori.toUpperCase() &&
        transaksi.kategori.toUpperCase() == oldTransaksiData.kategori.toUpperCase() &&
        transaksi.nominal == oldTransaksiData.nominal &&
        transaksi.nominalString.toUpperCase() == oldTransaksiData.nominalString.toUpperCase() &&
        transaksi.tanggal == oldTransaksiData.tanggal &&
        transaksi.tanggalString.toUpperCase() == oldTransaksiData.tanggalString.toUpperCase());
      console.log(index);

      this.globalService.transaksiDataList.splice(index, 1, transaksiData);

      await Storage.set({ key: 'transaksiDataList', value: JSON.stringify(this.globalService.transaksiDataList) });

      this.credentials.controls['tanggal'].disable();

      this.modalController.dismiss(
        { dataPassing: "BerhasilEdit" },
        'confirm'
      );
    }
  }

  public CloseTransaksi() {
    this.modalController.dismiss(
      { dataPassing: "JUSTCANCEL" },
      'backdrop'
    );
  }
}
