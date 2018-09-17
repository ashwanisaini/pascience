import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { AuthService, ElasticService, AlertService, Utils } from '../../shared/services/index';
import * as _ from 'lodash';


@Component({
    selector: 'app-dashboard',
    templateUrl: 'company.component.html',
    styleUrls: ['company.component.scss'],
    animations: [routerTransition()]
})
export class CompanyComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    public allUsers: Array<any> = [];
    public alertMessage;
    public userInfo = {
        'id':null,
        'role_id':null
    }

    constructor(public router: Router, private _elasticService:ElasticService, private authService: AuthService, private alert: AlertService ,private helper: Utils) {
    }

    ngOnInit() {

        this.authService.CheckUserCredentials()
            .subscribe(
                response => {
                    this.userInfo = response;
                    this.getAllDbUsers();

                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                }
            );

    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }

    getAllDbUsers(){
        this._elasticService.getAllDBUsers()
            .subscribe(
                response => {
                    // doing logic with response
                    //this.allUsers = response.data;
                    //console.log(response);
                    //console.log(this.userInfo);
                    //console.log(this.userInfo.id);
                    let user_id = this.userInfo.id;
                    this.allUsers = _.filter(response.data, function(o:any) {
                       //console.log(o.email);
                        if(o.id == user_id){
                            return false;
                        }else{
                            return true;
                        }
                        //return !o.active;
                    });

                   //console.log(flter);
                },
                error => {
                    this.alertMessage = 'error in response';
                }
            );
    }

    getCompanyDashBoard(user:any={}){
        console.log(user);
        console.log('redirect user to my workpsaces');
        this.router.navigate(['/my_workspaces'], {queryParams:{'companyid':user.company_id} });
        return false;
    }
}
