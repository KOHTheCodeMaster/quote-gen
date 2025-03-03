// src/app/services/quote.service.ts
import { Injectable } from '@angular/core';
import { Quote } from '../model/quote.model';

@Injectable({
    providedIn: 'root'
})
export class QuoteGeneratorService {
    private quotes: Quote[] = [
        {
            text: "Success is not final failure is not fatal It is the courage to continue that counts",
            author: "Winston Churchill"
        },
        {
            text: "The only way to do great work is to love what you do",
            author: "Steve Jobs"
        },
        // Add 50+ more quotes
    ];

    constructor() {}

    getRandomQuote(): Quote {
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        return this.quotes[randomIndex];
    }
}
