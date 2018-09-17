import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-layout',
    templateUrl: 'frontend.component.html',
    styleUrls: ['frontend.component.scss']
})
export class FrontendComponent implements OnInit {

    constructor(public router: Router) { }

    ngOnInit() {
        // if (this.router.url === '/') {
        //     this.router.navigate(['/company']);
        // }
    }

}
