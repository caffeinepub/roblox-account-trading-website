import Time "mo:core/Time";
import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type ItemType = {
    #robloxAccount : {
      username : Text;
      level : Nat;
      inventoryHighlights : Text;
    };
    #brainrotItem : Text;
  };

  type ListingStatus = { #open; #closed };

  type TradeListing = {
    id : Nat;
    posterDisplayName : Text;
    offeredItem : ItemType;
    requestedItem : ItemType;
    status : ListingStatus;
    createdAt : Time.Time;
  };

  let listings = Map.empty<Nat, TradeListing>();
  var nextListingId = 0;

  module TradeListing {
    public func compareByCreationTime(listing1 : TradeListing, listing2 : TradeListing) : Order.Order {
      if (listing1.createdAt < listing2.createdAt) {
        #less;
      } else if (listing1.createdAt > listing2.createdAt) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  func getListing(id : Nat) : TradeListing {
    switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) { listing };
    };
  };

  public shared ({ caller }) func createListing(
    posterDisplayName : Text,
    offeredItem : ItemType,
    requestedItem : ItemType,
  ) : async Nat {
    let id = nextListingId;
    nextListingId += 1;

    let newListing : TradeListing = {
      id;
      posterDisplayName;
      offeredItem;
      requestedItem;
      status = #open;
      createdAt = Time.now();
    };

    listings.add(id, newListing);
    id;
  };

  public query ({ caller }) func getActiveListings() : async [TradeListing] {
    let activeListings = List.empty<TradeListing>();

    for (listing in listings.values()) {
      if (listing.status == #open) {
        activeListings.add(listing);
      };
    };

    activeListings.toArray().sort(TradeListing.compareByCreationTime);
  };

  public query ({ caller }) func getListingDetails(id : Nat) : async TradeListing {
    getListing(id);
  };

  public shared ({ caller }) func closeListing(id : Nat) : async () {
    let listing = getListing(id);

    if (listing.status == #closed) {
      Runtime.trap("Listing is already closed");
    };

    let updatedListing = {
      listing with
      status = #closed
    };

    listings.add(id, updatedListing);
  };

  public query ({ caller }) func getAllListings() : async [TradeListing] {
    listings.values().toArray();
  };
};
