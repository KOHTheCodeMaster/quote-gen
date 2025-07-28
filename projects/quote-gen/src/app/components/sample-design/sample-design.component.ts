import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgClass, NgFor, NgStyle} from "@angular/common";
import html2canvas from 'html2canvas-pro';

@Component({
    selector: 'app-sample-design',
    standalone: true,
    imports: [
        FormsModule,
        NgClass,
        NgStyle,
        NgFor
    ],
    templateUrl: './sample-design.component.html',
    styleUrl: './sample-design.component.css'
})
export class SampleDesignComponent {
    quoteText: string = '“Input Your Text Here.”';
    manualFontSize: number = 36;
    manualLineHeight: number = 47;
    manualPadding: number = 24;
    isJustifyCenter: boolean = true;
    isItemsCenter: boolean = true;
    isTextCenter: boolean = false;
    justifyContent: string = 'center';
    alignItems: string = 'center';

    // Font selection
    availableFonts = [
        { family: 'Inter, sans-serif', display: 'Inter' },
        { family: 'Arial, Helvetica, sans-serif', display: 'Arial' },
        { family: 'Georgia, serif', display: 'Georgia' },
        { family: 'Times New Roman, Times, serif', display: 'Times New Roman' },
        { family: 'Courier New, Courier, monospace', display: 'Courier New' },
        { family: 'Trebuchet MS, sans-serif', display: 'Trebuchet MS' },
        { family: 'Comic Sans MS, cursive, sans-serif', display: 'Comic Sans MS' },
        { family: 'Roboto, sans-serif', display: 'Roboto' },
        { family: 'Montserrat, sans-serif', display: 'Montserrat' },
        { family: 'Lobster, cursive', display: 'Lobster' },
        { family: 'Pacifico, cursive', display: 'Pacifico' },
        { family: 'Oswald, sans-serif', display: 'Oswald' },
        { family: 'Merriweather, serif', display: 'Merriweather' },
        { family: 'Dancing Script, cursive', display: 'Dancing Script' },
        { family: 'Fira Mono, monospace', display: 'Fira Mono' },
    ];
    selectedFontFamily: string = this.availableFonts[0].family;

    get alignmentClass(): string {
        const len = this.quoteText.trim().length;
        if (len < 40) return 'items-center justify-center'; // center
        if (len < 100) return 'items-center justify-start'; // top-center
        return 'items-center justify-start'; // top-left for long quotes
    }

    get manualFontSizeStyle(): any {
        const style: any = {};
        if (this.manualFontSize) style['font-size.px'] = this.manualFontSize;
        if (this.manualLineHeight) style['line-height'] = this.manualLineHeight + 'px';
        return style;
    }

    get computedFontSize(): number {
        return this.manualFontSize;
    }
    get computedLineHeight(): number {
        return this.manualLineHeight;
    }

    getPreviewElement(): HTMLElement | null {
        return document.querySelector('#quote-preview-area');
    }

    getTimestampedFilename(ext: string): string {
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const ms = now.getMilliseconds().toString().padStart(3, '0');
        const day = pad(now.getDate());
        const month = now.toLocaleString('en-US', { month: 'short' });
        const year = now.getFullYear();
        let hour = now.getHours();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        if (hour === 0) hour = 12;
        const min = pad(now.getMinutes());
        const sec = pad(now.getSeconds());
        return `quote-${day}-${month}-${year} - ${pad(hour)}-${min}-${sec}-${ms}-${ampm}.${ext}`;
    }

    async downloadQuoteImage(type: 'png' | 'jpg') {
        const el = this.getPreviewElement();
        if (!el) return;
        const canvas = await html2canvas(el, { backgroundColor: null, useCORS: true });
        const mime = type === 'png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mime);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = this.getTimestampedFilename(type);
        link.click();
    }

    setJustifyContent(value: string) {
        this.justifyContent = value;
    }
    setAlignItems(value: string) {
        this.alignItems = value;
    }
    // Toggle Justify Content (center <-> flex-start)
    toggleJustifyContent() {
        this.justifyContent = this.isJustifyCenter ? 'center' : 'flex-start';
    }
    // Toggle Align Items (center <-> flex-start)
    toggleAlignItems() {
        this.alignItems = this.isItemsCenter ? 'center' : 'flex-start';
    }
    // Toggle Text Center (center <-> left)
    toggleTextCenter() {
        // No-op: handled by isTextCenter binding in template
    }
    // Reset font size
    resetFontSize() {
        this.manualFontSize = 36;
    }
    // Reset line height
    resetLineHeight() {
        this.manualLineHeight = 47;
    }
    // Reset padding
    resetPadding() {
        this.manualPadding = 24;
    }
    // Hard reset all controls (does NOT clear quote text)
    hardReset() {
        this.manualFontSize = 36;
        this.manualLineHeight = 47;
        this.manualPadding = 24;
        this.isJustifyCenter = true;
        this.isItemsCenter = true;
        this.isTextCenter = false;
        this.justifyContent = 'center';
        this.alignItems = 'center';
        // Do NOT clear quoteText
    }

    // When font size changes, update line height automatically for real-time UX
    onFontSizeChange(newFontSize: number) {
        this.manualFontSize = newFontSize;
        // Set line height to 1.3x font size, rounded
        this.manualLineHeight = Math.round(newFontSize * 1.3);
    }
}
