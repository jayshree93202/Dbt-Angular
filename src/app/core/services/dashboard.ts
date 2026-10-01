import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';


export interface DashboardCount {
  totalDepartment: {
    totalDepartment: number;
    totalPayDepartment: number;
    totalPayScheme: number;

    
  };
}

 export interface CumulativeAmount {
  totalCumulativeAmount: string | number | undefined;
  fYear: string | undefined;
  fYearId: number | undefined;
  cumulativeAmountFYear: string | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = `http://localhost:5160/api/DBT`;

  isLoggedIn = false;
username = '';
profileDropdownOpen = false;


// 1. FINANCIAL YEAR
  getFinancialYear(): Observable<FinancialYear[]> {

    return this.http.post<FinancialYear[]>(
      `${this.apiUrl}/get-financial-year`,
      {}
    );
  }


  // 2. GET SCHEME
    getScheme_old(): Observable<Scheme[]> {

    return this.http.post<Scheme[]>(
      `${this.apiUrl}/get-scheme`,
      {}
    );
  }

getTotalScheme(): Observable<ApiResponse<TotalSchemeResponse[]>> {
  return this.http.post<ApiResponse<TotalSchemeResponse[]>>(
    `${this.apiUrl}/get-scheme`,
    {}
  );
}

 // 3. GET DEPARTMENT
  getDepartment(): Observable<Department[]> {

    return this.http.post<Department[]>(
      `${this.apiUrl}/get-department`,
      {}
    );
  }





  constructor(private http: HttpClient) {}

  getDashboardCount(fYearCode: string): Observable<DashboardCount> {
  return this.http.get<DashboardCount>(
    `${this.apiUrl}/GetDashboardCount`,
    {
      params: {
        fYearCode: fYearCode
      }
    }
  );
}

  // 5. CUMULATIVE AMOUNT
getCumulativeAmount(fYearId: string | number): Observable<CumulativeAmount> {debugger

  return this.http.get<CumulativeAmount>(
     `${environment.apiUrl}/DBT/GetCumulativeAmount`,
    {
      params: {
        FyearId: fYearId.toString()
      }
    }
  );
}

 // 6. DEPARTMENT WISE SCHEME CHART
    getChartDeptWiseScheme(): Observable<DepartmentSchemeChart[]> {

    return this.http.get<DepartmentSchemeChart[]>(
      `${this.apiUrl}/GetChartDeptWiseScheme`
    );
  }

 // 7. YEAR WISE TOTAL AMOUNT
    getFYearWiseTotalAmount(): Observable<YearWiseAmount[]> {

    return this.http.get<YearWiseAmount[]>(
      `${this.apiUrl}/GetFYearWiseTotalAmount`
    );
  }

  toggleProfileDropdown(): void {
  this.profileDropdownOpen = !this.profileDropdownOpen;
}



  // 8. YEAR WISE BENEFICIARY
    getFYearWiseTotalBeneficiary(): Observable<YearWiseBeneficiary[]> {

    return this.http.get<YearWiseBeneficiary[]>(
      `${this.apiUrl}/GetFYearWiseTotalBeneficiary`
    );
  }


  // 9. DEPARTMENT WISE SUMMARY
    getDepartmentWiseSummary(
    fYear: number,
    departmentCode: number,
    recordType: number = 1
  ): Observable<any> {

    const params = new HttpParams()
      .set('fYear', fYear.toString())
      .set('departmentCode', departmentCode.toString())
      .set('recordType', recordType.toString());

    return this.http.get<any>(
      `${this.apiUrl}/GetDepartmentWiseSummary`,
      { params }
    );
  }

  // 10. DEPARTMENT SCHEME LIST
    getDepartmentSchemeList(
    departmentCode: number,
    fYear: number
  ): Observable<any> {

    const params = new HttpParams()
      .set('departmentCode', departmentCode.toString())
      .set('fYear', fYear.toString());

    return this.http.get<any>(
      `${this.apiUrl}/GetDepartmentSchemeList`,
      { params }
    );
  }

// 11. CENTRAL SCHEME LIST
    getDepartmentCentralSchemeList(
    schTy: number
  ): Observable<any> {

    const params = new HttpParams()
      .set('schTy', schTy.toString());

    return this.http.get<any>(
      `${this.apiUrl}/GetDepartmentCentralSchemeList`,
      { params }
    );
  }

// 12. LAST UPDATE SCHEME
    getLastUpdateScheme(
    deptCode: number,
    schemeCode: string
  ): Observable<any> {

    const params = new HttpParams()
      .set('deptCode', deptCode.toString())
      .set('schemeCode', schemeCode);

    return this.http.get<any>(
      `${this.apiUrl}/GetLastUpdateScheme`,
      { params }
    );
  }
}


export interface FinancialYear {
  fYearCode: number;
  fYear: string;
}


export interface Scheme {
  schemeCode: string;
  schemeName?: string;
  fyear_Id?: number;
}


export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface TotalSchemeResponse {
  totalScheme: string;
}


export interface Department {
  deptCode: number;
  name: string;
  name_Hn?: string;
  name_Code?: string;
  status?: number;
  email?: string;
  mobile?: string;
}


export interface DashboardCount {

  //totalDepartment: number;

  totalScheme: number;

  totalPayDepartment: number;

  totalPayScheme: number;
}





export interface DepartmentSchemeChart {


  deptCode?: number;
   name?: string;
  totalScheme?: number;

 
   name_Symbol?: string;

}


export interface YearWiseAmount {



  fYearCode?: number;

  fYear?: string;

  totalAmt?: number;
}


export interface YearWiseBeneficiary {

  fYearCode?: number;

  fYear?: string;

  totalBeneficiaries?: number;
}





