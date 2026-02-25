import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetListingDetails, useCloseListing } from '../hooks/useQueries';
import { ItemType, ListingStatus } from '../backend';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowRightLeft, CheckCircle, Clock, Gamepad2, Brain, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';

function ItemDetailDisplay({ item, label }: { item: ItemType; label: string }) {
  const isRoblox = item.__kind__ === 'robloxAccount';

  return (
    <Card className={`border-2 ${isRoblox ? 'border-neon/40 bg-neon/5' : 'border-orange/40 bg-orange/5'}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {isRoblox ? (
            <Gamepad2 size={18} className="text-neon" />
          ) : (
            <Brain size={18} className="text-orange" />
          )}
          <CardTitle className={`text-sm font-black uppercase tracking-widest ${isRoblox ? 'text-neon' : 'text-orange'}`}>
            {label}
          </CardTitle>
          <Badge
            variant="outline"
            className={`ml-auto text-xs ${isRoblox ? 'border-neon/50 text-neon' : 'border-orange/50 text-orange'}`}
          >
            {isRoblox ? 'Roblox Account' : 'Brainrot Item'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isRoblox ? (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Username</p>
              <p className="font-black text-xl text-foreground">@{item.robloxAccount.username}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Level</p>
              <p className="font-black text-2xl text-neon">{item.robloxAccount.level.toString()}</p>
            </div>
            {item.robloxAccount.inventoryHighlights && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Inventory Highlights</p>
                <p className="text-foreground text-sm leading-relaxed">{item.robloxAccount.inventoryHighlights}</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Description</p>
            <p className="text-foreground text-base leading-relaxed">{item.brainrotItem}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatTime(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / BigInt(1_000_000));
  const date = new Date(ms);
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ListingDetailPage() {
  const { id } = useParams({ from: '/listing/$id' });
  const navigate = useNavigate();
  const closeListing = useCloseListing();

  const { data: listing, isLoading, error } = useGetListingDetails(BigInt(id));

  const isClosed =
    listing?.status === ListingStatus.closed ||
    (listing?.status as unknown as { __kind__: string })?.__kind__ === 'closed';

  const handleClose = async () => {
    if (!listing) return;
    try {
      await closeListing.mutateAsync(listing.id);
      toast.success('Trade marked as completed! GG! 🎉');
    } catch (err) {
      toast.error('Failed to close listing. Try again!');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
        <p className="text-6xl">💀</p>
        <p className="font-black text-2xl text-destructive">Listing Not Found</p>
        <p className="text-muted-foreground">This trade listing doesn't exist or was removed.</p>
        <Button onClick={() => navigate({ to: '/' })} variant="outline" className="font-bold">
          <ArrowLeft size={16} className="mr-2" />
          Back to Listings
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/' })}
        className="font-bold text-muted-foreground hover:text-foreground -ml-2"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Listings
      </Button>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-black text-3xl sm:text-4xl leading-tight">
              TRADE <span className="text-neon">#{listing.id.toString()}</span>
            </h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
              <User size={14} />
              <span className="font-bold">{listing.posterDisplayName}</span>
              <span>·</span>
              <Clock size={14} />
              <span>{formatTime(listing.createdAt)}</span>
            </div>
          </div>
          {isClosed ? (
            <Badge className="bg-muted text-muted-foreground font-black text-sm uppercase tracking-wider px-3 py-1 shrink-0">
              CLOSED
            </Badge>
          ) : (
            <Badge className="bg-neon text-black font-black text-sm uppercase tracking-wider px-3 py-1 shrink-0">
              OPEN
            </Badge>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        <ItemDetailDisplay item={listing.offeredItem} label="Offering" />

        <div className="flex items-center justify-center gap-3 text-orange font-black text-sm uppercase tracking-widest">
          <div className="h-px flex-1 bg-orange/30" />
          <ArrowRightLeft size={20} />
          <span>FOR</span>
          <ArrowRightLeft size={20} />
          <div className="h-px flex-1 bg-orange/30" />
        </div>

        <ItemDetailDisplay item={listing.requestedItem} label="Wants" />
      </div>

      {/* Action */}
      {!isClosed ? (
        <Card className="border-2 border-border bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-4 font-semibold">
              Did this trade go through? Mark it as completed to let others know it's done! ✅
            </p>
            <Button
              onClick={handleClose}
              disabled={closeListing.isPending}
              className="w-full font-black text-base py-5 bg-orange text-black hover:bg-orange/90 border-0 rounded-xl"
            >
              {closeListing.isPending ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  CLOSING...
                </>
              ) : (
                <>
                  <CheckCircle size={18} className="mr-2" />
                  MARK AS COMPLETED 🎉
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-border bg-muted/30">
          <CardContent className="pt-6 text-center">
            <CheckCircle size={32} className="text-neon mx-auto mb-2" />
            <p className="font-black text-lg text-foreground">Trade Completed!</p>
            <p className="text-sm text-muted-foreground mt-1">This trade has been marked as done. GG! 🎉</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
