import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Input() usersFromHomeComponent : any;
  @Output() cancelRegister = new EventEmitter();
  model:any = {};
  registerForm: FormGroup;
  maxDate: Date;
  validationErrors: string[] = [];

  constructor(private accountservice :AccountService, private toastr : ToastrService, 
    private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      gender: ['male'],
      knownAs: ['',Validators.required],
      dateOfBirth: ['',Validators.required],
      city: ['',Validators.required],
      country: ['',Validators.required],
      username: ['',Validators.required],
      password: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['',[Validators.required, this.matchValues('password')]]
    })
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  matchValues(matchTo: string) : ValidatorFn{
    return (control :AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value?null :{isMatching :true}
    }
  }

  register(){
    //console.log(this.registerForm.value);
    this.accountservice.register(this.registerForm.value).subscribe(response => {
      this.router.navigateByUrl('/members');
      //this.cancel();
    },
    error =>{
      this.validationErrors = error;
      //this.toastr.error(error.error);
    })    
  }

  cancel(){
    this.cancelRegister.emit(false);
  }
}

//this.registerForm = new FormGroup({
// username: new FormControl('',Validators.required),
      // password: new FormControl('',[Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      //confirmPassword: new FormControl('',[Validators.required, this.matchValues('password')])
//})