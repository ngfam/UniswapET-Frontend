
export interface Token {
    id: string;
    name: string;
    totalSupply: number;
    iconURL: string;
    price: number;
}

export interface Pair {
    id: number;
    token0: string;
    token1: string;
    icon0: string;
    icon1: string;
    totalVolumeRecorded: number;
    marketCap: number;
}