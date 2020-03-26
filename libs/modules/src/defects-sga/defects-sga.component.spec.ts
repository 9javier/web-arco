import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectsSgaComponent } from './defects-sga.component';

describe('IncidentsComponent', () => {
  let component: DefectsSgaComponent;
  let fixture: ComponentFixture<DefectsSgaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefectsSgaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectsSgaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
