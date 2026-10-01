import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbtService, Department } from '../../core/services/dbt';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-list.html',
  styleUrl: './department-list.css'
})
export class DepartmentListComponent implements OnInit {

  departments: Department[] = [];
  filteredDepartments: Department[] = [];
  paginatedDepartments: Department[] = [];
  loading = false;
  searchTerm: string = '';

  // Pagination State
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  totalRecords: number = 0;

  constructor(private dbtService: DbtService) {}

  ngOnInit(): void {
    this.getDepartments();
  }

  getDepartments(): void {
    this.loading = true;

    this.dbtService.getDepartment().subscribe({
      next: (response) => {
        if (response && (response.status === 'true' || `${response.status}` === 'true')) {
          this.departments = response.data || [];
        } else if (Array.isArray(response)) {
          this.departments = response;
        } else if (response?.data && Array.isArray(response.data)) {
          this.departments = response.data;
        } else {
          this.departments = [];
        }

        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Department API Error:', error);
        this.departments = [];
        this.filteredDepartments = [];
        this.paginatedDepartments = [];
        this.totalRecords = 0;
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilter();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearchChange();
  }

  applyFilter(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredDepartments = [...this.departments];
    } else {
      const term = this.searchTerm.trim().toLowerCase();
      this.filteredDepartments = this.departments.filter(dept =>
        (dept.name && dept.name.toLowerCase().includes(term)) ||
        (dept.name_Hn && dept.name_Hn.toLowerCase().includes(term)) ||
        (dept.email && dept.email.toLowerCase().includes(term)) ||
        (dept.mobile && dept.mobile.toLowerCase().includes(term))
      );
    }

    this.totalRecords = this.filteredDepartments.length;
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
    this.paginatedDepartments = this.filteredDepartments.slice(start, end);
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
    if (!this.filteredDepartments || this.filteredDepartments.length === 0) {
      return;
    }

    const headers = ['Sr. No.', 'Department Name', 'Hindi Name', 'Email', 'Mobile'];
    const rows = this.filteredDepartments.map((dept, index) => {
      const name = (dept.name || '').replace(/"/g, '""');
      const nameHn = (dept.name_Hn || '').replace(/"/g, '""');
      const email = (dept.email || 'N/A').replace(/"/g, '""');
      const mobile = (dept.mobile || 'N/A').replace(/"/g, '""');
      return `"${index + 1}","${name}","${nameHn}","${email}","${mobile}"`;
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Department_List_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}