import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_modals/member';
import { Photo } from 'src/app/_modals/photo';
import { User } from 'src/app/_modals/user';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() member: Member;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User;

  constructor(private accountService: AccountService, private memberService: MemberService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user =>this.user = user);
   }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any){
    this.hasBaseDropZoneOver= e;
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer '+ this.user.token,
      isHTML5: true,
      allowedFileType :['image'],
      removeAfterUpload :true,
      autoUpload: false,
      maxFileSize: 10* 1024*1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, respose, status, headers) => {
      if(respose){
        const photo = JSON.parse(respose);
        this.member.photos.push(photo);
      }
    }    
  }

  setMainPhoto(photo: Photo){
    this.memberService.setMainPhoto(photo.id).subscribe(() =>{
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentuser(this.user);
      this.member.photoUrl = photo.url;

      this.member.photos.forEach( p=>{
        if(p.isMain) p.isMain = false;
        if(p.id === photo.id) p.isMain = true; 
      })
    })
  }

  deletePhoto(photoId: Number){
    this.memberService.deletePhoto(photoId).subscribe(()=> {
      this.member.photos = this.member.photos.filter(x =>x.id != photoId);
    })
  }

}
