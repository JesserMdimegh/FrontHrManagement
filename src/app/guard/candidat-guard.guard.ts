import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import { LoginService } from '../services/services/login.service';

export const candidatGuard: CanActivateFn = (route, state) => {
  return  inject(LoginService).isCandidat();
};
