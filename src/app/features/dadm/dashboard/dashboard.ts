import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import type * as Highcharts from 'highcharts';
import { HighchartsChartComponent } from 'highcharts-angular';

import { DashboardService } from '../../../core/services/dashboard';



// ======================================================
// EXPORT CONFIG
// ======================================================

const EXPORT_CONFIG: Highcharts.ExportingOptions = {
  enabled: true,
  sourceWidth: 1200,
  sourceHeight: 600,

  buttons: {
    contextButton: {
      menuItems: [
        'downloadPNG',
        'downloadJPEG',
        'downloadSVG',
        'downloadPDF',
        'separator',
        'downloadCSV',
        'downloadXLS'
      ]
    }
  }
};


// ======================================================
// INTERFACES
// ======================================================

  interface CumulativeAmount {
  totalCumulativeAmount: string | number | undefined;
  fYear: string | undefined;
  fYearId: number | undefined;
  cumulativeAmountFYear: string | undefined;
}

export interface YearWiseBeneficiary {
  fYearCode?: number;
  fYear?: string;
  totalBeneficiaries?: number;
}


export interface YearWiseAmount {
  fYearCode?: number;
  fYear?: string;
  totalAmt?: number;
}


export interface DepartmentSchemeChart {
  deptCode?: number;
  name?: string;
  totalScheme?: number;
  name_Symbol?: string;
}


// ======================================================
// COMPONENT
// ======================================================

@Component({
  selector: 'app-dashboard',

  imports: [
    CommonModule,
    HighchartsChartComponent
  ],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})


export class Dashboard implements OnInit {

  // ======================================================
  // DASHBOARD COUNTS
  // ======================================================
 fYearId: number = 0;
  totalDepartment: number = 0;

  totalScheme: number = 0;

  totalPayDepartment: number = 0;

  totalPayScheme: number = 0;

  totalDBT: string = '₹ 0 Cr';

  currentFY: string = '';


  // ======================================================
  // DEPARTMENT LIST
  // ======================================================

  departments: DepartmentSchemeChart[] = [];


  // ======================================================
  // CHART FLAGS
  // ======================================================

  fundTransferChartReady = false;

  fundTransferUpdateFlag = false;


  // ======================================================
  // CHART OPTIONS
  // ======================================================

  departmentChartOptions: Highcharts.Options = {

    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: 320
    },

    title: {
      text: ''
    },

    credits: {
      enabled: false
    },

    exporting: EXPORT_CONFIG,

    tooltip: {
      pointFormat:
        '<b>{point.y}</b> Schemes ({point.percentage:.1f}%)'
    },

    plotOptions: {

      pie: {

        innerSize: '55%',

        allowPointSelect: true,

        cursor: 'pointer',

        borderWidth: 2,

        borderColor: '#ffffff',

        shadow: false,

        dataLabels: {

          enabled: true,

          format:
            '<b>{point.name}</b>: {point.y}',

          style: {
            fontSize: '11px',
            color: '#1e293b',
            fontWeight: '600'
          },

          distance: 14
        },

        showInLegend: true
      }
    },

    legend: {

      layout: 'vertical',

      align: 'right',

      verticalAlign: 'middle',

      itemMarginTop: 6,

      itemMarginBottom: 6,

      itemStyle: {

        color: '#334155',

        fontSize: '12px',

        fontWeight: '600'
      }
    },

