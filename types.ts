export interface AdItemBase {
  id: string;
  provider: string;
}

export interface AdItem extends AdItemBase {
  title: string;
  url: string;
}

export interface Provider {
  download: () => Promise<string>;
  parse: (html: string) => Iterable<AdItem>;
}
