const MAX_REQUESTS_PER_CRAWL_ARG = '--maxRequestsPerCrawl';

const ZYTE_API_KEY_ENV = 'ZYTE_API_KEY';
const KAFKA_BROKERS_ENV = 'KAFKA_BROKERS';
const KAFKA_TOPIC_ENV = 'KAFKA_TOPIC';
const KAFKA_SCHEMA_REGISTRY_API_URL = 'KAFKA_SCHEMA_REGISTRY_API_URL';

const defaultMaxRequestPerCrawl = 50;
const args = process.argv.slice(2);

const maxRequestPerCrawl = Number(
  args.find((arg) => arg.startsWith(MAX_REQUESTS_PER_CRAWL_ARG))?.split('=')[1]
);

// not used yet
// const storagePath = args.find((arg) => arg.startsWith(STORAGE_PATH_ARG))?.split('=')[1];
// if (!storagePath) {
//   console.error('Argument storagePath is not defined, exiting');
//   process.exit(1);
// }

const zyteApiKey = process.env[ZYTE_API_KEY_ENV];
const kafkaBrokers = process.env[KAFKA_BROKERS_ENV]?.split(',');
const kafkaTopic = process.env[KAFKA_TOPIC_ENV];
const kafkaSchemaRegistryApiUrl = process.env[KAFKA_SCHEMA_REGISTRY_API_URL];

if (!kafkaBrokers || !kafkaBrokers.length) {
  console.error('Kafka brokers are not defined, exiting');
  process.exit(1);
}

if (!kafkaTopic) {
  console.error('Kafka topic is not defined, exiting');
  process.exit(1);
}

if (!kafkaSchemaRegistryApiUrl) {
  console.error(
    'Kafka schema register is not defined, exiting. Value could be: http://redpanda:8081'
  );
  process.exit(1);
}

const env = {
  zyteApiKey,
  kafkaBrokers,
  kafkaTopic,
  kafkaSchemaRegistryApiUrl,
};

export const getEnvValueOrFail = (key: keyof typeof env): string => {
  const value = env[key];
  if (value == undefined) {
    throw new Error(`Env parameter for "${key}" was not defined`);
  }
  return String(value);
};

export const getMaxRequestPerCrawl = (defaultValue = defaultMaxRequestPerCrawl) =>
  !Number.isNaN(maxRequestPerCrawl) ? maxRequestPerCrawl : defaultValue;
