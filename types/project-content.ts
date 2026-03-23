import { DeviceMockupFields } from "@/types/device-mockup";

export interface ProjectContentFrontmatter extends DeviceMockupFields {
  slug: string;
  title?: string;
  mockupTitle?: string;
  draft?: boolean;
}

export interface ProjectContentEntry extends ProjectContentFrontmatter {
  content: string;
}
