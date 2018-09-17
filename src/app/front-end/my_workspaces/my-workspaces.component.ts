import { Component, OnInit, EventEmitter, Input, Output, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { AuthService, ElasticService, AlertService, Utils } from '../../shared/services/index';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'my-workspaces.component.html',
    styleUrls: ['my-workspaces.component.css'],
    animations: [routerTransition()]
})
export class MyWorkspaceComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    public allWorkspaces: Array<any> = [];
    public alertMessage;
    public user:any = {};

    constructor(private router:Router, private _elasticService:ElasticService, private authService: AuthService, private helper: Utils) {
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
                this.router.navigate(['/login'])
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
    }

    workspaceDetail(id){
        console.log(id);
        //this.router.navigate(['workspace-details'],)
        this.router.navigate(['/workspace-details'], { queryParams: { id: id } });
    }

    createWS(){
        let rowID = this.helper.generateUUID();
        let data :any = {};
        data.ws_name = "New Workspace";
        data.ws_color = null;
        data.ws_icon = null;
        data.customer_id = this.user.id;
        data.author_id = this.user.id;
        data.company_id = this.user.company_id;
        data.created = new Date();
        data.modified = new Date();
        data.users = [];
        data.boards = [];
        data.datasources = [];

        this._elasticService.addData(data, 'pa_science','workspaces', rowID)
            .subscribe(
                response=>{
                    let board_uuid = this.helper.generateUUID();
                    let boards = {
                        name: 'Welcome Board',
                        ws_id: rowID,
                        company_id: this.user.company_id,
                        ordernumber: 1
                    };

                    this._elasticService.addData(boards, this.user.company_id,'boards', board_uuid)
                        .subscribe(
                            response=>{
                                this.allWorkspaces.push(data);
                                //$scope.total_workspaces = $scope.sources.length;
                            },
                            error=>{
                                console.log(error);
                            });
                },
            error=>{
                console.log(error);
            });




    }

    renameWorkspace($event,workspace:any){
        //console.log(workspace);
        this._elasticService.addData(workspace, 'pa_science','workspaces', workspace.ROWID)
            .subscribe(
                response=>{

                },
                error=>{
                    console.log(error);
                });
    }
}
