import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityStocksComponent } from './security-stocks.component';

describe('SecurityStocksComponent', () => {
  let component: SecurityStocksComponent;
  let fixture: ComponentFixture<SecurityStocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityStocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
