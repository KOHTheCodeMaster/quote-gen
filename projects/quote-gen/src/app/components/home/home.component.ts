import { Component } from '@angular/core';
import {CanvasComponent} from "../canvas/canvas.component";
import {ControlCentreComponent} from "../control-centre/control-centre.component";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [
        CanvasComponent,
        ControlCentreComponent
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
