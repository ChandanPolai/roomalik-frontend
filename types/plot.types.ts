// types/plot.types.ts

export interface PlotAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface PlotImage {
  url: string;
  caption?: string;
  uploadedAt: string;
}

export interface PlotLocation {
  lat?: number;
  lng?: number;
}

export interface Plot {
  _id: string;
  name: string;
  address: PlotAddress;
  totalArea: number;
  constructionYear?: number;
  images: PlotImage[];
  facilities: string[];
  location?: PlotLocation;
  ownerId: string;
  createdAt: string;
}

export interface CreatePlotData {
  name: string;
  address: PlotAddress;
  totalArea: number;
  constructionYear?: number;
  facilities?: string[];
  location?: PlotLocation;
}

export interface UpdatePlotData {
  name?: string;
  address?: Partial<PlotAddress>;
  totalArea?: number;
  constructionYear?: number;
  facilities?: string[];
  location?: PlotLocation;
}

export interface PlotFormData {
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  totalArea: string;
  constructionYear: string;
  facilities: string[];
  location?: PlotLocation;
  purchaseDate?: string;
  registrationDate?: string;
}
