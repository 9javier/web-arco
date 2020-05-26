import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DefectiveProductsComponent } from './defective-products.component';

describe('DefectiveProductsComponent', () => {
  let component: DefectiveProductsComponent;
  let fixture: ComponentFixture<DefectiveProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefectiveProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectiveProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
