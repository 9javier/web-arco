import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SccanerProductComponent } from './sccaner-product.component';

describe('SccanerProductComponent', () => {
  let component: SccanerProductComponent;
  let fixture: ComponentFixture<SccanerProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SccanerProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SccanerProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
