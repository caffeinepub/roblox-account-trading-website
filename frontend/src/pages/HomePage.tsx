import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useGetActiveListings, useGetAllListings } from '../hooks/useQueries';
import TradeListingCard from '../components/TradeListingCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PlusCircle, Zap, TrendingUp } from 'lucide-react';

function ListingsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-xl border-2 border-border p-4 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-4 w-8 mx-auto" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { data: activeListings, isLoading: activeLoading } = useGetActiveListings();
  const { data: allListings, isLoading: allLoading } = useGetAllListings();

  const closedListings = allListings?.filter(
    (l) => (l.status as unknown as { __kind__: string }).__kind__ === 'closed'
  ) ?? [];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="relative rounded-2xl overflow-hidden border-2 border-neon/30">
        <img
          src="/assets/generated/banner-logo.dim_1200x300.png"
          alt="Brainrot Trade Hub"
          className="w-full h-40 sm:h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center px-6 sm:px-10">
          <div>
            <h1 className="font-black text-3xl sm:text-5xl text-white leading-none">
              BRAINROT <span className="text-neon">TRADE HUB</span>
            </h1>
            <p className="text-white/80 text-sm sm:text-base mt-2 font-semibold">
              Trade Roblox accounts for the most sigma brainrot items 🧠
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border-2 border-neon/30 bg-neon/5 p-4 text-center">
          <p className="font-black text-3xl text-neon">{activeListings?.length ?? '—'}</p>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Active Trades</p>
        </div>
        <div className="rounded-xl border-2 border-orange/30 bg-orange/5 p-4 text-center">
          <p className="font-black text-3xl text-orange">{closedListings.length}</p>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Completed</p>
        </div>
        <div className="col-span-2 sm:col-span-1 rounded-xl border-2 border-border bg-card p-4 flex items-center justify-center">
          <Link to="/post-trade" className="w-full">
            <Button className="w-full font-black text-sm gap-2 bg-neon text-black hover:bg-neon/90 border-0">
              <PlusCircle size={16} />
              POST A TRADE
            </Button>
          </Link>
        </div>
      </div>

      {/* Listings Tabs */}
      <Tabs defaultValue="active">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-surface border border-border">
            <TabsTrigger value="active" className="font-bold data-[state=active]:bg-neon data-[state=active]:text-black">
              <Zap size={14} className="mr-1" /> Active
            </TabsTrigger>
            <TabsTrigger value="all" className="font-bold data-[state=active]:bg-orange data-[state=active]:text-black">
              <TrendingUp size={14} className="mr-1" /> All Trades
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active">
          {activeLoading ? (
            <ListingsSkeleton />
          ) : !activeListings || activeListings.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <p className="text-6xl">🧠</p>
              <p className="font-black text-xl text-muted-foreground">No active trades yet!</p>
              <p className="text-muted-foreground text-sm">Be the first to post a trade and get that sigma grindset going.</p>
              <Link to="/post-trade">
                <Button className="mt-2 font-black bg-neon text-black hover:bg-neon/90">
                  <PlusCircle size={16} className="mr-2" />
                  POST FIRST TRADE
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...activeListings].reverse().map((listing) => (
                <TradeListingCard key={listing.id.toString()} listing={listing} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all">
          {allLoading ? (
            <ListingsSkeleton />
          ) : !allListings || allListings.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <p className="text-6xl">🧠</p>
              <p className="font-black text-xl text-muted-foreground">No trades yet!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...allListings].reverse().map((listing) => (
                <TradeListingCard key={listing.id.toString()} listing={listing} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
