import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgClass, NgFor, NgIf, NgStyle} from "@angular/common";
import html2canvas from 'html2canvas-pro';

@Component({
    selector: 'app-sample-design',
    standalone: true,
    imports: [
        FormsModule,
        NgClass,
        NgStyle,
        NgFor,
        NgIf
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

    // Aspect Ratio Selection
    aspectRatios = [
        { value: '1/1', display: '1:1 (Square)' },
        { value: '16/9', display: '16:9 (Widescreen)' },
        { value: '9/16', display: '9:16 (Portrait)' },
        { value: '4/3', display: '4:3 (Classic)' },
        { value: 'custom', display: 'Custom' }
    ];
    selectedAspectRatio: string = '1/1';
    customAspectWidth: number = 1;
    customAspectHeight: number = 1;
    previewAspectRatio: string = '1/1';

    // --- Aspect Ratio + Dimension Sync Logic ---
    previewWidthPx: number = 420;
    previewHeightPx: number = 420;
    private aspectRatioLock = false;

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
        // Create a hidden container for export to avoid layout/CSS issues
        const exportContainer = document.createElement('div');
        exportContainer.style.position = 'fixed';
        exportContainer.style.left = '-99999px';
        exportContainer.style.top = '0';
        exportContainer.style.width = this.previewWidthPx + 'px';
        exportContainer.style.height = this.previewHeightPx + 'px';
        exportContainer.style.background = '#000';
        exportContainer.style.display = 'flex';
        exportContainer.style.alignItems = this.alignItems;
        exportContainer.style.justifyContent = this.justifyContent;
        exportContainer.style.padding = this.manualPadding + 'px';
        exportContainer.style.boxSizing = 'border-box';
        exportContainer.style.overflow = 'hidden';
        exportContainer.style.borderRadius = '24px'; // match your preview
        // Clone the quote node
        const quoteNode = el.querySelector('p')?.cloneNode(true) as HTMLElement;
        if (quoteNode) {
            quoteNode.style.color = '#fff';
            quoteNode.style.fontSize = this.computedFontSize + 'px';
            quoteNode.style.lineHeight = this.computedLineHeight + 'px';
            quoteNode.style.textAlign = this.isTextCenter ? 'center' : 'left';
            quoteNode.style.fontFamily = this.selectedFontFamily;
            quoteNode.style.width = '100%';
            quoteNode.style.height = 'auto';
            quoteNode.style.margin = '0';
            quoteNode.style.padding = '0 8px';
            quoteNode.style.whiteSpace = 'pre-line';
            quoteNode.style.wordBreak = 'break-word';
            exportContainer.appendChild(quoteNode);
        }
        document.body.appendChild(exportContainer);
        // Wait for DOM
        await new Promise(r => setTimeout(r, 10));
        const canvas = await html2canvas(exportContainer, {
            backgroundColor: null,
            useCORS: true,
            scale: 1,
            width: this.previewWidthPx,
            height: this.previewHeightPx,
            windowWidth: this.previewWidthPx,
            windowHeight: this.previewHeightPx
        });
        document.body.removeChild(exportContainer);
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

    // HD Button logic
    setHD720p() {
        // Retain the current aspect ratio, update width/height smartly
        const [w, h] = this.previewAspectRatio.split('/').map(Number);
        if (w > 0 && h > 0) {
            this.previewWidthPx = 1280;
            this.previewHeightPx = Math.round(1280 * h / w);
        } else {
            this.previewWidthPx = 1280;
            this.previewHeightPx = 720;
        }
    }

    // On init, set to HD 720p with 16:9 aspect
    ngOnInit() {
        this.selectedAspectRatio = '16/9';
        this.previewAspectRatio = '16/9';
        this.previewWidthPx = 1280;
        this.previewHeightPx = 720;
    }

    /**
     * Handle aspect ratio change from dropdown
     */
    onAspectRatioChange() {
        // When aspect ratio changes, keep width, adjust height
        let width = this.previewWidthPx;
        let newHeight = this.previewHeightPx;
        if (this.selectedAspectRatio === 'custom') {
            this.previewAspectRatio = `${this.customAspectWidth}/${this.customAspectHeight}`;
            if (this.customAspectWidth > 0 && this.customAspectHeight > 0) {
                newHeight = Math.round(width * this.customAspectHeight / this.customAspectWidth);
            }
        } else {
            this.previewAspectRatio = this.selectedAspectRatio;
            const [w, h] = this.selectedAspectRatio.split('/').map(Number);
            if (w > 0 && h > 0) {
                newHeight = Math.round(width * h / w);
            }
        }
        this.previewHeightPx = newHeight;
    }

    /**
     * Handle custom aspect ratio input
     */
    onCustomAspectChange() {
        if (this.customAspectWidth > 0 && this.customAspectHeight > 0) {
            this.previewAspectRatio = `${this.customAspectWidth}/${this.customAspectHeight}`;
            // Only update px if not manually changed
            if (!this.aspectRatioLock) {
                this.previewWidthPx = 420;
                this.previewHeightPx = Math.round(420 * this.customAspectHeight / this.customAspectWidth);
            }
        }
    }

    onPreviewWidthChange() {
        // Always allow width edit, update height to maintain aspect ratio
        const [w, h] = this.previewAspectRatio.split('/').map(Number);
        if (w > 0 && h > 0) {
            this.aspectRatioLock = true;
            this.previewHeightPx = Math.round(this.previewWidthPx * h / w);
            setTimeout(() => this.aspectRatioLock = false, 0);
        }
    }
    onPreviewHeightChange() {
        // Always allow height edit, update width to maintain aspect ratio
        const [w, h] = this.previewAspectRatio.split('/').map(Number);
        if (w > 0 && h > 0) {
            this.aspectRatioLock = true;
            this.previewWidthPx = Math.round(this.previewHeightPx * w / h);
            setTimeout(() => this.aspectRatioLock = false, 0);
        }
    }
    resetPreviewDimensions() {
        if (this.selectedAspectRatio === 'custom') {
            this.customAspectWidth = 1;
            this.customAspectHeight = 1;
            this.previewWidthPx = 420;
            this.previewHeightPx = 420;
        } else {
            this.onAspectRatioChange();
        }
    }

    protected readonly Math = Math;
}
