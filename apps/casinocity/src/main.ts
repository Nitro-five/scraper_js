import { CasinocityCrawler, initialRequests } from './casinocity-crawler';
import { Scrapper } from '@universal-scrapper/scrapper';

const main = async () => {
  const crawler = new CasinocityCrawler();  // Убираем аргументы из конструктора
  const scrapper = new Scrapper(crawler);

  await scrapper.init();
  await scrapper.run();
};

main();
