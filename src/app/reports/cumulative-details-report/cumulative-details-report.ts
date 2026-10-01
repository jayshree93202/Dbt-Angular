import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import {
  DbtService,
  Department,
  CentralScheme
} from '../../core/services/dbt';

export interface FinancialYearItem {
  fYearId: string;
  financialYear: string;
  fYearCode: string;
  fYear: string;
}

export interface SchemeReportRow {
  deptCode: number;
  department: string;
  scheme: string;
  schemeCode: string;
  totalBeneficiary: number;
  transferAmount: number;
  aadhaarSeededBeneficiaries: number;
  noOfTransaction: number;
  aadhaarSeededTransactions: number;
  lastUpdated: string;
}

@Component({
  selector: 'app-cumulative-details-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './cumulative-details-report.html',
  styleUrls: ['./cumulative-details-report.css'],
  providers: [DecimalPipe]
})
export class CumulativeDetailsReportComponent implements OnInit {

  financialYears: FinancialYearItem[] = [];
  departments: Department[] = [];
  allMasterSchemes: CentralScheme[] = [];

  selectedFinancialYear: string = '11';
  selectedDepartment: string = '';
  selectedSchemeType: string = '';

  reportData: SchemeReportRow[] = [];
  paginatedReportData: SchemeReportRow[] = [];
  loading: boolean = false;

  // Pagination State
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  totalRecords: number = 0;

  // In-memory cache for instant retrieval
  private summaryCache = new Map<string, any[]>();
  private isMasterSchemesLoading: boolean = false;

  // Overall Totals
  totalBeneficiary: number = 0;
  totalTransferAmount: number = 0;
  totalAadhaarSeededBeneficiaries: number = 0;
  totalTransactions: number = 0;
  totalAadhaarSeededTransactions: number = 0;

  constructor(private dbtService: DbtService) {}

  ngOnInit(): void {
    // 1. Immediately fetch the main report data in parallel on frame 0
    this.getDepartmentWiseSummary();

    // 2. Fetch dropdown filter options in parallel
    this.loadFilterOptions();

    // 3. Preload master schemes in background for UnReported Scheme lookup
    this.preloadMasterSchemes();
  }

  loadFilterOptions(): void {
    // Load Financial Years
    this.dbtService.getFinancialYears().subscribe({
      next: (res: any) => {
        const data = res?.data || [];
        this.financialYears = data.map((y: any) => ({
          fYearId: String(y.fYearCode || y.fYearId || ''),
          financialYear: y.fYear || y.financialYear || '',
          fYearCode: String(y.fYearCode || ''),
          fYear: y.fYear || ''
        }));

        if (!this.selectedFinancialYear && this.financialYears.length > 0) {
          this.selectedFinancialYear = this.financialYears[0].fYearId;
        }
      },
      error: (err: any) => {
        console.error('Error fetching financial years:', err);
      }
    });

    // Load Departments
    this.dbtService.getDepartment().subscribe({
      next: (res: any) => {
        if (res?.status === 'true' || res?.status === true) {
          this.departments = res.data || [];
        } else if (Array.isArray(res)) {
          this.departments = res;
        } else if (res?.data) {
          this.departments = res.data;
        }
      },
      error: (err: any) => {
        console.error('Error fetching departments:', err);
      }
    });
  }

  preloadMasterSchemes(): void {
    if (this.allMasterSchemes.length > 0 || this.isMasterSchemesLoading) {
      return;
    }

    this.isMasterSchemesLoading = true;

    forkJoin({
      central: this.dbtService.GetDepartmentCentralSchemeList(1),
      state: this.dbtService.GetDepartmentCentralSchemeList(2)
    }).subscribe({
      next: (res: any) => {
        const central = Array.isArray(res.central) ? res.central : [];
        const state = Array.isArray(res.state) ? res.state : [];
        this.allMasterSchemes = [...central, ...state];
        this.isMasterSchemesLoading = false;
      },
      error: () => {
        this.isMasterSchemesLoading = false;
      }
    });
  }

  onFinancialYearChange(): void {
    this.currentPage = 1;
    this.getDepartmentWiseSummary();
  }

  onDepartmentChange(): void {
    this.currentPage = 1;
    this.getDepartmentWiseSummary();
  }

