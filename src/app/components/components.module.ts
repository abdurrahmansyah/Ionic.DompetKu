import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TambahEditKategoriComponent } from './tambah-edit-kategori/tambah-edit-kategori.component';
import { TambahEditTransaksiComponent } from './tambah-edit-transaksi/tambah-edit-transaksi.component';

@NgModule({
  declarations: [TambahEditKategoriComponent, TambahEditTransaksiComponent],
  exports: [TambahEditKategoriComponent, TambahEditTransaksiComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
