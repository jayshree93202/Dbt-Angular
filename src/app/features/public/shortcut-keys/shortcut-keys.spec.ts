import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortcutKeys } from './shortcut-keys';

describe('ShortcutKeys', () => {
  let component: ShortcutKeys;
  let fixture: ComponentFixture<ShortcutKeys>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortcutKeys],
    }).compileComponents();

    fixture = TestBed.createComponent(ShortcutKeys);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
