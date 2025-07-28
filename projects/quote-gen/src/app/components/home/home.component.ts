import {Component} from '@angular/core';
import {SampleDesignComponent} from "../sample-design/sample-design.component";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [SampleDesignComponent, ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {

}
