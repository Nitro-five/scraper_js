# infrastructure

Provides Kafka message publishing and Avro serialization.

## Modules

### Kafka Publisher

- Publishes messages to Kafka topics.
- Configurable with `brokers` and `topic`.
- Methods:
  - `connect()`: Connects to Kafka.
  - `disconnect()`: Disconnects from Kafka.
  - `publish(messages, topic?)`: Publishes messages to a topic.

### Avro Serializer

- Serializes data using Avro schemas.
- Classes:
  - `AvroSerializer`: Generic serializer.
  - `articleSerializer` / `keySerializer`: Pre-configured with `DigitalWires` and `DigitalWiresKey` schemas.

## Schemas

- `articleSchema` and `keySchema`: Define data structure for serialization.
- Types: `DigitalWires`, `DigitalWiresKey`.

## Building

Run `nx build infrastructure` to build the library.

## Running unit tests

Run `nx test infrastructure` to execute the unit tests via [Jest](https://jestjs.io).
