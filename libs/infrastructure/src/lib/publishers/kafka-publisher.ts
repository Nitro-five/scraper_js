import { Kafka, Message, Producer } from 'kafkajs';
import { Publisher } from './publisher';

export type KafkaPublisherConfig = {
  brokers: string[];
  topic: string;
};

export class KafkaPublisher implements Publisher {
  private producer: Producer;
  private defaultTopic: string;

  constructor({ brokers, topic }: KafkaPublisherConfig) {
    this.producer = new Kafka({ brokers }).producer();
    this.defaultTopic = topic;
  }

  async connect(): Promise<void> {
    await this.producer.connect();
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }

  async publish(messages: Message[], topic?: string): Promise<void> {
    await this.producer.send({
      topic: topic || this.defaultTopic,
      messages: messages,
    });
  }
}
