import { Component, OnInit } from '@angular/core';
import { CentralScheme, DbtService } from '../../core/services/dbt'
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-department-cssandstate-scheme-list',
  templateUrl: './department-cssandstate-scheme-list.html',
  imports: [CommonModule],
  styleUrls: ['./department-cssandstate-scheme-list.css']
})


export class DepartmentCssandstateSchemeListComponent implements OnInit {

  schemeList: CentralScheme[] = [];

  isLoading = false;

  constructor(
    private schemeService: DbtService
  ) {}

  ngOnInit(): void {
    this.GetDepartmentCentralSchemeList();
  }

  GetDepartmentCentralSchemeList(): void {

    this.isLoading = true;

    this.schemeService.GetDepartmentCentralSchemeList()
      .subscribe({
        next: (response: CentralScheme[]) => {

          console.log('API Response:', response);
          console.log('Scheme count:', response.length);

          this.schemeList = response;

          this.isLoading = false;
        },

        error: (error) => {

          console.error(
            'Error while getting scheme list:',
            error
          );

          this.schemeList = [];
          this.isLoading = false;
        }
      });
  }
}