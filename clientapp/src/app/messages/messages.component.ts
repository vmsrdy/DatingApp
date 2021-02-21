import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Message } from '../_modals/message';
import { Pagination } from '../_modals/pagination';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages: Message[] =[];
  pagination: Pagination;
  container: string= 'Unread';
  pageNumber: Number = 1;
  pageSize:Number = 5;
  loading:boolean = false;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(){
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(response=> {
      this.messages = response.result;
      this.pagination = response.pagination;
      this.loading = false;
    })
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe(() =>{
      this.messages.splice(this.messages.findIndex(m=>m.id == id),1);
    })
  }

  pageChanged(event:any){
    this.pageNumber = event.page;
    this.loadMessages();
  }

}
