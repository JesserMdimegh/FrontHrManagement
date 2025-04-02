import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { UserResponse } from "../models/UserResponse";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loggedIn = new BehaviorSubject<UserResponse | null>(null);
  loggedIn$ = this.loggedIn.asObservable();
  isLoggedIn$: Observable<boolean>;

  constructor(private tokenService: TokenService) {
    this.isLoggedIn$ = this.loggedIn$.pipe(
      map(user => !!user)
    );
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.loggedIn.next(JSON.parse(storedUser));
    }
  }

  login(user: UserResponse) {
    this.loggedIn.next(user);
  }

  logout() {
    this.loggedIn.next(null);
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    const value = !!this.loggedIn.value;
    return value;
  }

  isRhAdmin(): Observable<boolean> {
    return this.loggedIn$.pipe(
      map(user => {
        const isRh = !!user && user.UserType === 1;
        return isRh;
      })
    );
  }

  isCandidat(): Observable<boolean> {
    return this.loggedIn$.pipe(
      map(user => !!user && user.UserType === 0)
    );
  }

  isEmployeur(): Observable<boolean> {
    return this.loggedIn$.pipe(
      map(user => !!user && user.UserType === 2)
    );
  }
}
