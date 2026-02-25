import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TradeListing {
    id: bigint;
    status: ListingStatus;
    createdAt: Time;
    posterDisplayName: string;
    requestedItem: ItemType;
    offeredItem: ItemType;
}
export type Time = bigint;
export type ItemType = {
    __kind__: "brainrotItem";
    brainrotItem: string;
} | {
    __kind__: "robloxAccount";
    robloxAccount: {
        username: string;
        level: bigint;
        inventoryHighlights: string;
    };
};
export enum ListingStatus {
    closed = "closed",
    open = "open"
}
export interface backendInterface {
    closeListing(id: bigint): Promise<void>;
    createListing(posterDisplayName: string, offeredItem: ItemType, requestedItem: ItemType): Promise<bigint>;
    getActiveListings(): Promise<Array<TradeListing>>;
    getAllListings(): Promise<Array<TradeListing>>;
    getListingDetails(id: bigint): Promise<TradeListing>;
}
