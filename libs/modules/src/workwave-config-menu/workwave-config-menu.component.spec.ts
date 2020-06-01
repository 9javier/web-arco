import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkwaveConfigMenuComponent } from './workwave-config-menu.component';

describe('WorkwaveConfigMenuComponent', () => {
  let component: WorkwaveConfigMenuComponent;
  let fixture: ComponentFixture<WorkwaveConfigMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkwaveConfigMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkwaveConfigMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
