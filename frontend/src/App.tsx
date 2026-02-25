import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PostTradePage from './pages/PostTradePage';
import ListingDetailPage from './pages/ListingDetailPage';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const postTradeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/post-trade',
  component: PostTradePage,
});

const listingDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/listing/$id',
  component: ListingDetailPage,
});

const routeTree = rootRoute.addChildren([indexRoute, postTradeRoute, listingDetailRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}
