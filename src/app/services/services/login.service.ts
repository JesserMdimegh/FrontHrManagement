import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { UserResponse } from "../models/UserResponse";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loggedIn = new BehaviorSubject<UserResponse | null>(null)
  loggedIn$ = this.loggedIn.asObservable()
  isLoggedIn$: Observable<boolean>

  constructor(private tokenService: TokenService) {
    this.isLoggedIn$ = this.loggedIn$.pipe(
      map(user => !!user)
    )
  }

  isRhAdmin(): Observable<boolean> {
    return this.tokenService.user.userType === 1 ? this.isLoggedIn$ : new BehaviorSubject(false).asObservable()
  }

  isCandidat(): Observable<boolean> {
    return this.tokenService.user.userType === 0 ? this.isLoggedIn$ : new BehaviorSubject(false).asObservable()
  }

  isEmployeur(): Observable<boolean> {
    return this.tokenService.user.userType === 2 ? this.isLoggedIn$ : new BehaviorSubject(false).asObservable()
  }

}
