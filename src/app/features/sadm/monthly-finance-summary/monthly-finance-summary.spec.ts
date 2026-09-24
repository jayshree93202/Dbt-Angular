import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyFinanceSummary } from './monthly-finance-summary';

describe('MonthlyFinanceSummary', () => {
  let component: MonthlyFinanceSummary;
  let fixture: ComponentFixture<MonthlyFinanceSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyFinanceSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthlyFinanceSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
