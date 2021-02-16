import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CoreEnvironment } from '@angular/compiler/src/compiler_facade_interface';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
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
  members: Member[]=[];

  constructor(private http: HttpClient) {}

    getMembers(){
      if(this.members.length > 0) return of (this.members); 
      return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
        map(members =>{
          this.members = members;
          return this.members;
        })
      )
    }

    getMember(username :string){
      const member=  this.members.find(x=>x.username === username);
      if(member !== undefined) 
        return of(member);
      
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

}

