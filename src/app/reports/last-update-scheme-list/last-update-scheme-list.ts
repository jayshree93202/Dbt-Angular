import { Component, OnInit } from '@angular/core';
import { DbtService as SchemeService } from '../../core/services/dbt';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-last-update-scheme-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './last-update-scheme-list.html',
  styleUrl: './last-update-scheme-list.css'
})
export class LastUpdateSchemeListComponent  implements OnInit {

  lastUpdateSchemeList: any[] = [];
  loading: boolean = false;
  filteredSchemeList: any[] = [];
  departments: string[] = [];
  filteredSchemes: string[] = [];
  selectedDepartment: string = '';
  selectedScheme: string = '';

  constructor(private schemeService: SchemeService) {}







  ngOnInit(): void {
    this.GetLastUpdateScheme();
  }

    onDepartmentChange(): void {

  if (this.selectedDepartment === '') {

    this.filteredSchemes = [
      ...new Set(
        this.lastUpdateSchemeList.map(
          (x: any) => x.SchemeName
        )
      )
    ];

  } else {

    this.filteredSchemes = [
      ...new Set(
        this.lastUpdateSchemeList
          .filter(
            (x: any) =>
              x.DepartmentName === this.selectedDepartment
          )
          .map(
            (x: any) => x.SchemeName
          )
      )
    ];
  }

  this.selectedScheme = '';
}

searchScheme(): void {

  this.filteredSchemeList = this.lastUpdateSchemeList.filter(
    (item: any) => {

      const departmentMatch =
        !this.selectedDepartment ||
        item.DepartmentName === this.selectedDepartment;

      const schemeMatch =
        !this.selectedScheme ||
        item.SchemeName === this.selectedScheme;

      return departmentMatch && schemeMatch;
    }
  );
}

    onFilterChange(): void {

    // If both filters are not selected, don't call API
    if (!this.selectedScheme || !this.selectedDepartment) {
      this.departments = [];
      return;
    }

    this.GetLastUpdateScheme();
  }

  GetLastUpdateScheme(): void {

    this.loading = true;

    this.schemeService.GetLastUpdateScheme().subscribe({
      
      next: (response: any) => {

        console.log('GetLastUpdateScheme Response:', response);

        this.lastUpdateSchemeList = response;

        this.loading = false;
      },

      error: (error: any) => {

        console.error('GetLastUpdateScheme Error:', error);

        this.lastUpdateSchemeList = [];
        this.loading = false;
      }
    });
  }


}
