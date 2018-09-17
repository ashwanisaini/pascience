import {Injectable, QueryList} from '@angular/core';
import {RouterModule, Router} from '@angular/router';
import {Http, Request, Response, Headers, RequestOptionsArgs, RequestMethod} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ElasticService {
    //http://ec2-34-209-236-55.us-west-2.compute.amazonaws.com:9000/api/adminLogin
    //private _loginUrl = 'http://localhost:3000/api/Customers/login';
    private _url = 'http://52.8.103.166:8080'; //elastic api url
    private _loopback_url = 'http://52.8.103.166:3000'; //loopback api url
    private _clientType = 'ELASTIC_CLIENT';

    //databaseName, tableName

    constructor(private _router: Router,
                private _http: Http) {
    }


    testAPI() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._url + '/platform', null, {headers: headers})
            .map((res: Response) => ElasticService.json(res))
            .catch(this.handleError);
    }

    addData(data: any, databaseName, tableName, rowID) {
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._url + '/platform/write/ELASTIC_CLIENT' + '/' + databaseName + '/' + tableName + '/' + rowID, body, {headers: headers})
            .map((res: Response) => ElasticService.json(res))
            .catch(this.handleError);
    }

    addBulkData(data: any, databaseName, tableName) {
        let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._url + '/platform/write/bulk/ELASTIC_CLIENT' + '/' + databaseName + '/' + tableName, body, {headers: headers})
            .map((res: Response) => ElasticService.json(res))
            .catch(this.handleError);
    }

    getData(databaseName: string, tableName: string, rowID: string | number): Observable<ElasticService[]> {
        //let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.get(this._url + '/platform/get/ELASTIC_CLIENT' + '/' + databaseName + '/' + tableName + '/' + rowID, {headers: headers})
            .map((res: Response) => ElasticService.json(res))
            .catch(this.handleError);

    }

    getAllDBUsers() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.get(this._loopback_url + '/api/Customers/getUserDetails', {headers: headers})
            .map((res: Response) => ElasticService.json(res))
            .catch(this.handleError);
    }

    getDataByColumnName(databaseName: string, tableName: string, colName: string, colValue: any): Observable<ElasticService[]> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.get(this._url + '/platform/getAll/ELASTIC_CLIENT' + '/' + databaseName + '/' + tableName + '?offset=0&limit=5000&sortOrder=DESC&rawQuery=' + colName + '%3A' + colValue, {headers: headers})
            .map((res: Response) => ElasticService.json(res))
            .catch(this.handleError);
    }

    getAllRows(databaseName: string, tableName: string, offset: number, limit: number, sort: string, sortField: string = '_uid'): Observable<ElasticService[]> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.get(this._url + '/platform/getAll/ELASTIC_CLIENT' + '/' + databaseName + '/' + tableName + '?offset=' + offset + '&limit=' + limit + '&sortOrder=' + sort + '&sortField=' + sortField, {headers: headers})
            .map((res: Response) => ElasticService.json(res))
            .catch(this.handleError);
    }

    getCountRows(databaseName: string, tableName: string, query: any): Observable<ElasticService[]> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.get(this._url + '/platform/count/ELASTIC_CLIENT' + '/' + databaseName + '/' + tableName + '?rawQuery=' + query, {headers: headers})
            .map((res: Response) => ElasticService.json(res))
            .catch(this.handleError);
    }

    getTableSearch(databaseName: string, tableName: string, filterField: string, filterValue: any, sortOrder: string = '', sortField: string = '', offset: number = 0, limit: number = 500): Observable<ElasticService[]> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.get(this._url + '/platform/search/ELASTIC_CLIENT' + '/' + databaseName + '/' + tableName + '?filterField=' + filterField + '&filterValue=' + filterValue + '&offset=' + offset + '&limit=' + limit + '&sortField=' + sortField + '&sortOrder=' + sortOrder, {headers: headers})
            .map((res: Response) => ElasticService.json(res))
            .catch(this.handleError);
    }

    getTableDataByRawQueryFields(databaseName: string, tableName: string, rawQueryString: string, fieldsToFetch: string, offset: number, limit: number, sort: string = 'Desc',sortField:string='_uid') {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.get(this._url + '/platform/getAll/ELASTIC_CLIENT' + '/' + databaseName + '/' + tableName + '?offset=' + offset + '&limit=' + limit + '&sortOrder=' + sort +'&sortField=_uid' + '&rawQuery=' + rawQueryString + '&fieldsToFetch=' + fieldsToFetch, {headers: headers})
            .map((res: Response) => ElasticService.json(res))
            .catch(this.handleError);

    }

    getTableSearchByRowId(databaseName: string, tableName: string, rowID: string): Observable<ElasticService[]> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.get(this._url + '/platform/get/ELASTIC_CLIENT' + '/' + databaseName + '/' + tableName + '/' + rowID, {headers: headers})
            .map((res: Response) => ElasticService.json(res))
            .catch(this.handleError);
    }

    addFileToContainer(file: any, container: string) {
        let headers = new Headers();
        let body = JSON.stringify(file);
        headers.append('Content-Type', 'application/json');
        return this._http.post(this._loopback_url + '/api/containers/' + container, body, {headers: headers})
            .map((res: Response) => ElasticService.json(res))
            .catch(this.handleError);
    }

    getAllAggregate(databaseName: string, tableName: string, aggFactField: string, aggNumericDataField: string, aggType: string, rawQuery: string = ''): Observable<ElasticService[]> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.get(this._url + '/platform/aggregate/ELASTIC_CLIENT' + '/' + databaseName + '/' + tableName + '?aggFactField=' + aggFactField +
            '&aggNumericDataField=' + aggNumericDataField + '&aggType=' + aggType + '&rawQuery=' + rawQuery, {headers: headers})
            .map((res: Response) => ElasticService.json(res))
            .catch(this.handleError);
    }

    getAllRowsByFields(databaseName: string, tableName: string, offset: number, limit: number, sort: string): Observable<ElasticService[]> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.get(this._url + '/platform/getAll/ELASTIC_CLIENT' + '/' + databaseName + '/' + tableName + '?offset=' + offset + '&limit=' + limit + '&sortOrder=' + sort, {headers: headers})
            .map((res: Response) => ElasticService.json(res))
            .catch(this.handleError);
    }

    deleteData(databaseName: string, tableName: string, rowID: string | number): Observable<ElasticService[]> {
        //let body = JSON.stringify(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.delete(this._url + '/platform/ELASTIC_CLIENT' + '/' + databaseName + '/' + tableName + '/' + rowID, {headers: headers})
            .map((res: Response) => ElasticService.json(res))
            .catch(this.handleError);

    }
    // getColumnNames(databaseName, tableName, rowID,limit){
    //     let headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     return this._http.get(this._url + '/platform/ELASTIC_CLIENT'+'/' + databaseName + '/' + tableName + '/' + rowID, query ,{ headers: headers })
    //         .map((res: Response) => ElasticService.json(res))
    //         .catch(this.handleError);
    //
    //
    // }


    // login(user: any) {
    //     let body = JSON.stringify(user);
    //     let headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     //return this._http.post(this._loginUrl, body, { headers: headers }).map((res:Response) => res.json());
    //     return this._http.post(this._url + 'api/Customers/login', body,  { headers: headers })
    //         .map((res: Response) => AuthService.json(res))
    //         .catch(this.handleError);
    // }
    //
    // register(user: any){
    //     let body = JSON.stringify(user);
    //     console.log(body);
    //     let headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     return this._http.post(this._url + 'api/Customers', body,  { headers: headers })
    //         .map((res: Response) => AuthService.json(res))
    //         .catch(this.handleError);
    //
    // }

    private static json(res: Response): any {
        return res.text() === "" ? res : res.json();
    }

    private handleError(error: any) {
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