  onSchemeTypeChange(): void {
    this.currentPage = 1;
    this.getDepartmentWiseSummary();
  }

  getDepartmentWiseSummary(): void {
    const fYear = Number(this.selectedFinancialYear) || 11;
    const departmentCode = this.selectedDepartment ? Number(this.selectedDepartment) : 0;
    const isUnreported = this.selectedSchemeType === 'UnReported Scheme' || this.selectedSchemeType === 'Non Reported Scheme';
    const recordType = isUnreported ? 2 : 1;

    const cacheKey = `${fYear}_${departmentCode}_${recordType}`;

    // 1. Instant cache hit
    if (this.summaryCache.has(cacheKey) && (!isUnreported || this.allMasterSchemes.length > 0)) {
      const cached = this.summaryCache.get(cacheKey)!;
      this.processReportRows(cached, isUnreported, departmentCode);
      return;
    }

    this.loading = true;

    this.dbtService.getDepartmentWiseSummary(fYear, departmentCode, recordType).subscribe({
      next: (response: any) => {
        const rawList = response?.data || (Array.isArray(response) ? response : []);
        this.summaryCache.set(cacheKey, rawList);

        if (isUnreported && this.allMasterSchemes.length === 0) {
          // If master schemes not loaded yet, fetch and process
          this.fetchMasterSchemesAndProcess(rawList, departmentCode);
        } else {
          this.processReportRows(rawList, isUnreported, departmentCode);
        }
      },
      error: (error: any) => {
        console.error('GetDepartmentWiseSummary API Error:', error);
        this.reportData = [];
        this.paginatedReportData = [];
        this.resetTotals();
        this.totalRecords = 0;
        this.loading = false;
      }
    });
  }

  private fetchMasterSchemesAndProcess(rawList: any[], departmentCode: number): void {
    forkJoin({
      central: this.dbtService.GetDepartmentCentralSchemeList(1),
      state: this.dbtService.GetDepartmentCentralSchemeList(2)
    }).subscribe({
      next: (res: any) => {
        const central = Array.isArray(res.central) ? res.central : [];
        const state = Array.isArray(res.state) ? res.state : [];
        this.allMasterSchemes = [...central, ...state];
        this.processReportRows(rawList, true, departmentCode);
      },
      error: () => {
        this.processReportRows(rawList, true, departmentCode);
      }
    });
  }

