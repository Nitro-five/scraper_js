import digitalWires from './digitalwires.avsc.json';
import { RawAvroSchema } from './types';

export * from './types';

export const articleSchema = digitalWires as RawAvroSchema;
