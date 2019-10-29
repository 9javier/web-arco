import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SorterActionsEmptyingComponent } from './actions';

describe('SorterActionsEmptyingComponent', () => {
  let component: SorterActionsEmptyingComponent;
  let fixture: ComponentFixture<SorterActionsEmptyingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SorterActionsEmptyingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SorterActionsEmptyingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
