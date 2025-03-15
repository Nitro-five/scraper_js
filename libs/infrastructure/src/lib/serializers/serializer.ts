export interface ISerializer<Original, Serialized> {
  serialize(data: Original, topic: string): Promise<Serialized>;
}
