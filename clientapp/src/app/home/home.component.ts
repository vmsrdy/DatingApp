import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    registerMode = false;
    //registeredUsers : any;

  constructor(private http: HttpClient) { 
      
    //this.getUsers();
  }

  ngOnInit(): void {
  }

  RegisterToggle(){
    this.registerMode = !this.registerMode;
  }
  /*getUsers(){
    this.http.get('https://localhost:5001/api/users').subscribe(users => this.registeredUsers = users);
  }*/

  cancelRegisterMode(event: boolean){
    this.registerMode = event;
  }
}
