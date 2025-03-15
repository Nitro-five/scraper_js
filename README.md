# UniversalScrapper

A web scraping framework built on top of Crawlee. This project provides tools for defining custom crawlers, Kafka-based data publishing, and Avro serialization for data extraction and integration into data pipelines.

## Repository Structure

This monorepo contains libraries that work together to enable scraping, data serialization, and publishing.

### Libraries

1. **`libs/crawler`**: Defines a flexible framework for building crawlers using Cheerio and Playwright.

   - **Core Classes**:
     - `CheerioResourceCrawler` and `PlaywrightResourceCrawler`: Classes for extending to create new crawlers.
     - `CrawlerElement` and `CrawlerPage`: Element facades to unify Playwright and Cheerio element handling.

2. **`libs/infrastructure`**: Provides tools for integrating with Kafka and Avro serialization.

   - **KafkaPublisher**: Handles publishing messages to Kafka topics.
   - **AvroSerializer**: Supports Avro schema-based data serialization, with pre-configured `articleSerializer` and `keySerializer`.

3. **`libs/scrapper`**: Manages crawling workflows, integrating a crawler with Kafka for data publication.
   - **Scrapper**: Coordinates a crawler and a publisher, serializing extracted data before sending it to Kafka.
   - **ScrapperConfig**: Configuration class for managing crawler and publisher settings.

## Development run

Prepare `.env` file with command:
```shell
cp [.env.template](.env.template) .env
```

Ask for `.env` (`ZYTE_API_KEY`, for instance) secrets your supervisor. To fill in missing values inside `.env`.

Add localhost alias for redpanda into your OS `/etc/hosts`: `127.0.0.1 redpanda`
Read on how to edit `/etc/hosts` in various OS [here](https://www.manageengine.com/network-monitoring/how-to/how-to-add-static-entry.html).

At first, setup all required container with command:
```shell
`docker-compose -f ./compose.dev.yml up -d`
```

In order to run crawler in dev mode:

```shell
nx serve <domain_name>
```
e.g.:
```shell
nx serve test_dev
```

One could check published to Kafka topic articles, found by crawler with web interface: http://localhost:9000/topic/article

## Run in Crawlab

Build scrapper with `nx build name_of_scrapper` command.
Install all necessary dependencies:
```shell
cd ./dist/apps/name_of_scrapper
npm i -q --omit=dev
```

Create new spider with [Crawlab UI](http://localhost:8080/#/spiders/):
- Name: Foobar
- Execute Command: `node main.js`
- upload entire directory `dist/apps/name_of_scrapper` to Crawlab

# Scaffold crawler's code with generator

Run generator with command in the root of current repo:
`nx g crawler`

Enter required data (name and crawler type):
```shell
✗ nx g crawler

 NX  Generating @universal-scrapper/generator:crawler

✔ What's the project name? · foobar
✔ Provide the crawler type · zyte

CREATE apps/foobar/src/main.ts
CREATE apps/foobar/tsconfig.app.json
CREATE apps/foobar/tsconfig.json
CREATE apps/foobar/webpack.config.js
CREATE apps/foobar/project.json
CREATE apps/foobar/.eslintrc.json
CREATE apps/foobar/jest.config.ts
CREATE apps/foobar/tsconfig.spec.json
CREATE apps/foobar/src/foobar-crawler.spec.ts
CREATE apps/foobar/src/foobar-crawler.ts
```

Adjust main crawler file `foobar-crawler.ts`:
- to build logic on reading page's content to derive page's time: whether this is an article, or catalog page or even unrelated page (like Advertisement or Informational page),
- if page is article, call Page's [query methods](libs/crawler/src/lib/crawler-element/crawler-element.ts) to acquire all necessary article fields, 
- finally adjust unit test `foobar-crawler.spec.ts` to cover queries invocations and make PR green before requesting for approval.# scraper_js
