import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  DbtService,
  Department,
  FinancialYear
} from '../../core/services/dbt';


@Component({
  selector: 'app-department-wise-scheme-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './department-wise-scheme-list.html',
  styleUrl: './department-wise-scheme-list.css'
})
export class DepartmentWiseSchemeListComponent implements OnInit {

  departments: Department[] = [];

  financialYears: FinancialYear[] = [];

  selectedFYear: string = '';
  schemes: any[] = [];
selectedDepartment: string = '';

  loading = false;

  constructor(private dbtService: DbtService) {}

  ngOnInit(): void {
    this.getFinancialYears();
    this.getDepartments();
  }


  // Financial Year API
  getFinancialYears(): void {debugger

    this.dbtService.getFinancialYears().subscribe({

      next: (response) => {

        console.log('Financial Year Response:', response);

        if (response.status === 'true') {debugger

          this.financialYears = response.data || [];

        } else {

          this.financialYears = [];

        }

      },

      error: (error) => {

        console.error(
          'Financial Year API Error:',
          error
        );

        this.financialYears = [];

      }

    });

  }


   // Department API
  getDepartments(): void {

    this.loading = true;

    this.dbtService.getDepartment().subscribe({

      next: (response) => {

        console.log('Department API Response:', response);

        if (response.status === 'true') {
          this.departments = response.data || [];
        } else {
          this.departments = [];
        }

        this.loading = false;

      },

      error: (error) => {

        console.error(
          'Department API Error:',
          error
        );

        this.departments = [];

        this.loading = false;

      }

    });
  }

  onFilterChange(): void {

    // If both filters are not selected, don't call API
    if (!this.selectedFYear || !this.selectedDepartment) {
      this.schemes = [];
      return;
    }

    this.getSchemeList();
  }

  getSchemeList(): void {

    this.loading = true;

    const fYear = Number(this.selectedFYear);
    const departmentCode = Number(this.selectedDepartment);

    console.log('Getting schemes:', {
      fYear,
      departmentCode
    });

    this.dbtService
      .getDepartmentSchemeList(departmentCode, fYear)
      .subscribe({
        next: (response) => {

          console.log('Scheme List Response:', response);

          this.schemes = response?.data || response || [];

          this.loading = false;
        },

        error: (error) => {

          console.error('Scheme List API Error:', error);

          this.schemes = [];

          this.loading = false;
        }
      });
  }


}