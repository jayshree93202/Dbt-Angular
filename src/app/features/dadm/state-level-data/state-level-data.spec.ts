import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateLevelData } from './state-level-data';

describe('StateLevelData', () => {
  let component: StateLevelData;
  let fixture: ComponentFixture<StateLevelData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateLevelData],
    }).compileComponents();

    fixture = TestBed.createComponent(StateLevelData);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
