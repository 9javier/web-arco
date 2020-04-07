import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualReceptionComponent } from './manual-reception.component';

describe('ManualReceptionComponent', () => {
  let component: ManualReceptionComponent;
  let fixture: ComponentFixture<ManualReceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualReceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
