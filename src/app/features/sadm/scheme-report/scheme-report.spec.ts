import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeReport } from './scheme-report';

describe('SchemeReport', () => {
  let component: SchemeReport;
  let fixture: ComponentFixture<SchemeReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemeReport],
    }).compileComponents();

    fixture = TestBed.createComponent(SchemeReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
