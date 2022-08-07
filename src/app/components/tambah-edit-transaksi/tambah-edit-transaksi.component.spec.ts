import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TambahEditTransaksiComponent } from './tambah-edit-transaksi.component';

describe('TambahEditTransaksiComponent', () => {
  let component: TambahEditTransaksiComponent;
  let fixture: ComponentFixture<TambahEditTransaksiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TambahEditTransaksiComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TambahEditTransaksiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
