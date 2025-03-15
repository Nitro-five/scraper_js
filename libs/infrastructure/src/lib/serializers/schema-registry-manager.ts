import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import { createLogger } from '@universal-scrapper/logger';
import { Mutex } from 'async-mutex';
import { RawAvroSchema } from './schemas';

export class SchemaRegistryManager {
  protected readonly logger = createLogger(this.constructor.name);
  private readonly registry: SchemaRegistry;
  private isSchemaPublished: Record<string, number> = {};
  private readonly mutex = new Mutex();

  constructor(schemaRegisterApiUrl: string) {
    this.registry = new SchemaRegistry({ host: schemaRegisterApiUrl });
  }

  public async serialize(data: unknown, name: string, schema: RawAvroSchema): Promise<Buffer> {
    const registryId = await this.registerSchema(name, schema);
    return this.registry.encode(registryId, data);
  }

  private async registerSchema(name: string, schema: RawAvroSchema): Promise<number> {
    if (this.isSchemaPublished[name] !== undefined) {
      return this.isSchemaPublished[name];
    }
    const release = await this.mutex.acquire();
    if (this.isSchemaPublished[name]) {
      release();
      return this.isSchemaPublished[name];
    }
    try {
      const registryId = await this.registerSchemaInner(name, schema);
      this.isSchemaPublished[name] = registryId;
      return registryId;
    } finally {
      release();
    }
  }

  private async registerSchemaInner(name: string, schema: RawAvroSchema): Promise<number> {
    try {
      const { id } = await this.registry.register(schema, { subject: name });
      this.logger.info(`Schema registered with ID: ${id}`);
      return id;
    } catch (error) {
      this.logger.error('Error registering schema:', error);
      throw error;
    }
  }
}
