import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionFinalComponent } from './reception-final.component';

describe('ListNewProductsComponent', () => {
  let component: ReceptionFinalComponent;
  let fixture: ComponentFixture<ReceptionFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceptionFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