    series: [

      {

        type: 'pie',

        name: 'Schemes',

        data: [

          {
            name: 'Education',
            y: 28,
            color: '#1d4ed8'
          },

          {
            name: 'Health',
            y: 24,
            color: '#0d9488'
          },

          {
            name: 'Social Welfare',
            y: 20,
            color: '#e11d48'
          },

          {
            name: 'Rural Development',
            y: 16,
            color: '#d97706'
          },

          {
            name: 'Agriculture',
            y: 12,
            color: '#16a34a'
          },

          {
            name: 'Others',
            y: 35,
            color: '#7c3aed'
          }

        ]
      }

    ]
  };


  // ======================================================
  // FUND TRANSFER CHART
  // ======================================================

  fundTransferOptions: Highcharts.Options = {

    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      height: 320
    },

    title: {
      text: ''
    },

    credits: {
      enabled: false
    },

    exporting: EXPORT_CONFIG,

    xAxis: {

      categories: [],

      lineColor: '#cbd5e1',

      labels: {

        style: {

          color: '#475569',

          fontSize: '12px',

          fontWeight: '600'
        }
      }
    },

    yAxis: {

      min: 0,

      title: {

        text: 'Amount (₹ Crore)',

        style: {

          color: '#475569',

          fontWeight: '600'
        }
      },

      gridLineColor: '#f1f5f9',

      labels: {

        style: {
          color: '#64748b'
        }
      }
    },

    tooltip: {

      headerFormat:
        '<span style="font-size:12px;font-weight:700">{point.key}</span><br/>',

      pointFormat:
        '<span style="color:{point.color}">●</span> ' +
        '<b>₹ {point.y:.0f} Crore</b>'
    },

    plotOptions: {

      column: {

        colorByPoint: true,

        borderRadius: 6,

        borderWidth: 0,

        dataLabels: {

          enabled: true,

          format: '₹{point.y:.0f}',

          style: {

            fontSize: '11px',

            color: '#1e293b',

            fontWeight: '700'
          }
        }
      }
    },

    colors: [

      {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        },

        stops: [
          [0, '#2563eb'],
          [1, '#93c5fd']
        ]
      },

      {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        },

        stops: [
          [0, '#0d9488'],
          [1, '#5eead4']
        ]
      },

      {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        },

        stops: [
          [0, '#7c3aed'],
          [1, '#c4b5fd']
        ]
      },

      {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        },

        stops: [
          [0, '#d97706'],
          [1, '#fde68a']
        ]
      },

      {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        },

        stops: [
          [0, '#e11d48'],
          [1, '#fca5a5']
        ]
      },

      {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        },

        stops: [
          [0, '#10b981'],
          [1, '#6ee7b7']
        ]
      }

    ] as any,

    legend: {
      enabled: false
    },

    series: [

      {
        type: 'column',
        name: 'Fund Transfer',
        data: []
      }

    ]
  };


  // ======================================================
  // BENEFICIARY CHART
  // ======================================================

  beneficiariesOptions: Highcharts.Options = {

    chart: {

      type: 'areaspline',

      backgroundColor: 'transparent',

      height: 320
    },

    title: {
      text: ''
    },

    credits: {
      enabled: false
    },

    exporting: EXPORT_CONFIG,

    xAxis: {

      categories: [],

      lineColor: '#cbd5e1',

      labels: {

        style: {

          color: '#475569',

          fontSize: '12px',

          fontWeight: '600'
        }
      }
    },

    yAxis: {

      title: {

        text: 'Beneficiaries (in Lakhs)',

        style: {

          color: '#475569',

          fontWeight: '600'
        }
      },

      gridLineColor: '#f1f5f9',

      labels: {

        style: {
          color: '#64748b'
        }
      }
    },

    tooltip: {

      shared: true,

      headerFormat:
        '<span style="font-size:12px;font-weight:700">{point.key}</span><br/>',

      pointFormat:
        '<span style="color:{series.color}">●</span> ' +
        '{series.name}: <b>{point.y} Lakhs</b><br/>'
    },

    plotOptions: {

      areaspline: {

        lineWidth: 2,

        marker: {

          lineWidth: 2,

          radius: 4
        }
      }
    },

    legend: {

      align: 'center',

      verticalAlign: 'bottom',

      itemStyle: {

        color: '#334155',

        fontSize: '12px',

        fontWeight: '600'
      }
    },

    series: [

      {

        type: 'areaspline',

        name: 'Total Beneficiaries',

        data: []
      }

    ]
  };


  // ======================================================
  // CHART REFERENCES
  // ======================================================

  departmentChart?: Highcharts.Chart;

  fundTransferChart?: Highcharts.Chart;

  beneficiariesChart?: Highcharts.Chart;


  activeExportMenu: string | null = null;


  // ======================================================
  // CONSTRUCTOR
  // ======================================================

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}


  // ======================================================
  // NG ON INIT
  // ======================================================

  ngOnInit(): void {

    console.log('Dashboard initialized');

    // API calls
    this.loadDashboardCount();

    this.loadTotalScheme();

    this.loadFundTransferChart();

    this.loadBeneficiaryChart();

    this.loadDepartmentWiseSchemes();
    
    this.loadCumulativeAmount(this.fYearId);
  }


  // ======================================================
  // DASHBOARD COUNT
  // ======================================================

  loadDashboardCount(): void {

    const fYearCode = '6';

    console.log(
      'Calling Dashboard Count API...'
    );

    this.dashboardService
      .getDashboardCount(fYearCode)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Dashboard API Response:',
            response
          );


          this.totalDepartment =
            Number(
              response?.totalDepartment?.totalDepartment ?? 0
            );


          this.totalPayDepartment =
            Number(
              response?.totalDepartment?.totalPayDepartment ?? 0
            );


          this.totalPayScheme =
            Number(
              response?.totalDepartment?.totalPayScheme ?? 0
            );


          console.log(
            'Total Department:',
            this.totalDepartment
          );

          console.log(
            'Total Pay Department:',
            this.totalPayDepartment
          );

          console.log(
            'Total Pay Scheme:',
            this.totalPayScheme
          );


          // Force Angular UI update
          this.cdr.detectChanges();

        },

        error: (error: HttpErrorResponse) => {

          console.error(
            'Dashboard API Error:',
            error
          );

        }

      });
  }


  // ======================================================
  // TOTAL SCHEME
  // ======================================================

  loadTotalScheme(): void {

    console.log(
      'Calling Total Scheme API...'
    );


    this.dashboardService
      .getTotalScheme()
      .subscribe({

        next: (response: any) => {

          console.log(
            'Total Scheme API Response:',
            response
          );


          this.totalScheme =
            Number(
              response?.data?.[0]?.totalScheme ?? 0
            );


          console.log(
            'Total Scheme:',
            this.totalScheme
          );


          this.cdr.detectChanges();

        },

        error: (error: HttpErrorResponse) => {

          console.error(
            'Total Scheme API Error:',
            error
          );

          this.totalScheme = 0;

          this.cdr.detectChanges();

        }

      });
  }


  // ======================================================
  // FUND TRANSFER
  // ======================================================

  loadFundTransferChart(): void {

    console.log(
      'Calling Fund Transfer API...'
    );


    this.dashboardService
      .getFYearWiseTotalAmount()
      .subscribe({

        next: (response: YearWiseAmount[]) => {

          console.log(
            'Fund Transfer API:',
            response
          );


          if (
            !response ||
            response.length === 0
          ) {

            this.fundTransferChartReady = false;

            return;
          }


          // Sort FY ascending

          const sortedData =
            [...response].sort(
              (a, b) =>
                (a.fYearCode ?? 0) -
                (b.fYearCode ?? 0)
            );


          // Latest 6 FY

          const latestData =
            sortedData.slice(-6);


          // Categories

          const categories: string[] =
            latestData.map(
              item =>
                item.fYear ?? ''
            );


          // Amount in Crore

          const amounts: number[] =
            latestData.map(
              item =>
                Number(
                  item.totalAmt ?? 0
                ) / 10000000
            );


          console.log(
            'Categories:',
            categories
          );

          console.log(
            'Amounts:',
            amounts
          );


          this.fundTransferOptions = {

            ...this.fundTransferOptions,

            xAxis: {

              ...(this.fundTransferOptions.xAxis as Highcharts.XAxisOptions),

              categories:
                categories

            },

            series: [

              {

                type: 'column',

                name: 'Fund Transfer',

                data: amounts

              }

            ]

          };


          this.fundTransferChartReady = true;

          this.fundTransferUpdateFlag = true;


          this.cdr.detectChanges();

        },

        error: (error: HttpErrorResponse) => {

          console.error(
            'Fund Transfer API Error:',
            error
          );

          this.fundTransferChartReady = false;

          this.cdr.detectChanges();

        }

      });
  }


  // ======================================================
  // BENEFICIARY
  // ======================================================

  loadBeneficiaryChart(): void {

    console.log(
      'Calling Beneficiary API...'
    );


    this.dashboardService
      .getFYearWiseTotalBeneficiary()
      .subscribe({

        next: (
          response: YearWiseBeneficiary[]
        ) => {

          console.log(
            'Beneficiary API Response:',
            response
          );


          if (
            !response ||
            response.length === 0
          ) {

            return;
          }


          // FY

          const categories: string[] =
            response.map(
              x =>
                x.fYear ?? ''
            );


          // Lakhs

          const values: number[] =
            response.map(
              x =>
                Number(
                  x.totalBeneficiaries ?? 0
                ) / 100000
            );


          console.log(
            'Beneficiary Categories:',
            categories
          );

          console.log(
            'Beneficiary Values:',
            values
          );


          this.beneficiariesOptions = {

            ...this.beneficiariesOptions,

            xAxis: {

              ...(this.beneficiariesOptions.xAxis as Highcharts.XAxisOptions),

              categories:
                categories
            },

            series: [

              {

                type: 'areaspline',

                name: 'Total Beneficiaries',

                data: values
              }

            ]

          };


          this.cdr.detectChanges();

        },

        error: (
          error: HttpErrorResponse
        ) => {

          console.error(
            'Beneficiary API Error:',
            error
          );

          this.cdr.detectChanges();

        }

      });
  }


  // ======================================================
  // DEPARTMENT WISE SCHEMES
  // ======================================================

  loadDepartmentWiseSchemes(): void {

    console.log(
      'Calling Department Scheme API...'
    );


    this.dashboardService
      .getChartDeptWiseScheme()
      .subscribe({

        next: (
          response: DepartmentSchemeChart[]
        ) => {

          console.log(
            'Department API Response:',
            response
          );


          this.departments =
            (response ?? []).map(
              item => ({

                deptCode:
                  item.deptCode,

                name:
                  item.name,

                totalScheme:
                  Number(
                    item.totalScheme ?? 0
                  ),

                name_Symbol:
                  item.name_Symbol ||
                  'bi-building-fill'

              })
            );


          console.log(
            'Departments:',
            this.departments
          );


          this.cdr.detectChanges();

        },

        error: (
          error: HttpErrorResponse
        ) => {

          console.error(
            'Department API Error:',
            error
          );

          this.departments = [];

          this.cdr.detectChanges();

        }

      });
  }


  cumulativeAmount: CumulativeAmount = {
    totalCumulativeAmount: 'Rs 0 Cr',
    fYear: '',
    fYearId: 0,
    cumulativeAmountFYear: ''
  };
loadCumulativeAmount(fYearId: string | number): void {debugger

  console.log('FYearId sending to API:', fYearId);

  if (fYearId === undefined || fYearId === null || fYearId === '') {
    console.error('FYearId is missing');
    return;
  }

  this.dashboardService.getCumulativeAmount(fYearId).subscribe({

    next: (response: CumulativeAmount) => {

      console.log('Cumulative Amount API Response:', response);

      this.cumulativeAmount = response;

    },

    error: (error: any) => {

      console.error('Cumulative Amount API Error:', error);
      console.error('Error Body:', error?.error);
      console.error('API URL:', error?.url);

    }

  });
}

}