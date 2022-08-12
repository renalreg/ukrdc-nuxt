export interface ChannelStatistics {
  name: string;
  updated: string;
  serverId: string;
  channelId: string;
  received: number;
  sent: number;
  error: number;
  filtered: number;
  queued: number;
}
