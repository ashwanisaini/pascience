import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ElasticService } from '../../shared/services/elastic.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'data-management.component.html',
    styleUrls: ['data-management.component.scss'],
    animations: [routerTransition()]
})
export class DataManagementComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    public allUsers: Array<any> = [];
    public alertMessage;

    constructor(private _elasticService:ElasticService) {
    }

    ngOnInit() {
        //this.getAllDbUsers();
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }

    // getAllDbUsers(){
    //     this._elasticService.getAllDBUsers()
    //         .subscribe(
    //             response => {
    //                 // doing logic with response
    //                 this.allUsers = response.data;
    //                 console.log(response);
    //             },
    //             error => {
    //                 this.alertMessage = 'error in response';
    //             }
    //         );
    // }
}
