export type Config = {
  port: number;
  listenhost: string;
  hostname: string;
  sqliteLocation: string;
  subscriptionEndpoint: string;
  serviceDid: string;
  publisherDid: string;
  subscriptionReconnectDelay: number;
};
