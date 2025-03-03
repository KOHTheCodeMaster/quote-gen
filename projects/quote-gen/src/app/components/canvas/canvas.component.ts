// src/app/components/canvas/canvas.component.ts
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {QuoteGeneratorService} from '../../service/quote-generator.service';

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.css'],
    standalone: true
})
export class CanvasComponent implements OnInit {
    @ViewChild('canvas', {static: true}) canvasRef!: ElementRef<HTMLCanvasElement>;
    private ctx!: CanvasRenderingContext2D;
    private readonly BASE_WIDTH = 1080;
    private readonly BASE_HEIGHT = 1920;

    constructor(private quoteGeneratorService: QuoteGeneratorService) {
    }

    ngOnInit(): void {
        this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
        this.drawQuote();
    }

    drawQuote(): void {
        const quote = this.quoteGeneratorService.getRandomQuote();
        this.clearCanvas();
        this.drawText(quote.text, quote.author);
    }

    private clearCanvas(): void {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.BASE_WIDTH, this.BASE_HEIGHT);
    }

    private drawText(text: string, author: string): void {
        const styles = {
            textColor: '#ffffff',
            shadowColor: 'rgba(0, 0, 0, 0.7)',
            shadowBlur: 20,
            maxLineWidth: this.BASE_WIDTH - 200,
            minFontSize: 40,
            maxFontSize: 120,
            lineHeight: 1.4
        };

        const wrappedText = this.wrapText(text, styles);
        const totalHeight = this.calculateTextHeight(wrappedText.lines, wrappedText.fontSize, styles.lineHeight);
        const startY = (this.BASE_HEIGHT - totalHeight) / 2;

        this.ctx.shadowColor = styles.shadowColor;
        this.ctx.shadowBlur = styles.shadowBlur;
        this.ctx.fillStyle = styles.textColor;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';

        wrappedText.lines.forEach((line, index) => {
            this.ctx.font = `${wrappedText.fontSize}px Arial`;
            const y = startY + (index * wrappedText.fontSize * styles.lineHeight);
            this.ctx.fillText(line, this.BASE_WIDTH / 2, y);
        });

        this.ctx.font = `italic ${wrappedText.fontSize * 0.6}px Arial`;
        this.ctx.fillText(`- ${author}`, this.BASE_WIDTH / 2, startY + totalHeight + 80);
    }

    private wrapText(text: string, styles: any): { lines: string[]; fontSize: number } {
        const words = text.split(' ');
        let lines: string[] = [];
        let currentLine: string[] = [];
        let fontSize = styles.maxFontSize;

        do {
            lines = [];
            currentLine = [];
            this.ctx.font = `${fontSize}px Arial`;

            words.forEach(word => {
                const testLine = [...currentLine, word].join(' ');
                const metrics = this.ctx.measureText(testLine);

                if (metrics.width < styles.maxLineWidth && currentLine.length < 5) {
                    currentLine.push(word);
                } else {
                    lines.push(currentLine.join(' '));
                    currentLine = [word];
                }
            });
            lines.push(currentLine.join(' '));
            fontSize -= 2;
        } while (
            (lines.length * fontSize * styles.lineHeight) > this.BASE_HEIGHT * 0.7 ||
            fontSize > styles.minFontSize
            );

        return {lines, fontSize: fontSize + 2};
    }

    private calculateTextHeight(lines: string[], fontSize: number, lineHeight: number): number {
        return lines.length * fontSize * lineHeight;
    }
}
