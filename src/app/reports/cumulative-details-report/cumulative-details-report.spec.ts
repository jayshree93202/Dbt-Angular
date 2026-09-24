import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CumulativeDetailsReport } from './cumulative-details-report';

describe('CumulativeDetailsReport', () => {
  let component: CumulativeDetailsReport;
  let fixture: ComponentFixture<CumulativeDetailsReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CumulativeDetailsReport],
    }).compileComponents();

    fixture = TestBed.createComponent(CumulativeDetailsReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
