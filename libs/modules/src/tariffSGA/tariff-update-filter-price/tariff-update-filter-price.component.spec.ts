import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffUpdateFilterPriceComponent } from './tariff-update-filter-price.component';

describe('TariffUpdateFilterPriceComponent', () => {
  let component: TariffUpdateFilterPriceComponent;
  let fixture: ComponentFixture<TariffUpdateFilterPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TariffUpdateFilterPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TariffUpdateFilterPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
