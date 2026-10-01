import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbtService as SchemeService, Department } from '../../core/services/dbt';

export interface SchemeOption {
  deptCode: number;
  schemeCode: string;
  schemeName: string;
}

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
export class LastUpdateSchemeListComponent implements OnInit {

  departments: Department[] = [];
  allSchemes: SchemeOption[] = [];
  filteredSchemes: SchemeOption[] = [];

  selectedDepartment: string = '';
  selectedScheme: string = '';
  searchTerm: string = '';

  lastUpdateSchemeList: any[] = [];
  filteredSchemeList: any[] = [];
  paginatedSchemeList: any[] = [];
  loading: boolean = false;

  // Pagination State
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  totalRecords: number = 0;

  constructor(private schemeService: SchemeService) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadInitialData();
  }

  loadDepartments(): void {
    this.schemeService.getDepartment().subscribe({
      next: (response: any) => {
        if (response?.status === 'true' || response?.status === true) {
          this.departments = response.data || [];
        } else if (Array.isArray(response)) {
          this.departments = response;
        } else if (response?.data && Array.isArray(response.data)) {
          this.departments = response.data;
        }
      },
      error: (error: any) => {
        console.error('Error fetching departments:', error);
        this.departments = [];
      }
    });
  }

  loadInitialData(): void {
    this.loading = true;

    // Call GetLastUpdateScheme with deptCode=0 and schemeCode='0' to get all records
    this.schemeService.GetLastUpdateScheme(0, '0').subscribe({
      next: (response: any) => {
        const records = Array.isArray(response) ? response : (response?.data || []);
        this.lastUpdateSchemeList = records;

        // Build list of unique schemes for dropdown
        const map = new Map<string, SchemeOption>();
        for (const item of records) {
          const code = (item.dbtSchemeCode || item.schemeCode || '').trim();
          const name = (item.schemeName || item.SchemeName || '').trim();
          const dept = item.deptCode || 0;
          if (code && !map.has(code)) {
            map.set(code, {
              deptCode: dept,
              schemeCode: code,
              schemeName: name
            });
          }
        }

        this.allSchemes = Array.from(map.values()).sort((a, b) =>
          a.schemeName.localeCompare(b.schemeName)
        );
        this.filteredSchemes = [...this.allSchemes];

        this.currentPage = 1;
        this.applyFilter();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('GetLastUpdateScheme Initial Load Error:', error);
        this.lastUpdateSchemeList = [];
        this.filteredSchemeList = [];
        this.paginatedSchemeList = [];
        this.totalRecords = 0;
        this.loading = false;
      }
    });
  }

  onDepartmentChange(): void {
    const deptCode = this.selectedDepartment ? Number(this.selectedDepartment) : 0;

    if (deptCode > 0) {
      this.filteredSchemes = this.allSchemes.filter(s => s.deptCode === deptCode);
    } else {
      this.filteredSchemes = [...this.allSchemes];
    }

    this.selectedScheme = '';
    this.searchScheme();
  }

  onSchemeChange(): void {
    this.searchScheme();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilter();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearchChange();
  }

  searchScheme(): void {
    const deptCode = this.selectedDepartment ? Number(this.selectedDepartment) : 0;
    const schemeCode = (this.selectedScheme && this.selectedScheme.trim() !== '') ? this.selectedScheme.trim() : '0';

    this.loading = true;

    this.schemeService.GetLastUpdateScheme(deptCode, schemeCode).subscribe({
      next: (response: any) => {
        const records = Array.isArray(response) ? response : (response?.data || []);
        this.lastUpdateSchemeList = records;
        this.currentPage = 1;
        this.applyFilter();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('GetLastUpdateScheme Search Error:', error);
        this.lastUpdateSchemeList = [];
        this.filteredSchemeList = [];
        this.paginatedSchemeList = [];
        this.totalRecords = 0;
        this.loading = false;
      }
    });
  }

  resetFilters(): void {
    this.selectedDepartment = '';
    this.selectedScheme = '';
    this.searchTerm = '';
    this.filteredSchemes = [...this.allSchemes];
    this.searchScheme();
  }

  applyFilter(): void {
    let result = [...this.lastUpdateSchemeList];

    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.trim().toLowerCase();
      result = result.filter(item => {
        const dept = (item.name || item.DepartmentName || '').toLowerCase();
        const scheme = (item.schemeName || item.SchemeName || '').toLowerCase();
        const code = (item.dbtSchemeCode || item.schemeCode || '').toLowerCase();
        const date = (item.entryDate || item.SchemeLastUpdatedDate || '').toLowerCase();
        return dept.includes(term) || scheme.includes(term) || code.includes(term) || date.includes(term);
      });
    }

    this.filteredSchemeList = result;
    this.totalRecords = this.filteredSchemeList.length;
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
    this.paginatedSchemeList = this.filteredSchemeList.slice(start, end);
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
    if (!this.filteredSchemeList || this.filteredSchemeList.length === 0) {
      return;
    }

    const headers = ['Sr. No.', 'Department Name', 'DBT Scheme Code', 'Scheme Name', 'Scheme Last Updated Date'];
    const rows = this.filteredSchemeList.map((item, index) => {
      const dept = (item.name || item.DepartmentName || '').replace(/"/g, '""');
      const code = (item.dbtSchemeCode || item.schemeCode || 'N/A').replace(/"/g, '""');
      const scheme = (item.schemeName || item.SchemeName || '').replace(/"/g, '""');
      let date = item.entryDate || item.SchemeLastUpdatedDate || '';
      if (date) {
        try {
          const d = new Date(date);
          if (!isNaN(d.getTime())) {
            date = d.toLocaleDateString('en-GB');
          }
        } catch {}
      }
      return `"${index + 1}","${dept}","${code}","${scheme}","${date}"`;
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Last_Updated_Scheme_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
