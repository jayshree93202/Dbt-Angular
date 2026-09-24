import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Department {
  deptCode: number;
  name: string;
  name_Hn: string;
  name_Code: string;
  status: number;
  email: string;
  mobile: string;
}

export interface DepartmentScheme {
  dbtSchemeCode: string;
  name: string;
  deptCode: number;
  expr1: string | null;
  schemeCode: string;
  nbFin1617: number | null;
  nbFin1718: number | null;
  f18: string | null;
  schemeType: string;
  schemeName: string;
  lastUpdateDate: string;
}

export interface DepartmentSchemeResponse {
  status: string;
  message: string;
  data: DepartmentScheme[];
}

export interface DepartmentResponse {
  status: string;
  message: string;
  data: Department[];
}

export interface DepartmentWiseSummary {
  deptCode: number;
  name: string;
  scheme_Code: string;
  schemeName: string;
  mappedSchemeCode: string;
  no_Of_Beneficiries: number;
  amount: number;
  aadhaarSeededBeneficiary: number;
  noOfTransaction: number;
  noOfAadhaarSeededTransaction: number;
  lastUpdateDate: string;
}

export interface DepartmentWiseSummaryResponse {
  data: DepartmentWiseSummary[];
}

export interface CentralScheme {
  department_Name: string;
  schemeName: string;
  schemeCode: string;
  schemeType: string;
  transferType: string;
}

export interface DepartmentResponse {
  status: string;
  message: string;
  data: Department[];
}


export interface FinancialYear {
  fYearCode: string;
  fYear: string;
}

export interface FinancialYearResponse {
  status: string;
  message: string;
  data: FinancialYear[];
}

@Injectable({
  providedIn: 'root'
})
export class DbtService {

  constructor(private http: HttpClient) {}

  getDepartment(): Observable<DepartmentResponse> {
    return this.http.post<DepartmentResponse>(
      `${environment.apiUrl}/DBT/get-department`,
      {}
    );
  }

  getFinancialYears(): Observable<FinancialYearResponse> {debugger
    return this.http.post<FinancialYearResponse>(
      `${environment.apiUrl}/DBT/get-financial-year`,
      {}
    );
  }


  getDepartmentSchemeList(
  departmentCode: number,
  fYear: number
): Observable<any> {
  return this.http.get<any>(
    `${environment.apiUrl}/DBT/GetDepartmentSchemeList`,
    {
      params: {
        departmentCode: departmentCode.toString(),
        fYear: fYear.toString()
      }
    }
  );
}

getDepartmentWiseSummary(fYear: number,departmentCode: number, recordType: number): Observable<DepartmentWiseSummaryResponse> {

  return this.http.get<DepartmentWiseSummaryResponse>(
    `${environment.apiUrl}/Dbt/GetDepartmentWiseSummary`,
    {
      params: {
        FYear: fYear,
        DepartmentCode: departmentCode,
        RecordType: recordType
      }
    }
  );
}



 GetDepartmentCentralSchemeList(): Observable<CentralScheme[]> {debugger

  return this.http.get<CentralScheme[]>(
    `${environment.apiUrl}/DBT/GetDepartmentCentralSchemeList`,
    {
      params: {
        schTy: '1'
      }
    }
  );

}

 GetLastUpdateScheme(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/DBT/GetLastUpdateScheme`
    );
  }
}