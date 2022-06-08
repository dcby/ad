export interface AdItemBase {
    id: string;
    provider: string;
}

export interface AdItem extends AdItemBase {
    title: string;
    url: string;
}
