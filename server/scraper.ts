import { Scraper, Melonbooks, Animate, Mangaoh, Comiczin, Gamers, Toranoana } from 'get-bonus';

const providers = [
  new Melonbooks(),
  new Animate(),
  new Toranoana(),
  new Gamers(),
  new Mangaoh(),
  new Comiczin()
];

export const scraper = new Scraper(...providers);
