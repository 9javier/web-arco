import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidencesManualComponent } from './incidences-manual.component';

describe('ProductsAvelonComponent', () => {
  let component: IncidencesManualComponent;
  let fixture: ComponentFixture<IncidencesManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IncidencesManualComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidencesManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
