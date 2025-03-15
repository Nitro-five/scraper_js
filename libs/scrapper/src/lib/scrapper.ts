import { CrawlerArticle, ResourceCrawler } from '@universal-scrapper/crawler';
import {
  KafkaPublisher,
  AvroSerializer,
  getArticleSerializer,
  DigitalwiresWrapperSchema,
  hash,
} from '@universal-scrapper/infrastructure';
import { getEnvValueOrFail } from './config';
import { createLogger } from '@universal-scrapper/logger';
import { Configuration, Dataset } from 'crawlee';
import { SchemaRegistryManager } from '@universal-scrapper/infrastructure';

export class Scrapper {
  private readonly logger = createLogger('Scrapper');
  private readonly topic = getEnvValueOrFail('kafkaTopic');

  private publisher = new KafkaPublisher({
    brokers: [getEnvValueOrFail('kafkaBrokers')],
    topic: this.topic,
  });
  private articleSerializer: AvroSerializer<DigitalwiresWrapperSchema>;
  private inited = false;

  constructor(private readonly crawler: ResourceCrawler) {
    const config = Configuration.getGlobalConfig();

    const crawlerName = crawler.constructor.name;

    config.set('defaultDatasetId', crawlerName);
    config.set('defaultKeyValueStoreId', crawlerName);
    config.set('defaultRequestQueueId', crawlerName);
    config.set('purgeOnStart', false);

    this.crawler.addArticleExtractedListener((articles: CrawlerArticle[]) =>
      this.publishArticles(articles)
    );

    const schemaManager = new SchemaRegistryManager(getEnvValueOrFail('kafkaSchemaRegistryApiUrl'));
    this.articleSerializer = getArticleSerializer(schemaManager);
  }

  async init() {
    try {
      await this.publisher.connect();
      this.inited = true;
    } catch (error) {
      console.error('Failed to connect to Kafka publisher:', error);
      throw new Error(
        'Unable to establish connection with Kafka publisher. Check the configuration and network connection.'
      );
    }
  }

  async run() {
    if (!this.inited) {
      throw new Error('Invoke scrapper.init() before running');
    }
    return this.crawler.run();
  }

  private mapArticleToDigitalWiresMessage(article: CrawlerArticle): DigitalwiresWrapperSchema {
    return {
      ...article,
      digitalwires: {
        ...article.digitalwires,
        entry_id: hash(article.digitalwires.urn),
      },
    };
  }

  async publishArticles(data: CrawlerArticle[]) {
    await Promise.all(
      data.map(async (article) => {
        const serializedArticle = await this.articleSerializer.serialize(
          this.mapArticleToDigitalWiresMessage(article),
          `${this.topic}-value`
        );
        try {
          await this.publisher.publish([{ value: serializedArticle }]);
          this.logger.debug(
            `Article "${article.digitalwires.headline}" has been published to Kafka`
          );

          await Dataset.pushData(article);
          this.logger.debug(
            `Article "${article.digitalwires.headline}" has been published to Crawlab`
          );
        } catch (error: unknown) {
          const errorStringified =
            error && typeof error === 'object' && 'message' in error
              ? error.message
              : JSON.stringify(error);
          this.logger.debug(
            `Article "${article.digitalwires.headline}" publish to Kafka failed with error: ${errorStringified}`
          );
          throw error;
        }
      })
    );
  }
}
