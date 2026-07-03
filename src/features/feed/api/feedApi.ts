import { mockServer } from '../../../shared/mock/mockServer';

export type FeedItem = { id: string; title: string };
export type FeedPage = {
  items: FeedItem[];
  page: number;
  hasMore: boolean;
  total: number;
};

export const feedApi = {
  getFeed: (page: number, search: string): Promise<FeedPage> =>
    mockServer.getFeed({ page, search }),
};
