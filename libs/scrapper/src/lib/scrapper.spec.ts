import { Scrapper } from './scrapper';
import { CheerioResourceCrawler, CrawlerArticle } from '@universal-scrapper/crawler';
import { getArticleSerializer, hash, KafkaPublisher } from '@universal-scrapper/infrastructure';
import { anyFunction, anything, instance, mock, verify, when } from 'ts-mockito';
import { getEnvValueOrFail } from './config';

jest.mock('./config', () => ({
  getEnvValueOrFail: jest.fn(),
}));

jest.mock('@universal-scrapper/infrastructure', () => ({
  ...jest.requireActual('@universal-scrapper/infrastructure'),
  KafkaPublisher: jest.fn(),
  getArticleSerializer: jest.fn(),
}));

describe('Scrapper', () => {
  const KafkaPublisherMock = KafkaPublisher as jest.Mock;
  const kafkaPublisherInstanceMock = {
    connect: jest.fn(),
    publish: jest.fn(),
  };

  const articleSerializeMock = jest.fn();

  const kafkaTopic = 'article';

  beforeEach(() => {
    (getEnvValueOrFail as jest.Mock).mockImplementation((key) => {
      if (key === 'kafkaTopic') {
        return kafkaTopic;
      }
      return undefined;
    });
    (getArticleSerializer as jest.Mock).mockReturnValue({
      serialize: articleSerializeMock,
    });
    KafkaPublisherMock.mockImplementation(() => kafkaPublisherInstanceMock);
  });
  afterEach(() => {
    KafkaPublisherMock.mockReset();
    kafkaPublisherInstanceMock.connect.mockReset();
    kafkaPublisherInstanceMock.publish.mockReset();
    articleSerializeMock.mockReset();
    jest.clearAllMocks();
  });

  it('should register addArticleExtractedListener listener', async () => {
    //arrange
    const crawlerMock = mock<CheerioResourceCrawler>();
    //act
    new Scrapper(instance(crawlerMock));
    //assert
    verify(crawlerMock.addArticleExtractedListener(anyFunction())).once();
  });

  it('should serialize and publish article', async () => {
    //arrange
    const article: CrawlerArticle = {
      digitalwires: {
        article_html: 'html',
        creditline: 'creditline',
        language: 'en',
        urn: 'dsdjueotewdjf',
        version: 1,
        associations: [],
        categories: [],
        current_rubric_names: [],
        dateline: '',
        descriptions: [],
        headline: '',
        keyword_names: [],
        pubstatus: '',
        rubric_names: [],
        teaser: '',
        updated: '',
      },
      asb_meta: {
        debugging_meta: {
          urn: 'dsdjueotewdjf',
          creditline: 'creditline',
          headline: '',
          source_article_url: '',
        },
      },
    };
    const crawlerMock = mock<CheerioResourceCrawler>();

    let registeredListener: ((articles: CrawlerArticle[]) => unknown) | undefined;

    when(crawlerMock.addArticleExtractedListener(anything())).thenCall(
      (listener: (articles: CrawlerArticle[]) => unknown) => (registeredListener = listener)
    );
    when(crawlerMock.run()).thenCall(() => registeredListener?.([article]));

    articleSerializeMock.mockReturnValueOnce('serializedArticle');

    //act
    const scrapper = new Scrapper(instance(crawlerMock));
    await scrapper.init();
    await scrapper.run();

    //assert
    expect(articleSerializeMock).toHaveBeenCalledWith(
      {
        ...article,
        digitalwires: {
          ...article.digitalwires,
          entry_id: hash('dsdjueotewdjf'),
        },
      },
      kafkaTopic + '-value'
    );
    expect(kafkaPublisherInstanceMock.publish).toHaveBeenCalledWith(
      expect.arrayContaining([{ value: 'serializedArticle' }])
    );
  });

  it('should init with connecting publisher', async () => {
    //arrange
    const crawlerMock = mock<CheerioResourceCrawler>();
    //act
    const scrapper = new Scrapper(instance(crawlerMock));
    await scrapper.init();
    //assert
    expect(kafkaPublisherInstanceMock.connect).toHaveBeenCalledTimes(1);
  });

  it('should call crawler run on scrapper run', async () => {
    //arrange
    const crawlerMock = mock<CheerioResourceCrawler>();
    //act
    const scrapper = new Scrapper(instance(crawlerMock));
    await scrapper.init();
    await scrapper.run();
    //assert
    verify(crawlerMock.run()).once();
  });

  it('should throw error if run without init', () => {
    //arrange
    const crawlerMock = mock<CheerioResourceCrawler>();
    //act
    const scrapper = new Scrapper(instance(crawlerMock));
    const act = () => scrapper.run();
    //assert
    expect(act).rejects.toThrow(new Error('Invoke scrapper.init() before running'));
  });
});
