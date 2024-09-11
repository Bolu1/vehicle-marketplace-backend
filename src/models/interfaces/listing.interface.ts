export interface IListing {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  gearType: string;
  fuel: string;
  color: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export interface ICreateListingPayload {
  name: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  gearType: string;
  fuel: string;
  color: string;
}

export interface IReadListingFilters {
    name?: string;
    make?: string;
    model?: string;
    minYear?: number;
    maxYear?: number;
    minPrice?: number;
    maxPrice?: number;
    minMileage?: number;
    maxMileage?: number;
    gearType?: string;
    fuel?: string;
    color?: string;

  }

  export interface IListingFromDB {
    id: string;
    name: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    gearType: string;
    fuel: string;
    color: string;
    createdBy: string;
    createdAt: Date;
    updatedAt?: Date | null;
    isCurrentlyBooked?: boolean;
    bookings?: IBookingInListing[];
  }

interface IBookingInListing {
    startDate: Date;
    endDate: Date;
}