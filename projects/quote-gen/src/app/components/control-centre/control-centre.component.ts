// src/app/components/control-centre/control-centre.component.ts
import {Component} from '@angular/core';

@Component({
  selector: 'app-control-centre',
  templateUrl: './control-centre.component.html',
  styleUrls: ['./control-centre.component.css'],
  standalone: true
})
export class ControlCentreComponent {

  constructor(/*private canvasComponent: CanvasComponent*/) {
  }

  generateNewQuote(): void {
    // this.canvasComponent.drawQuote();
  }

  downloadImage(format: 'jpg' | 'png'): void {
    /*
            const canvas = this.canvasComponent['canvasRef'].nativeElement;
            const link = document.createElement('a');
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            link.download = `quote_${timestamp}.${format}`;
            link.href = canvas.toDataURL(`image/${format}`, format === 'jpg' ? 0.9 : 1);
            link.click();
    */
  }
}
