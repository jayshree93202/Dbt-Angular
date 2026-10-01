import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CentralScheme, DbtService } from '../../core/services/dbt';

@Component({
  selector: 'app-department-cssandstate-scheme-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-cssandstate-scheme-list.html',
  styleUrls: ['./department-cssandstate-scheme-list.css']
})
export class DepartmentCssandstateSchemeListComponent implements OnInit {

  allSchemes: CentralScheme[] = [];
  filteredSchemes: CentralScheme[] = [];
  paginatedSchemes: CentralScheme[] = [];
  departments: string[] = [];

  // Filter state
  selectedSchemeType: string = '1'; // '1': CSS, '2': State, 'all': Both
  selectedDepartment: string = '';
  searchTerm: string = '';
  isLoading: boolean = false;

  // Pagination state
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  totalRecords: number = 0;

  constructor(private schemeService: DbtService) {}

  ngOnInit(): void {
    this.loadSchemes();
  }

  loadSchemes(): void {
    this.isLoading = true;

    if (this.selectedSchemeType === 'all') {
      forkJoin({
        css: this.schemeService.GetDepartmentCentralSchemeList(1),
        state: this.schemeService.GetDepartmentCentralSchemeList(2)
      }).subscribe({
        next: ({ css, state }) => {
          const combined = [...(css || []), ...(state || [])];
          this.processLoadedSchemes(combined);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching CSS and State schemes:', error);
          this.handleLoadError();
        }
      });
    } else {
      const schTy = Number(this.selectedSchemeType) || 1;
      this.schemeService.GetDepartmentCentralSchemeList(schTy).subscribe({
        next: (response: CentralScheme[]) => {
          this.processLoadedSchemes(response || []);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching scheme list:', error);
          this.handleLoadError();
        }
      });
    }
  }

  private processLoadedSchemes(schemes: CentralScheme[]): void {
    this.allSchemes = schemes;

    // Extract unique department names
    const deptSet = new Set<string>();
    for (const item of schemes) {
      if (item.department_Name && item.department_Name.trim() !== '') {
        deptSet.add(item.department_Name.trim());
      }
    }
    this.departments = Array.from(deptSet).sort((a, b) => a.localeCompare(b));

    // Reset pagination to first page
    this.currentPage = 1;
    this.applyFilter();
  }

  private handleLoadError(): void {
    this.allSchemes = [];
    this.filteredSchemes = [];
    this.paginatedSchemes = [];
    this.totalRecords = 0;
    this.isLoading = false;
  }

  onSchemeTypeChange(): void {
    this.loadSchemes();
  }

  onDepartmentChange(): void {
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
    this.selectedSchemeType = '1';
    this.selectedDepartment = '';
    this.searchTerm = '';
    this.loadSchemes();
  }

  applyFilter(): void {
    let result = [...this.allSchemes];

    // Filter by Department
    if (this.selectedDepartment && this.selectedDepartment.trim() !== '') {
      const dept = this.selectedDepartment.trim().toLowerCase();
      result = result.filter(item =>
        item.department_Name && item.department_Name.trim().toLowerCase() === dept
      );
    }

    // Filter by Search Term
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.trim().toLowerCase();
      result = result.filter(item =>
        (item.schemeName && item.schemeName.toLowerCase().includes(term)) ||
        (item.department_Name && item.department_Name.toLowerCase().includes(term)) ||
        (item.schemeCode && item.schemeCode.toLowerCase().includes(term)) ||
        (item.schemeType && item.schemeType.toLowerCase().includes(term)) ||
        (item.transferType && item.transferType.toLowerCase().includes(term))
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

    const headers = ['Sr. No.', 'Department', 'Scheme Name', 'Scheme Code', 'Scheme Type', 'Transfer Type'];
    const rows = this.filteredSchemes.map((item, index) => {
      const dept = (item.department_Name || '').replace(/"/g, '""');
      const name = (item.schemeName || '').replace(/"/g, '""');
      const code = (item.schemeCode ? item.schemeCode.trim() : 'N/A').replace(/"/g, '""');
      const type = (item.schemeType || '').replace(/"/g, '""');
      const transfer = (item.transferType || '').replace(/"/g, '""');
      return `"${index + 1}","${dept}","${name}","${code}","${type}","${transfer}"`;
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CSS_State_Scheme_List_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}