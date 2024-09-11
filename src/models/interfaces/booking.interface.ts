export interface IBooking {
  id: string;
  listingId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  status: "BOOKED" | "CANCELLED";
  createdAt: Date;
  updatedAt?: Date;
}

export interface ICreateBookingPayload {
  startDate: Date;
  endDate: Date;
}
