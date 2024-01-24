import { Scraper, Melonbooks, Animate, Mangaoh, Comiczin, Gamers, Toranoana } from 'get-bonus';

const providers = [
  new Melonbooks(),
  new Animate(),
  new Mangaoh(),
  new Comiczin(),
  new Gamers(),
  new Toranoana()
];

export const scraper = new Scraper(...providers);
