import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamagedShoesComponent } from './damaged-shoes.component';

describe('DamagedShoesComponent', () => {
  let component: DamagedShoesComponent;
  let fixture: ComponentFixture<DamagedShoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamagedShoesComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamagedShoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
