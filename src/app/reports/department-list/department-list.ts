import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbtService, Department } from '../../core/services/dbt';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department-list.html',
  styleUrl: './department-list.css'
})
export class DepartmentListComponent implements OnInit {

  departments: Department[] = [];
  loading = false;

  constructor(private dbtService: DbtService) {}

  ngOnInit(): void {
    this.getDepartments();
  }

  getDepartments(): void {
    this.loading = true;

    this.dbtService.getDepartment().subscribe({
      next: (response) => {
        console.log('Department API Response:', response);

        if (response.status === 'true') {debugger
          this.departments = response.data || [];
        } else {
          this.departments = [];
        }

        this.loading = false;
      },

      error: (error) => {
        console.error('Department API Error:', error);
        this.departments = [];
        this.loading = false;
      }
    });
  }
}