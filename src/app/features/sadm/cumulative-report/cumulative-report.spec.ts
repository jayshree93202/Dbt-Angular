import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CumulativeReport } from './cumulative-report';

describe('CumulativeReport', () => {
  let component: CumulativeReport;
  let fixture: ComponentFixture<CumulativeReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CumulativeReport],
    }).compileComponents();

    fixture = TestBed.createComponent(CumulativeReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
