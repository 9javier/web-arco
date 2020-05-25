import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReturnsHistoricComponent } from './returns-historic.component';

describe('ReturnsHistoricComponent', () => {
  let component: ReturnsHistoricComponent;
  let fixture: ComponentFixture<ReturnsHistoricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnsHistoricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnsHistoricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
