import { ISerializer } from './serializer';
import { articleSchema, DigitalwiresWrapperSchema, RawAvroSchema } from './schemas';
import { SchemaRegistryManager } from './schema-registry-manager';

export class AvroSerializer<DataType = object> implements ISerializer<DataType, Buffer> {
  constructor(
    private readonly schema: RawAvroSchema,
    private readonly schemaManager: SchemaRegistryManager
  ) {}

  public async serialize(data: DataType, name: string): Promise<Buffer> {
    return this.schemaManager.serialize(data, name, this.schema);
  }
}

export const getArticleSerializer = (schemaManager: SchemaRegistryManager) =>
  new AvroSerializer<DigitalwiresWrapperSchema>(articleSchema, schemaManager);
