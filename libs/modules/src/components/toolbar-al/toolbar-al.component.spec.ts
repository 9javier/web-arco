import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarAlComponent } from './toolbar-al.component';

describe('ToolbarAlComponent', () => {
  let component: ToolbarAlComponent;
  let fixture: ComponentFixture<ToolbarAlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarAlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarAlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
