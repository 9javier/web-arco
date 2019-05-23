import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtitleListWorkwavesComponent } from './list-subtitle.component';

describe('SubtitleListWorkwavesComponent', () => {
  let component: SubtitleListWorkwavesComponent;
  let fixture: ComponentFixture<SubtitleListWorkwavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtitleListWorkwavesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtitleListWorkwavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
