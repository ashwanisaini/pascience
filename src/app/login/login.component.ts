import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService, ElasticService, AlertService, Utils } from '../shared/services/index';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    public form: FormGroup;
    public alertMessage;
    public userInfo:any;

    constructor(public router: Router, private fb: FormBuilder, private authService: AuthService, private alert: AlertService) {

        this.form = this.fb.group({
            'username': ['', Validators.compose([Validators.required])],
            'password': ['', Validators.compose([Validators.required])]
        });
    }

    ngOnInit() {
    }

    // onLoggedin() {
    //     localStorage.setItem('isLoggedin', 'true');
    // }

    login(form){
        this.alertMessage = '';
        this.authService.login(form.value)
            .subscribe(
                response => {
                    // doing logic with responce
                    if (response.id) {
                        this.alertMessage = 'Logging in..';
                        localStorage.setItem('user', JSON.stringify(response));
                        this.processLogin(response);

                        //this.router.navigate(['company']);
                        //return response.id;
                    }
                },
                error => {
                    this.alertMessage = 'Invalid Email/Password';
                }
            );
    }

    private processLogin(token:any){
        console.log('process login',token);
        this.authService.CheckUserCredentials()
            .subscribe(
                response => {
                    this.userInfo = response;
                    if(this.userInfo.role_id == 1 || this.userInfo.role_id == 2){
                        console.log('admin login');
                        this.alert.dark('Welcome Admin',true);
                        this.router.navigate(['admin/company']);

                    }else{
                        console.log('front end user login');
                        this.alert.dark('Welcome user',true);
                        this.router.navigate(['my_workspaces']);
                    }
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                    console.log(error);
                }
            );


    }

}
