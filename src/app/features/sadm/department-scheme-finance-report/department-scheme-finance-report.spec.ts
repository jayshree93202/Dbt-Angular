import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentSchemeFinanceReport } from './department-scheme-finance-report';

describe('DepartmentSchemeFinanceReport', () => {
  let component: DepartmentSchemeFinanceReport;
  let fixture: ComponentFixture<DepartmentSchemeFinanceReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentSchemeFinanceReport],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentSchemeFinanceReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
