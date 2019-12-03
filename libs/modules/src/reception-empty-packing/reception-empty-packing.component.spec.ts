import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionEmptyPackingComponent } from './reception-empty-packing.component';

describe('ReceptionEmptyPackingComponent', () => {
  let component: ReceptionEmptyPackingComponent;
  let fixture: ComponentFixture<ReceptionEmptyPackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceptionEmptyPackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionEmptyPackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
