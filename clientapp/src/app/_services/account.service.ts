import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import  { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_modals/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  baseUrl = environment.apiUrl;
  private currentuserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentuserSource.asObservable();

  constructor(private http : HttpClient) { }

  login(model :any)
  {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response:User) =>{
        const user = response;
        if(user)
        localStorage.setItem('user', JSON.stringify(user));
        this.currentuserSource.next(user);
      })
    )
  }
  register(model:any){
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: User) =>{
        if(user){
          localStorage.setItem('user',JSON.stringify(user));
          this.currentuserSource.next(user);
        }
        return user;
      })
    )
  }
  setCurrentuser(user:User){
    this.currentuserSource.next(user);
  }

  logout(){
  localStorage.removeItem('user');
  this.currentuserSource.next(null);
}
}

