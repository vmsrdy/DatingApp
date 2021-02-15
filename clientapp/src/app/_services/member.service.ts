import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CoreEnvironment } from '@angular/compiler/src/compiler_facade_interface';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_modals/member';

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

  constructor(private http: HttpClient) {}

    getMembers(){

      return this.http.get<Member[]>(this.baseUrl + 'users');
    }

    getMember(username :string){
      return this.http.get<Member>(this.baseUrl + 'users/' + username); 
    }

}

