import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionsAvelonComponent } from './receptions-avelon.component';

describe('ReceptionsAvelonComponent', () => {
  let component: ReceptionsAvelonComponent;
  let fixture: ComponentFixture<ReceptionsAvelonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceptionsAvelonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionsAvelonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
