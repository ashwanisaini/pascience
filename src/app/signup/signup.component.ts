import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment/moment';
import { AuthService } from '../shared/services/auth.service';
import { Utils } from '../shared/services/utility';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
    public form: FormGroup;
    public alertMessage;

    constructor(private fb: FormBuilder, private authService: AuthService, private _router: Router, public helper: Utils) {
        this.form = this.fb.group({
            'first_name': ['', Validators.compose([Validators.required])],
            'last_name': ['', Validators.compose([Validators.required])],
            'email': ['', Validators.compose([Validators.required,Validators.email])],
            'username': ['', Validators.compose([Validators.required])],
            'password': ['', Validators.compose([Validators.required])],
            'cpassword': ['', Validators.compose([Validators.required])],
            'company_group': ['', Validators.compose([Validators.required])]
        });

    }

    ngOnInit() { }

    register(form){
        this.alertMessage = '';
        var data = {
            email: form.value.email.toLowerCase(),
            username: form.value.username.toLowerCase().trim(),
            company_id: this.helper.generateUUID(),
            company_groupname: form.value.company_group.trim(),
            password: form.value.password,
            first_name: form.value.first_name.trim(),
            last_name: form.value.last_name.trim(),
            role_id: 3,
            avatar: "",
            is_owner: 1,
            container: "",
            status: 2,
            'created': new Date(),
            'lastUpdated': new Date(),
            'emailVerified': false
        };


        //console.log(data);
        this.authService.register(data)
            .subscribe(
                response => {
                    this.form.reset();
                    this.alertMessage = 'You have been registered successfully. Please check your mail to activate your account.';
                },
                error => {
                    this.alertMessage = 'Email id already exist. Try with other email id.';
                }
            );

    }

}
