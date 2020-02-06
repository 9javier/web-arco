import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionssAvelonComponent } from './receptionss-avelon.component';

describe('ReceptionsAvelonComponent', () => {
  let component: ReceptionssAvelonComponent;
  let fixture: ComponentFixture<ReceptionssAvelonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceptionssAvelonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionssAvelonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
