import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionsAvelonAppComponent } from './receptions-avelon-app.component';

describe('ReceptionsAvelonAppComponent', () => {
  let component: ReceptionsAvelonAppComponent;
  let fixture: ComponentFixture<ReceptionsAvelonAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceptionsAvelonAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionsAvelonAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
