import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_modals/member';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  members$: Observable<Member[]>;

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    //this.loadMembers();
    this.members$ = this.memberService.getMembers();
  }

  /*loadMembers(){
    this.memberService.getMembers().subscribe(members=>{
      this.members = members;
    })
  }*/
}
