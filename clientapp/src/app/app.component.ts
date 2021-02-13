import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_modals/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Wecome to clientapp';
  users : any;


  constructor(private accountservice: AccountService) {

  }
    ngOnInit() {
      //this.getUsers();  
      this.setCurrentUser();  
  } 

  setCurrentUser(){
  const user:User = JSON.parse(localStorage.getItem('user'));
  this.accountservice.setCurrentuser(user);
  }

  /*getUsers()
  {
    this.http.get('https://localhost:5001/api/users').subscribe(response =>
    {this.users = response
  },
  error =>{
    console.log(error); 
  })
  }*/

}
