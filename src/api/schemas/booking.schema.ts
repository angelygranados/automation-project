import { z } from 'zod';

/** Contract for Restful-Booker resources. Responses are validated against these at runtime. */
export const BookingSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number().int(),
  depositpaid: z.boolean(),
  bookingdates: z.object({
    checkin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    checkout: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
  additionalneeds: z.string().optional(),
});

export const CreatedBookingSchema = z.object({
  bookingid: z.number().int().positive(),
  booking: BookingSchema,
});

export const BookingIdListSchema = z.array(z.object({ bookingid: z.number().int() }));

export const AuthResponseSchema = z.union([
  z.object({ token: z.string().min(1) }),
  z.object({ reason: z.string() }),
]);

export type Booking = z.infer<typeof BookingSchema>;
export type CreatedBooking = z.infer<typeof CreatedBookingSchema>;
