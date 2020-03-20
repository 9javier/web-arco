import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsDataComponent } from './data.component';

describe('DataComponent', () => {
  let component: BrandsDataComponent;
  let fixture: ComponentFixture<BrandsDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandsDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
