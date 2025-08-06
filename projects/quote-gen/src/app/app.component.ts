import {Component} from '@angular/core';
import {SampleDesignComponent} from "./components/sample-design/sample-design.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [SampleDesignComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'quote-gen';
}
