import { Injectable } from '@angular/core';
import { UserResponse } from '../models/UserResponse';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  set token(token :string){
    localStorage.setItem('token', token)
  }

  get token(){
    return localStorage.getItem('token') as string
  }
  set user(user :any){
    localStorage.setItem("user",JSON.stringify(user))
  }

  get user(){
    return JSON.parse(localStorage.getItem("user")??"null")
  }
}