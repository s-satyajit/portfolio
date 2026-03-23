export type MockupMobileSide = "left" | "right";

export interface DeviceMockupFields {
  laptopImage?: string;
  mobileImage?: string;
  mockupAlt?: string;
  mockupCaption?: string;
  mockupMobileSide?: MockupMobileSide;
}
