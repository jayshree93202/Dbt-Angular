import { Component, OnInit } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { DbtService } from '../../core/services/dbt';

export interface DepartmentWiseSummary {
  deptCode: number;
  name: string;
  scheme_Code: string;
  schemeName: string;
  mappedSchemeCode: string;

  no_Of_Beneficiries: number;
  amount: number;
  aadharseededbeneficiary: number;
  noofTransaction: number;
  noofadharshededTransation: number;

  lastUpdateDate: string;
}

export interface DepartmentWiseSummaryResponse {
  status: string;
  message: string;
  data: DepartmentWiseSummary[];
}

@Component({
  selector: 'app-cumulative-details-report',
  templateUrl: './cumulative-details-report.html',
  styleUrls: ['./cumulative-details-report.css']
})
export class CumulativeDetailsReportComponent implements OnInit {

  reports: DepartmentWiseSummary[] = [];

  loading = false;

  // Filters
  fYear: number = 0;
  departmentCode: number = 0;
  recordType: number = 1;

  // Total
  totalBeneficiaries: number = 0;
  totalAmount: number = 0;
  totalAadhaarSeeded: number = 0;
  totalTransactions: number = 0;
  totalAadhaarTransactions: number = 0;

  constructor(private dbtService: DbtService) {}

  ngOnInit(): void {
    this.getDepartmentWiseSummary();
  }

  getDepartmentWiseSummary(): void {

    this.loading = true;

    this.dbtService.getDepartmentWiseSummary(
      this.fYear,
      this.departmentCode,
      this.recordType
    ).subscribe({

      next: (response) => {

        const apiResponse = response as unknown as DepartmentWiseSummaryResponse;

        console.log('GetDepartmentWiseSummary API Response:', apiResponse);

        if (apiResponse.status === 'true') {

          this.reports = apiResponse.data || [];

          this.calculateTotals();

        } else {

          this.reports = [];
          this.resetTotals();

        }

        this.loading = false;
      },

      error: (error) => {

        console.error(
          'GetDepartmentWiseSummary API Error:',
          error
        );

        this.reports = [];
        this.resetTotals();

        this.loading = false;
      }
    });
  }

  calculateTotals(): void {

    this.totalBeneficiaries = this.reports.reduce(
      (total, item) => total + (Number(item.no_Of_Beneficiries) || 0),
      0
    );

    this.totalAmount = this.reports.reduce(
      (total, item) => total + (Number(item.amount) || 0),
      0
    );

    this.totalAadhaarSeeded = this.reports.reduce(
      (total, item) => total + (Number(item.aadharseededbeneficiary) || 0),
      0
    );

    this.totalTransactions = this.reports.reduce(
      (total, item) => total + (Number(item.noofTransaction) || 0),
      0
    );

    this.totalAadhaarTransactions = this.reports.reduce(
      (total, item) => total + (Number(item.noofadharshededTransation) || 0),
      0
    );
  }

  resetTotals(): void {

    this.totalBeneficiaries = 0;
    this.totalAmount = 0;
    this.totalAadhaarSeeded = 0;
    this.totalTransactions = 0;
    this.totalAadhaarTransactions = 0;
  }

  onSearch(): void {
    this.getDepartmentWiseSummary();
  }

  onReset(): void {

    this.fYear = 0;
    this.departmentCode = 0;
    this.recordType = 1;

    this.getDepartmentWiseSummary();
  }
}