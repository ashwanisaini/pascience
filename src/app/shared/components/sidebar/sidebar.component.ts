import { Component, OnInit } from '@angular/core';
import {AuthService, ElasticService, AlertService, Utils} from '../../services/index';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{
    isActive = false;
    showMenu = '';
    public userInfo:any;

    constructor(private authService: AuthService,
                private _elasticService: ElasticService,
                private alertService: AlertService,
                private helper: Utils) {
        this.authService.CheckUserCredentials()
            .subscribe(
                response => {
                    this.userInfo = response;
                    console.log('sidebar');
                    console.log(this.userInfo);
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                    console.log("error while checking user data");
                }
            );

    }



    ngOnInit() {

    }

    eventCalled() {
        this.isActive = !this.isActive;
    }
    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }
}
