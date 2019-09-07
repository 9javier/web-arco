import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffSGAComponent } from './tariffSGA.component';

describe('TariffComponent', () => {
  let component: TariffSGAComponent;
  let fixture: ComponentFixture<TariffSGAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TariffSGAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TariffSGAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
