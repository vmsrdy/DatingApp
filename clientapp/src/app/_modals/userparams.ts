import { User } from "./user";

export class UserParams {
    gender: string;
    minAge:Number =18;
    maxAge:Number = 99;
    pageNumber:Number =1;
    pageSize:Number = 5;
    orderBy: string = 'lastActive';

    constructor(user:User){
        this.gender = user.gender === "male"? "female":"male";
    }
}