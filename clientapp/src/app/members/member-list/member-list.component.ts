import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_modals/member';
import { Pagination } from 'src/app/_modals/pagination';
import { User } from 'src/app/_modals/user';
import { UserParams } from 'src/app/_modals/userparams';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';

interface objArray {
  value:string;
  display:string
}
@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  //members$: Observable<Member[]>;
  members: Member[];
  pagination: Pagination;
  // pageNumber: Number = 1;
  // pageSize: Number= 5;
  userParams: UserParams;
  user: User;
  genderList: objArray[] = [{value: 'male',display:'Males'},{value:'female', display:'Females'}];


  constructor(private memberService: MemberService, private aacountService: AccountService) {

    this.userParams = memberService.getUserParams();
    // this.aacountService.currentUser$.pipe(take(1)).subscribe(user => {
    //   this.user = user;
    //   this.userParams = new UserParams(user);
    // })
   }

  ngOnInit(): void {
    //this.loadMembers();
    //this.members$ = this.memberService.getMembers();
    this.loadMembers();
  }

  /*loadMembers(){
    this.memberService.getMembers().subscribe(members=>{
      this.members = members;
    })
  }*/
  
  loadMembers(){
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

    resetFilters(){

    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }

  pageChanged(event:any){
    this.userParams.pageNumber = event.page;
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
  }
}
