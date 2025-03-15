import { AvroSerializer } from './avro-serializer';
import { SchemaRegistryManager } from './schema-registry-manager';
import { anyString, anything, instance, mock, reset, verify, when } from 'ts-mockito';
import { RawAvroSchema } from './schemas';

describe('AvroSerializer', () => {
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

  const schemaName = 'article-value';

  const schemaManagerMock = mock<SchemaRegistryManager>();

  afterEach(() => reset<SchemaRegistryManager>(schemaManagerMock));

  it('should serialize using test schema', async () => {
    // arrange
    const serializer = new AvroSerializer(testSchema, instance(schemaManagerMock));
    const data = { field: 123 };
    const serializedData = Buffer.from('serialized-value');
    when(schemaManagerMock.serialize(data, schemaName, testSchema)).thenResolve(serializedData);
    // act
    const serialized = await serializer.serialize(data, schemaName);
    // assert
    expect(serialized).toEqual(serializedData);
    verify(schemaManagerMock.serialize(anything(), anyString(), anything())).once();
  });

  it("should fail if data doesn't match schema", async () => {
    // arrange
    const serializer = new AvroSerializer(testSchema, instance(schemaManagerMock));
    const data = { field: '123' };
    when(schemaManagerMock.serialize(data, schemaName, testSchema)).thenReject(
      new Error('invalid "int": "not a number"')
    );
    // act
    const act = serializer.serialize(data, schemaName);
    // assert
    await expect(act).rejects.toThrow('invalid "int": "not a number"');
  });
});
