import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceSummary } from './finance-summary';

describe('FinanceSummary', () => {
  let component: FinanceSummary;
  let fixture: ComponentFixture<FinanceSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(FinanceSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
