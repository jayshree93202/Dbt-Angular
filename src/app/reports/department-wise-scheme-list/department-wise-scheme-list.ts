import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DbtService,
  Department,
  FinancialYear,
  DepartmentScheme
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
  selectedDepartment: string = '';
  reportFilter: 'all' | 'reported' | 'never' = 'all';
  searchTerm: string = '';

  allSchemes: DepartmentScheme[] = [];
  filteredSchemes: DepartmentScheme[] = [];
  paginatedSchemes: DepartmentScheme[] = [];

  loading: boolean = false;
  isFilterLoading: boolean = false;

  // Pagination State
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  totalRecords: number = 0;

  constructor(private dbtService: DbtService) {}

  ngOnInit(): void {
    this.loadFilterOptions();
    this.getSchemeList();
  }

  loadFilterOptions(): void {
    this.isFilterLoading = true;

    // 1. Fetch Financial Years
    this.dbtService.getFinancialYears().subscribe({
      next: (response: any) => {
        if (response && (response.status === 'true' || `${response.status}` === 'true')) {
          this.financialYears = response.data || [];
        } else if (Array.isArray(response)) {
          this.financialYears = response;
        } else {
          this.financialYears = [];
        }
      },
      error: (error: any) => {
        console.error('Financial Year API Error:', error);
        this.financialYears = [];
      }
    });

    // 2. Fetch Departments
    this.dbtService.getDepartment().subscribe({
      next: (response: any) => {
        if (response && (response.status === 'true' || `${response.status}` === 'true')) {
          this.departments = response.data || [];
        } else if (Array.isArray(response)) {
          this.departments = response;
        } else {
          this.departments = [];
        }
        this.isFilterLoading = false;
      },
      error: (error: any) => {
        console.error('Department API Error:', error);
        this.departments = [];
        this.isFilterLoading = false;
      }
    });
  }

  getSchemeList(): void {
    this.loading = true;

    const fYear = Number(this.selectedFYear) || 0;
    const departmentCode = Number(this.selectedDepartment) || 0;

    this.dbtService.getDepartmentSchemeList(departmentCode, fYear).subscribe({
      next: (response: any) => {
        let data: DepartmentScheme[] = [];
        if (Array.isArray(response)) {
          data = response;
        } else if (response?.data && Array.isArray(response.data)) {
          data = response.data;
        } else if (response?.value && Array.isArray(response.value)) {
          data = response.value;
        }

        this.allSchemes = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Scheme List API Error:', error);
        this.allSchemes = [];
        this.filteredSchemes = [];
        this.paginatedSchemes = [];
        this.totalRecords = 0;
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.getSchemeList();
  }

  onReportFilterChange(filter: 'all' | 'reported' | 'never'): void {
    this.reportFilter = filter;
    this.currentPage = 1;
    this.applyFilter();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilter();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearchChange();
  }

  resetAllFilters(): void {
    this.selectedFYear = '';
    this.selectedDepartment = '';
    this.reportFilter = 'all';
    this.searchTerm = '';
    this.currentPage = 1;
    this.getSchemeList();
  }

  isNeverReported(scheme: DepartmentScheme): boolean {
    const date = scheme.lastUpdateDate;
    return !date || date.trim() === '' || date.trim().toUpperCase() === 'N/A' || date.trim().toLowerCase() === 'null';
  }

  applyFilter(): void {
    let result = [...this.allSchemes];

    // Filter by Reported / Never Reported
    if (this.reportFilter === 'reported') {
      result = result.filter(s => !this.isNeverReported(s));
    } else if (this.reportFilter === 'never') {
      result = result.filter(s => this.isNeverReported(s));
    }

    // Filter by Search Term
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.trim().toLowerCase();
      result = result.filter(s =>
        (s.schemeName && s.schemeName.toLowerCase().includes(term)) ||
        (s.name && s.name.toLowerCase().includes(term)) ||
        (s.dbtSchemeCode && s.dbtSchemeCode.toLowerCase().includes(term)) ||
        (s.schemeType && s.schemeType.toLowerCase().includes(term)) ||
        (s.lastUpdateDate && s.lastUpdateDate.toLowerCase().includes(term))
      );
    }

    this.filteredSchemes = result;
    this.totalRecords = this.filteredSchemes.length;
    this.updatePaginatedData();
  }

  // =========================================
  // PAGINATION METHODS
  // =========================================

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  get startIndex(): number {
    if (this.totalRecords === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  updatePaginatedData(): void {
    const maxPage = this.totalPages;
    if (this.currentPage > maxPage) {
      this.currentPage = maxPage;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + Number(this.pageSize);
    this.paginatedSchemes = this.filteredSchemes.slice(start, end);
  }

  goToPage(page: number | string): void {
    const pageNum = Number(page);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= this.totalPages && pageNum !== this.currentPage) {
      this.currentPage = pageNum;
      this.updatePaginatedData();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  firstPage(): void {
    if (this.currentPage !== 1) {
      this.currentPage = 1;
      this.updatePaginatedData();
    }
  }

  lastPage(): void {
    if (this.currentPage !== this.totalPages) {
      this.currentPage = this.totalPages;
      this.updatePaginatedData();
    }
  }

  onPageSizeChange(): void {
    this.pageSize = Number(this.pageSize);
    this.currentPage = 1;
    this.updatePaginatedData();
  }

  getPageNumbers(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      pages.push(current - 1);
      pages.push(current);
      pages.push(current + 1);
      pages.push('...');
      pages.push(total);
    }

    return pages;
  }

  downloadExcel(): void {
    if (!this.filteredSchemes || this.filteredSchemes.length === 0) {
      return;
    }

    const headers = ['Sr. No.', 'Department', 'Scheme Type', 'Scheme Name', 'DBT Scheme Code', 'Last Updated'];
    const rows = this.filteredSchemes.map((s, index) => {
      const deptName = (s.name || '').replace(/"/g, '""');
      const schemeType = (s.schemeType || '').replace(/"/g, '""');
      const schemeName = (s.schemeName || '').replace(/"/g, '""');
      const dbtCode = (s.dbtSchemeCode || '').replace(/"/g, '""');
      const lastUpdate = (s.lastUpdateDate || 'N/A').replace(/"/g, '""');
      return `"${index + 1}","${deptName}","${schemeType}","${schemeName}","${dbtCode}","${lastUpdate}"`;
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Department_Wise_Scheme_List_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}