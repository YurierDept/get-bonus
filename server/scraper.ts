import { Scraper, Melonbooks } from 'get-bonus';

const providers = [new Melonbooks()];

export const scraper = new Scraper(...providers);
