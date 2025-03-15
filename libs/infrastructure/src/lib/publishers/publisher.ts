export interface Publisher {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  publish(messages: Record<string, any>[], topic: string): Promise<void>;
}
