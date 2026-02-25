import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ItemType, TradeListing } from '../backend';

export function useGetActiveListings() {
  const { actor, isFetching } = useActor();

  return useQuery<TradeListing[]>({
    queryKey: ['activeListings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllListings() {
  const { actor, isFetching } = useActor();

  return useQuery<TradeListing[]>({
    queryKey: ['allListings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetListingDetails(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<TradeListing>({
    queryKey: ['listing', id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      return actor.getListingDetails(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      posterDisplayName,
      offeredItem,
      requestedItem,
    }: {
      posterDisplayName: string;
      offeredItem: ItemType;
      requestedItem: ItemType;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.createListing(posterDisplayName, offeredItem, requestedItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeListings'] });
      queryClient.invalidateQueries({ queryKey: ['allListings'] });
    },
  });
}

export function useCloseListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.closeListing(id);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['activeListings'] });
      queryClient.invalidateQueries({ queryKey: ['allListings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', id.toString()] });
    },
  });
}
