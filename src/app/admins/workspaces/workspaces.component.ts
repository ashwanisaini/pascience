import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ElasticService } from '../../shared/services/elastic.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'workspaces.component.html',
    styleUrls: ['workspaces.component.scss'],
    animations: [routerTransition()]
})
export class WorkspaceComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    public allWorkspaces: Array<any> = [];
    public alertMessage;
    public user = {};

    constructor(private _elasticService:ElasticService, private authService: AuthService) {
    }

    ngOnInit() {

         this.authService.CheckUserCredentials()
            .subscribe(
            response => {

                this.user = response;
                // console.log(response);
                // console.log(response.company_id);
                this.getAllDbWorkspaces(response.company_id);
            },
            error => {
                this.alertMessage = 'error in response';
            }
        );
        //console.log(this.user);
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }

    getAllDbWorkspaces(companyId){
        //let companyId = this.user.company_id;
        console.log(this.user);
        this._elasticService.getDataByColumnName('pa_science','workspaces','company_id',companyId)
            .subscribe(
                response => {
                    // doing logic with response
                    this.allWorkspaces = response;
                    console.log(response);
                },
                error => {
                    this.alertMessage = 'error in response';
                }
            );






        // this._elasticService.getDataByColumnName('pa_science','workspaces','company_id',companyId)
        //     .subscribe(
        //         response => {
        //             // doing logic with response
        //             this.allWorkspaces = response.data;
        //             //console.log(response);
        //         },
        //         error => {
        //             this.alertMessage = 'error in response';
        //         }
        //     );
    }
}
