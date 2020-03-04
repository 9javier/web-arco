import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FabExtendedComponent } from './fab-extended.component';

describe('FabExtendedComponent', () => {
  let component: FabExtendedComponent;
  let fixture: ComponentFixture<FabExtendedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FabExtendedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabExtendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