  private processReportRows(rawList: any[], isUnreported: boolean, departmentCode: number): void {
    // Filter by selected department if needed
    let filteredReported = rawList;
    if (departmentCode > 0) {
      filteredReported = filteredReported.filter((item: any) => Number(item.deptCode) === departmentCode);
    }

    if (isUnreported) {
      // Build reported scheme set for lookup
      const reportedSet = new Set<string>();
      for (const rep of filteredReported) {
        if (rep.scheme_Code) reportedSet.add(rep.scheme_Code.trim().toLowerCase());
        if (rep.schemeName) reportedSet.add(rep.schemeName.trim().toLowerCase());
      }

      // Target department name for filtering master schemes
      let targetDeptName = '';
      if (departmentCode > 0) {
        const foundDept = this.departments.find(d => Number(d.deptCode) === departmentCode);
        if (foundDept) {
          targetDeptName = foundDept.name.trim().toLowerCase();
        }
      }

      // Unreported schemes from master list
      const unreportedList: SchemeReportRow[] = [];
      for (const m of this.allMasterSchemes) {
        const deptName = (m.department_Name || '').trim();
        const sName = (m.schemeName || '').trim();
        const sCode = (m.schemeCode || '').trim();

        if (targetDeptName && deptName.toLowerCase() !== targetDeptName) {
          continue;
        }

        const codeMatches = sCode && reportedSet.has(sCode.toLowerCase());
        const nameMatches = sName && reportedSet.has(sName.toLowerCase());

        if (!codeMatches && !nameMatches) {
          unreportedList.push({
            deptCode: departmentCode,
            department: deptName || '-',
            scheme: sName || sCode || '-',
            schemeCode: sCode,
            totalBeneficiary: 0,
            transferAmount: 0,
            aadhaarSeededBeneficiaries: 0,
            noOfTransaction: 0,
            aadhaarSeededTransactions: 0,
            lastUpdated: 'Not Reported'
          });
        }
      }

      this.reportData = unreportedList;
    } else {
      // Reported Scheme or Default
      this.reportData = filteredReported.map((item: any) => ({
        deptCode: Number(item.deptCode) || 0,
        department: item.name || item.department || item.DepartmentName || '-',
        scheme: item.schemeName || item.scheme || item.SchemeName || item.scheme_Code || '-',
        schemeCode: (item.scheme_Code || item.schemeCode || '').trim(),
        totalBeneficiary: Number(item.no_Of_Beneficiries || item.noOfBeneficiaries || item.totalBeneficiary || 0),
        transferAmount: Number(item.amount || item.transferAmount || 0),
        aadhaarSeededBeneficiaries: Number(item.aadhaarSeededBeneficiary || item.aadharseededbeneficiary || item.aadhaarSeededBeneficiaries || 0),
        noOfTransaction: Number(item.noOfTransaction || item.noofTransaction || 0),
        aadhaarSeededTransactions: Number(item.noOfAadhaarSeededTransaction || item.noofadharshededTransation || item.aadhaarSeededTransactions || 0),
        lastUpdated: this.formatDate(item.lastUpdateDate)
      }));
    }

    this.calculateTotals();
    this.updatePaginatedData();
    this.loading = false;
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
    this.totalRecords = this.reportData.length;
    const maxPage = this.totalPages;
    if (this.currentPage > maxPage) {
      this.currentPage = maxPage;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + Number(this.pageSize);
    this.paginatedReportData = this.reportData.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
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

  // =========================================
  // CALCULATIONS & EXPORT
  // =========================================

  calculateTotals(): void {
    this.totalBeneficiary = this.reportData.reduce(
      (sum, item) => sum + (Number(item.totalBeneficiary) || 0),
      0
    );

    this.totalTransferAmount = this.reportData.reduce(
      (sum, item) => sum + (Number(item.transferAmount) || 0),
      0
    );

    this.totalAadhaarSeededBeneficiaries = this.reportData.reduce(
      (sum, item) => sum + (Number(item.aadhaarSeededBeneficiaries) || 0),
      0
    );

    this.totalTransactions = this.reportData.reduce(
      (sum, item) => sum + (Number(item.noOfTransaction) || 0),
      0
    );

    this.totalAadhaarSeededTransactions = this.reportData.reduce(
      (sum, item) => sum + (Number(item.aadhaarSeededTransactions) || 0),
      0
    );
  }

  resetTotals(): void {
    this.totalBeneficiary = 0;
    this.totalTransferAmount = 0;
    this.totalAadhaarSeededBeneficiaries = 0;
    this.totalTransactions = 0;
    this.totalAadhaarSeededTransactions = 0;
  }

  formatDate(dateStr?: string | null): string {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateStr;
    }
  }

  downloadExcel(): void {
    if (!this.reportData || this.reportData.length === 0) {
      return;
    }

    const headers = [
      'Sr. No',
      'Department',
      'Scheme',
      'Total Beneficiary',
      'Transfer Amount',
      'Aadhaar Seeded Beneficiaries',
      'No of Transaction',
      'Aadhaar Seeded Transactions',
      'Last Updated'
    ];

    const rows = this.reportData.map((item, index) => {
      const dept = (item.department || '').replace(/"/g, '""');
      const scheme = (item.scheme || '').replace(/"/g, '""');
      const totBen = item.totalBeneficiary || 0;
      const amt = item.transferAmount || 0;
      const aadhBen = item.aadhaarSeededBeneficiaries || 0;
      const trans = item.noOfTransaction || 0;
      const aadhTrans = item.aadhaarSeededTransactions || 0;
      const updated = (item.lastUpdated || '').replace(/"/g, '""');

      return `"${index + 1}","${dept}","${scheme}","${totBen}","${amt}","${aadhBen}","${trans}","${aadhTrans}","${updated}"`;
    });

    // Append total row
    rows.push(
      `"","Total","","${this.totalBeneficiary}","${this.totalTransferAmount}","${this.totalAadhaarSeededBeneficiaries}","${this.totalTransactions}","${this.totalAadhaarSeededTransactions}",""`
    );

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cumulative_Details_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}