import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStandings } from './admin-standings';

describe('AdminStandings', () => {
  let component: AdminStandings;
  let fixture: ComponentFixture<AdminStandings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStandings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminStandings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
