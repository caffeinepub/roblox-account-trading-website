import { Link } from '@tanstack/react-router';
import { TradeListing, ListingStatus, ItemType } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRightLeft, Clock, User, Gamepad2, Brain } from 'lucide-react';

interface TradeListingCardProps {
  listing: TradeListing;
}

function ItemDisplay({ item, label }: { item: ItemType; label: string }) {
  const isRoblox = item.__kind__ === 'robloxAccount';

  return (
    <div className={`rounded-lg p-3 border ${isRoblox ? 'border-neon/30 bg-neon/5' : 'border-orange/30 bg-orange/5'}`}>
      <div className="flex items-center gap-2 mb-2">
        {isRoblox ? (
          <Gamepad2 size={14} className="text-neon" />
        ) : (
          <Brain size={14} className="text-orange" />
        )}
        <span className={`text-xs font-black uppercase tracking-widest ${isRoblox ? 'text-neon' : 'text-orange'}`}>
          {label}
        </span>
        <Badge
          variant="outline"
          className={`text-xs ml-auto ${isRoblox ? 'border-neon/50 text-neon' : 'border-orange/50 text-orange'}`}
        >
          {isRoblox ? 'Roblox Account' : 'Brainrot Item'}
        </Badge>
      </div>
      {isRoblox ? (
        <div className="space-y-1">
          <p className="font-bold text-foreground text-sm">@{item.robloxAccount.username}</p>
          <p className="text-xs text-muted-foreground">
            Level <span className="text-neon font-bold">{item.robloxAccount.level.toString()}</span>
          </p>
          {item.robloxAccount.inventoryHighlights && (
            <p className="text-xs text-muted-foreground line-clamp-2">{item.robloxAccount.inventoryHighlights}</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-foreground line-clamp-2">{item.brainrotItem}</p>
      )}
    </div>
  );
}

function formatTime(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / BigInt(1_000_000));
  const date = new Date(ms);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TradeListingCard({ listing }: TradeListingCardProps) {
  const isClosed = listing.status === ListingStatus.closed || (listing.status as unknown as { __kind__: string }).__kind__ === 'closed';

  return (
    <Link to="/listing/$id" params={{ id: listing.id.toString() }}>
      <Card
        className={`group cursor-pointer transition-all duration-200 border-2 hover:shadow-neon ${
          isClosed
            ? 'border-border opacity-60 hover:shadow-none'
            : 'border-border hover:border-neon/50'
        } bg-card`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User size={14} className="text-muted-foreground" />
              <span className="font-bold text-sm text-foreground">{listing.posterDisplayName}</span>
            </div>
            <div className="flex items-center gap-2">
              {isClosed ? (
                <Badge className="bg-muted text-muted-foreground font-black text-xs uppercase tracking-wider">
                  CLOSED
                </Badge>
              ) : (
                <Badge className="bg-neon text-black font-black text-xs uppercase tracking-wider">
                  OPEN
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Clock size={11} />
            <span>{formatTime(listing.createdAt)}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <ItemDisplay item={listing.offeredItem} label="Offering" />
          <div className="flex items-center justify-center">
            <ArrowRightLeft size={16} className="text-orange" />
          </div>
          <ItemDisplay item={listing.requestedItem} label="Wants" />
        </CardContent>
      </Card>
    </Link>
  );
}
