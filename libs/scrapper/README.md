# scrapper

Manages crawling and publishing workflow, integrating a crawler with broker for data publication.

## Core Components

### Scrapper

- Coordinates an `AbstractResourceCrawler` and `KafkaPublisher` for data extraction and message publishing.
- Key Methods:
  - `init()`: Connects to Kafka, initializing the publisher.
  - `run()`: Runs the crawler.
  - `publishArticles(data)`: Serializes and publishes articles to Kafka.

### ScrapperConfig (`IScrapperConfig` and `ScrapperConfig`)

- **IScrapperConfig**: Defines configuration options for crawler and publisher.
  - `crawler`: Options for `maxRequestsPerCrawl` and `initialRequests`.
  - `publisher`: Includes `brokers` and `topic`.
- **ScrapperConfig**: Implements `IScrapperConfig` using environment variables and CLI args (e.g., `maxRequestsPerCrawl`).

### Config

Handles env and arg settings for proxies (Zyte), Kafka connection, request limits etc.

## Building

Run `nx build scrapper` to build the library.

## Running unit tests

Run `nx test scrapper` to execute the unit tests via [Jest](https://jestjs.io).
