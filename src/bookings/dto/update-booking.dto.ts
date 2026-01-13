import { BookingStatus } from '../entities/booking.entity';

export class UpdateBookingDto {
  bookingDate?: Date;
  numberOfSeats?: number;
  totalPrice?: number;
  status?: BookingStatus;
}
