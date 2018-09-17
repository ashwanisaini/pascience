import { Injectable } from '@angular/core';
import { RouterModule, Router }   from '@angular/router';
import {Http, Request, Response, Headers, RequestOptionsArgs, RequestMethod} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

export class User {
    constructor(
        public username: string,
        public password: string) { }
}

@Injectable()
export class AuthService {
    //http://ec2-34-209-236-55.us-west-2.compute.amazonaws.com:9000/api/adminLogin
    //private _loginUrl = 'http://localhost:3000/api/Customers/login';
    private _url = 'http://52.8.103.166:3000/';

    constructor(
        private _router: Router,
        private _http: Http) { }

    login(user: any) {
        let body = JSON.stringify(user);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        //return this._http.post(this._loginUrl, body, { headers: headers }).map((res:Response) => res.json());
        return this._http.post(this._url + 'api/Customers/login', body,  { headers: headers })
            .map((res: Response) => AuthService.json(res))
            .catch(this.handleError);
    }

    CheckUserCredentials(){
        let user_token = localStorage.getItem('user');
        if(!user_token){
            this._router.navigate(['/login']);
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let body = JSON.parse(user_token);
        console.log(body);
        return this._http.get(this._url + 'api/Customers/' + body.userId,  { headers: headers })
            .map((res: Response) => AuthService.json(res))
            .catch(this.handleError);
    }

    getUserDetails(userId:any){

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        //let body = JSON.parse(user_token);
        //console.log(body);
        return this._http.get(this._url + 'api/Customers/' + userId,  { headers: headers })
            .map((res: Response) => AuthService.json(res))
            .catch(this.handleError);
    }

    register(user: any){
        let body = JSON.stringify(user);
        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._url + 'api/Customers', body,  { headers: headers })
            .map((res: Response) => AuthService.json(res))
            .catch(this.handleError);

    }

    sendGuestWspNotification (inviteData:any) {
        let body = JSON.stringify(inviteData);
        console.log(body);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._url + 'api/Customers/sendGuestWspNotification', body,  { headers: headers })
            .map((res: Response) => AuthService.json(res))
            .catch(this.handleError);

    };

    private static json(res: Response): any {
        return res.text() === "" ? res : res.json();
    }

    private handleError(error:any) {
        console.error('adasdasdasdasdasdasdasdasdsadsdasdasdasdas');
        console.error(error);
        return Observable.throw(error);
    }

    // checkCredentials() {
    //     //alert(localStorage.getItem("user"))
    //     if (localStorage.getItem("user") === null) {
    //
    //         this._router.navigate(['login']);
    //     }
    // }
}
