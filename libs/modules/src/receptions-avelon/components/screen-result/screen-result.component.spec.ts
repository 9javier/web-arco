import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenResultComponent } from './screen-result.component';

describe('ScreenResultComponent', () => {
  let component: ScreenResultComponent;
  let fixture: ComponentFixture<ScreenResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
