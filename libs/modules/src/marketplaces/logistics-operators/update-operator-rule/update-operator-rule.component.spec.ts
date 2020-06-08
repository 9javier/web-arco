import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {UpdateOperatorRuleComponent} from "./update-operator-rule.component";

describe('UpdateOperatorRuleComponent', () => {
  let component: UpdateOperatorRuleComponent;
  let fixture: ComponentFixture<UpdateOperatorRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateOperatorRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateOperatorRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
