export type ApiLeadType =
  | "phone"
  | "whatsapp"
  | "quote_request"
  | "consultation_request"
  | "website_click";

export type ApiSourceSurface =
  | "business_profile"
  | "product_detail"
  | "video"
  | "search_result"
  | "category_listing"
  | "map";

export interface TrackLeadParams {
  businessId:       number;
  leadType:         ApiLeadType;
  sourceSurface:    ApiSourceSurface;
  sourceEntityType?: string;
  sourceEntityId?:  number;
  name?:            string;
  phone?:           string;
  message?:         string;
  preferredTime?:   string;
}

export interface TrackEventParams {
  businessId?:  number;
  eventType:    string;
  entityType?:  string;
  entityId?:    number;
  metadata?:    Record<string, unknown>;
}

export async function trackLead(params: TrackLeadParams): Promise<void> {
  try {
    await fetch("/api/leads", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(params),
    });
  } catch {
    /* fire-and-forget — ignore network errors */
  }
}

export async function trackEvent(params: TrackEventParams): Promise<void> {
  try {
    await fetch("/api/analytics/events", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(params),
    });
  } catch {
    /* fire-and-forget — ignore network errors */
  }
}
