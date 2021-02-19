import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CoreEnvironment } from '@angular/compiler/src/compiler_facade_interface';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_modals/member';
import { PaginatedResult } from '../_modals/pagination';
import { User } from '../_modals/user';
import { UserParams } from '../_modals/userparams';
import { AccountService } from './account.service';

/*const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user'))?.token
  })
}*/

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  baseUrl = environment.apiUrl;
  members: Member[]=[];
  memberCache = new Map();
  user: User;
  userParams :UserParams;

  constructor(private http: HttpClient, private accountService: AccountService) {
    
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
  }

  getUserParams(){
    return this.userParams;
  }

  setUserParams(params: UserParams){
    this.userParams = params;
  }

  resetUserParams(){
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }
    
    private GetPaginationHeaders(pageNumber: Number, pageSize: Number){

      let params = new HttpParams();

      
        params = params.append('pageNumber',pageNumber.toString());
        params = params.append('pageSize', pageSize.toString());

        return params;
    }

    getMember(username :string){

      // const member=  this.members.find(x=>x.username === username);
      // if(member !== undefined) 
      //   return of(member);
      
      const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result),[])
      .find((member: Member) => member.username === username);

      if(member){
        return of(member);
      }

      return this.http.get<Member>(this.baseUrl + 'users/' + username); 
    }

    updateMember(member: Member){
      return this.http.put(this.baseUrl + 'users',member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
      )
    }

    setMainPhoto(photoId: Number){
      return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {})
    }

    deletePhoto(photoId: Number){
      return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
    }

    addLike(username:string){
      return this.http.post(this.baseUrl + 'likes/' + username,{});
    }

    getLikes(predicate: string, pageNumber:Number, pageSize: Number){

      let params = this.GetPaginationHeaders(pageNumber,pageSize);
      params = params.append('predicate',predicate);

      return this.GetpaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes', params);
      //return this.http.get<Partial<Member[]>>(this.baseUrl + 'likes?predicate=' + predicate);
    }

    getMembers(userParams: UserParams){
      console.log(Object.values(userParams).join('-'));
      var response = this.memberCache.get(Object.values(userParams).join('-'));
      if(response){
        return of(response);
      }
      let params = this.GetPaginationHeaders(userParams.pageNumber, userParams.pageSize);

      params = params.append('minAge', userParams.minAge.toString());
      params = params.append('maxAge', userParams.maxAge.toString());
      params = params.append('gender', userParams.gender);

      return this.GetpaginatedResult<Member[]>(this.baseUrl + 'users', params)
        .pipe(map(response =>{
          this.memberCache.set(Object.values(userParams).join('-'),response);
          return response;
        }))
      
    }

  private GetpaginatedResult<T>(url: string, params) {

    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
      })
    );
  }

}


// getMembers(page?: Number, itemsPerPage?: Number){
//   //if(this.members.length > 0) return of (this.members); 
//   // return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
//   //   map(members =>{
//   //     this.members = members;
//   //     return this.members;
//   //   })
//   // )
//   let params = new HttpParams();

//   if(page != null && itemsPerPage != null){
//     params = params.append('pageNumber',page.toString());
//     params = params.append('pageSize', itemsPerPage.toString());
//   }

//   return this.http.get<Member[]>(this.baseUrl + 'users', {observe: 'response',params}).pipe(
//     map(response =>{
//       this.paginatedResult.result = response.body;
//       if(response.headers.get('Pagination') !== null)
//       { 
//         this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
//       }

//       return this.paginatedResult;
//     })
//   )
  
// }

