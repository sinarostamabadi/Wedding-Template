import type { ComponentType } from "react";

export type InvitationRenderData = {
  partnerOneName: string;
  partnerTwoName: string;
  title?: string;
  invitationText?: string | null;
  eventStartAt?: string | null;
  eventEndAt?: string | null;
  timezone?: string;
  venueName?: string | null;
  venueAddress?: string | null;
  mapUrl?: string | null;
  coverImageUrl?: string | null;
  gallery?: string[];
  familyNames?: {
    partnerOneFamily?: string;
    partnerTwoFamily?: string;
  };
};

export type TemplateScheduleItem = {
  time: string;
  title: string;
  description: string;
  icon?: "cafe" | "heart" | "dining" | "music";
};

export type TemplateCustomization = {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  showCountdown?: boolean;
  showGallery?: boolean;
  showMap?: boolean;
  showRsvp?: boolean;
  showGuestMessage?: boolean;
  poeticLine?: string;
  dressCode?: string;
  blessingLine?: string;
  musicTitle?: string;
  schedule?: TemplateScheduleItem[];
};

export type TemplateFeatureSettings = {
  countdown?: boolean;
  gallery?: boolean;
  map?: boolean;
  rsvp?: boolean;
  guestMessage?: boolean;
  music?: boolean;
  entranceAnimation?: boolean;
};

export type TemplateRendererProps = {
  data: InvitationRenderData;
  customization?: TemplateCustomization;
  features?: TemplateFeatureSettings;
  preview?: boolean;
};

export type TemplateDefinition = {
  key: string;
  name: string;
  version: string;
  description: string;
  categorySlugs: string[];
  isFree: boolean;
  price: number;
  thumbnailGradient: string;
  defaultCustomization: TemplateCustomization;
  Renderer: ComponentType<TemplateRendererProps>;
};
