import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaginatedResult } from "../_modals/pagination";
import { UserParams } from "../_modals/userparams";

export function GetpaginatedResult<T>(url: string, params: HttpParams, http: HttpClient) {

    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return http.get<T>(url, { observe: 'response', params}).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
      })
    );
  }

  export function GetPaginationHeaders(pageNumber: Number, pageSize: Number){

    let params = new HttpParams();

    
      params = params.append('pageNumber',pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());

      return params;
  }
