import appDataSource from '~/config/dataSource';
import { BookingModel } from '~/domain/bookings/BookingModel';

describe('InitialTests', () => {
  test('Tests are running', () => {
    expect(true).toBe(true);
  });
  test('Get all Bookings', async () => {
    const bookings = await appDataSource.getRepository(BookingModel).find();
    expect(bookings).toHaveLength(0);
  });
});
