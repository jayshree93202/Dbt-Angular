import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeDetailsPresentation } from './scheme-details-presentation';

describe('SchemeDetailsPresentation', () => {
  let component: SchemeDetailsPresentation;
  let fixture: ComponentFixture<SchemeDetailsPresentation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemeDetailsPresentation],
    }).compileComponents();

    fixture = TestBed.createComponent(SchemeDetailsPresentation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
