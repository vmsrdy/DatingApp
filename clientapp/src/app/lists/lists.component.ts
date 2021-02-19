import { Component, OnInit } from '@angular/core';
import { Member } from '../_modals/member';
import { Pagination } from '../_modals/pagination';
import { MemberService } from '../_services/member.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  
  members: Partial<Member[]>;
  predicate: string = 'liked';
  pageNumer: Number = 1;
  pageSize: Number = 5;
  pagination: Pagination;

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes(){
    this.memberService.getLikes(this.predicate,this.pageNumer,this.pageSize).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  pageChanged(event: any){
    this.pageNumer = event.page;
    this.loadLikes();
  }

}
