import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-layout',
    templateUrl: 'admins.component.html',
    styleUrls: ['admins.component.scss']
})
export class AdminsComponent implements OnInit {

    constructor(public router: Router) { }

    ngOnInit() {
        if (this.router.url === '/') {
            this.router.navigate(['/company']);
        }
    }

}
