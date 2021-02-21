import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../_modals/message';
import { GetpaginatedResult, GetPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMessages(pageNumber: Number,PageSize: Number, container: string){
    let params = GetPaginationHeaders(pageNumber,PageSize);
    params = params.append('Container', container);

    return GetpaginatedResult<Message[]>(this.baseUrl + 'message', params,this.http );
  }

  getMessageThread(username: string){
    return this.http.get<Message[]>(this.baseUrl + 'message/thread/' + username);
  }

  sendMessage(username:string, content:string) {
    return this.http.post<Message>(this.baseUrl + 'message', {recipientUsername: username, content} );
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'message/' + id);
  }
}
