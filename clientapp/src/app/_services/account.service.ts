import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import  { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_modals/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  baseUrl = environment.apiUrl;
  private currentuserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentuserSource.asObservable();

  constructor(private http : HttpClient, private presense: PresenceService) { }

  login(model :any)
  {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response:User) =>{
        const user = response;
        if(user) {
          this.setCurrentuser(user);
          this.presense.createHubConnection(user);
        //localStorage.setItem('user', JSON.stringify(user));
        //this.currentuserSource.next(user);
        }
      })
    )
  }
  register(model:any){
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: User) =>{
        if(user){
          this.setCurrentuser(user);
          this.presense.createHubConnection(user);
          //localStorage.setItem('user',JSON.stringify(user));
          //this.currentuserSource.next(user);
        }
        //return user;
      })
    )
  }
  setCurrentuser(user:User){

    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles)? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user',JSON.stringify(user));
    this.currentuserSource.next(user);
  }

  logout(){
  localStorage.removeItem('user');
  this.currentuserSource.next(null);
  this.presense.stopHubConnection();
}

getDecodedToken(token: string) {
  return JSON.parse(atob(token.split('.')[1]));
}
}

