import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { error } from 'console';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Group } from '../_modals/group';
import { Message } from '../_modals/message';
import { User } from '../_modals/user';
import { GetpaginatedResult, GetPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl: string = environment.apiUrl;
  hubUrl: string = environment.hubUrl;
  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http: HttpClient) { }

  createHubConnection(user: User, otherUserName: string) {
    this.hubConnection = new HubConnectionBuilder()
        .withUrl(this.hubUrl + 'message?user=' + otherUserName, {
          accessTokenFactory: () =>user.token
        }).withAutomaticReconnect().build()

        this.hubConnection.start().catch(error => console.log(error));

        this.hubConnection.on('ReceiveMessageThread', messages => {
          this.messageThreadSource.next(messages);
        })

        this.hubConnection.on('NewMessage', message => {
          this.messageThread$.pipe(take(1)).subscribe(messages => {
            this.messageThreadSource.next([...messages,message])
          })
        })
        
        this.hubConnection.on('UpdatedGroup',(group: Group) => {
          if(group.connections.some(x=>x.username === otherUserName)) {
            this.messageThread$.pipe(take(1)).subscribe(messages => {
              messages.forEach(message => {
                if(!message.dateRead) {
                  message.dateRead = new Date(Date.now())
                }
              })
              this.messageThreadSource.next([...messages]);
            })
          }
        })
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  getMessages(pageNumber: Number,PageSize: Number, container: string){
    let params = GetPaginationHeaders(pageNumber,PageSize);
    params = params.append('Container', container);

    return GetpaginatedResult<Message[]>(this.baseUrl + 'message', params,this.http );
  }

  getMessageThread(username: string){
    return this.http.get<Message[]>(this.baseUrl + 'message/thread/' + username);
  }

  async sendMessage(username:string, content:string) {
    //return this.http.post<Message>(this.baseUrl + 'message', {recipientUsername: username, content} );
    return this.hubConnection.invoke('SendMessage', {recipientUsername: username, content})
        .catch(error => console.log(error));
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'message/' + id);
  }
}
