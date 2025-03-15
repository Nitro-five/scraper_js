import { SchemaRegistryManager } from './schema-registry-manager';

import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import { RawAvroSchema } from './schemas';

jest.mock('@kafkajs/confluent-schema-registry', () => ({
  SchemaRegistry: jest.fn(),
}));

describe('SchemaRegistryManager', () => {
  const schemaRegisterApiUrl = 'http://kafkabroker:8081';

  const testSchema: RawAvroSchema = {
    type: 'record',
    name: 'Test',
    namespace: 'test.avro',
    fields: [
      {
        name: 'field',
        type: 'int',
      },
    ],
  };

  const schemaName = 'article-test';

  const registerFnMock = jest.fn();
  const encodeFnMock = jest.fn();

  beforeEach(() => {
    (SchemaRegistry as jest.Mock).mockImplementation(() => ({
      register: registerFnMock,
      encode: encodeFnMock,
    }));
  });

  afterEach(() => jest.clearAllMocks());

  it('should serialize schema with registering it in registry', async () => {
    // arrange
    const schemaManager = new SchemaRegistryManager(schemaRegisterApiUrl);
    registerFnMock.mockResolvedValue({ id: 1 });

    const encoded = Buffer.from('encoded-data');
    encodeFnMock.mockResolvedValue(encoded);

    // act
    const result = await schemaManager.serialize({ field: 123 }, schemaName, testSchema);

    // assert
    expect(result).toEqual(encoded);
    expect(registerFnMock).toHaveBeenCalledWith(testSchema, { subject: schemaName });
  });

  it('should register schema once for multiple concurrent calls', async () => {
    // arrange
    const schemaManager = new SchemaRegistryManager(schemaRegisterApiUrl);
    registerFnMock.mockResolvedValue({ id: 1 });

    // act
    await Promise.all([
      schemaManager.serialize({ field: 123 }, schemaName, testSchema),
      schemaManager.serialize({ field: 456 }, schemaName, testSchema),
      schemaManager.serialize({ field: 789 }, schemaName, testSchema),
    ]);

    // assert
    expect(registerFnMock).toHaveBeenCalledTimes(1);
  });

  it("should fail if data doesn't match schema", async () => {
    // arrange
    const schemaManager = new SchemaRegistryManager(schemaRegisterApiUrl);
    registerFnMock.mockResolvedValue({ id: 1 });
    encodeFnMock.mockRejectedValue(new Error('invalid "int": "not a number"'));

    // act
    const act = schemaManager.serialize({ field: 'not a number' }, schemaName, testSchema);

    // assert
    await expect(act).rejects.toThrow('invalid "int": "not a number"');
  });
});
