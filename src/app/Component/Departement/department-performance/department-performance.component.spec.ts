import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentPerformanceComponent } from './department-performance.component';

describe('DepartmentPerformanceComponent', () => {
  let component: DepartmentPerformanceComponent;
  let fixture: ComponentFixture<DepartmentPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentPerformanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
