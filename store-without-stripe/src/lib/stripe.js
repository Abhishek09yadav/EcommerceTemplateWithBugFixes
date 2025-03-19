import { loadStripe } from "@stripe/stripe-js";
import { QueryClient } from "@tanstack/react-query";

//internal imports
import SettingServices from "@services/SettingServices";

let stripePromise;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
}); // Create a new QueryClient instance for cache access

const getStripe = async () => {
  // Fetch store settings from the cache or trigger a fetch if not already cached
  const storeSetting = await queryClient.fetchQuery({
    queryKey: ["storeSetting"],
    queryFn: async () => await SettingServices.getStoreSetting(),
    staleTime: 4 * 60 * 1000, // Api request after 4 minutes
  });

  // console.log("storeSetting", storeSetting);

  // Use the storeSetting to initialize Stripe
  if (!stripePromise) {
    stripePromise = loadStripe(storeSetting?.stripe_key || null);
  }

  return stripePromise;
};

export default getStripe;
