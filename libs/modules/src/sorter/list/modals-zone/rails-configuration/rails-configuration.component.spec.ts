import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RailsConfigurationComponent } from './rails-configuration.component';

describe('RailsConfigurationComponent', () => {
  let component: RailsConfigurationComponent;
  let fixture: ComponentFixture<RailsConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RailsConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RailsConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
