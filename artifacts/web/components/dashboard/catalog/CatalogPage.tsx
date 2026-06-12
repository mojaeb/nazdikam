import { useActiveBusiness } from "@/src/contexts/ActiveBusinessContext";
import { ListingList } from "@/components/dashboard/listings/ListingList";

export function CatalogPage() {
  const { business } = useActiveBusiness();
  const businessId = business ? String(business.id) : undefined;
  return <ListingList businessId={businessId} />;
}
