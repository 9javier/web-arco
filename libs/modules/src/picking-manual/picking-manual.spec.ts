import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickingManualComponent } from './picking-manual.component';

describe('PickingManualComponent', () => {
  let component: PickingManualComponent;
  let fixture: ComponentFixture<PickingManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PickingManualComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickingManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
