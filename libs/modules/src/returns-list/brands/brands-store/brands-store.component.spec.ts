import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsStoreComponent } from './store.component';

describe('StoreComponent', () => {
  let component: BrandsStoreComponent;
  let fixture: ComponentFixture<BrandsStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandsStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandsStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
