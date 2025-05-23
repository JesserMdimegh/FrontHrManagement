/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { CandidatDto } from '../../models/candidat-dto';

export interface ApiApplicationOfferJobOfferIdCandidatesGet$Params {
  jobOfferId: string;
}

export function apiApplicationOfferJobOfferIdCandidatesGet(http: HttpClient, rootUrl: string, params: ApiApplicationOfferJobOfferIdCandidatesGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CandidatDto>>> {
  const rb = new RequestBuilder(rootUrl, apiApplicationOfferJobOfferIdCandidatesGet.PATH, 'get');
  if (params) {
    rb.path('jobOfferId', params.jobOfferId, {});
  }
  rb.header('Authorization', `Bearer ${localStorage.getItem('token')}`);
  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<CandidatDto>>;
    })
  );
}

apiApplicationOfferJobOfferIdCandidatesGet.PATH = '/api/Application/offer/{jobOfferId}/candidates';
