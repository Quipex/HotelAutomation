import { AxiosResponse } from 'axios';
import { Context, Telegraf } from 'telegraf';
import { api } from '../../api';
import { registerBookingHandlers } from '../bookingHandlers';

// Mock the API
jest.mock('../../api');
const mockApi = api as jest.Mocked<typeof api>;

describe('Booking Handlers', () => {
  let bot: Telegraf<Context>;

  beforeEach(() => {
    bot = new Telegraf('TEST_TOKEN');
    jest.clearAllMocks();
  });

  test('booking handler should get and format booking info', async () => {
    registerBookingHandlers(bot);

    // Mock the API response
    const mockBookingData = {
      id: '123',
      client: {
        first_name: 'John',
        last_name: 'Doe',
        phone: '+79001234567'
      },
      checkin_date: '2023-12-01',
      checkout_date: '2023-12-05',
      room: { number: '101' },
      status: 'CONFIRMED',
      cost: 15000,
      notes: 'VIP guest'
    };

    const mockResponse: AxiosResponse = {
      data: mockBookingData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };

    mockApi.getBooking.mockResolvedValue(mockResponse);

    // Mock Telegraf Context
    const mockCtx = {
      message: { text: '/booking 123' },
      reply: jest.fn(),
      replyWithMarkdown: jest.fn()
    };

    // Find and execute the booking command handler
    const bookingHandler = (bot as any).handlers.command.find(
      (h: any) => h.triggers.includes('booking')
    )?.middleware;

    await bookingHandler(mockCtx as any);

    // Verify that API was called correctly
    expect(mockApi.getBooking).toHaveBeenCalledWith('123');

    // Verify that the reply was called with formatted data
    expect(mockCtx.replyWithMarkdown).toHaveBeenCalled();

    // Get the reply text and verify it contains expected elements
    const replyText = mockCtx.replyWithMarkdown.mock.calls[0][0];
    expect(replyText).toContain('Бронирование №123');
    expect(replyText).toContain('Клиент: John Doe');
    expect(replyText).toContain('Номер: 101');
    expect(replyText).toContain('Заметки: VIP guest');
  });

  test('booking handler should handle missing ID', async () => {
    registerBookingHandlers(bot);

    // Mock Telegraf Context with missing ID
    const mockCtx = {
      message: { text: '/booking' },
      reply: jest.fn(),
      replyWithMarkdown: jest.fn()
    };

    // Find and execute the booking command handler
    const bookingHandler = (bot as any).handlers.command.find(
      (h: any) => h.triggers.includes('booking')
    )?.middleware;

    await bookingHandler(mockCtx as any);

    // Verify that the appropriate error message was sent
    expect(mockCtx.reply).toHaveBeenCalledWith(
      expect.stringContaining('Пожалуйста, укажите ID бронирования')
    );
    expect(mockApi.getBooking).not.toHaveBeenCalled();
  });

  test('booking handler should handle API errors', async () => {
    registerBookingHandlers(bot);

    // Mock API error
    mockApi.getBooking.mockRejectedValue(new Error('API error'));

    // Mock Telegraf Context
    const mockCtx = {
      message: { text: '/booking 123' },
      reply: jest.fn(),
      replyWithMarkdown: jest.fn()
    };

    // Find and execute the booking command handler
    const bookingHandler = (bot as any).handlers.command.find(
      (h: any) => h.triggers.includes('booking')
    )?.middleware;

    await bookingHandler(mockCtx as any);

    // Verify that the appropriate error message was sent
    expect(mockCtx.reply).toHaveBeenCalledWith(
      expect.stringContaining('Произошла ошибка при получении данных бронирования')
    );
  });

  test('booking handler should handle 404 not found', async () => {
    registerBookingHandlers(bot);

    // Mock 404 error response
    const error = new Error('Not found');
    (error as any).response = { status: 404 };
    mockApi.getBooking.mockRejectedValue(error);

    // Mock Telegraf Context
    const mockCtx = {
      message: { text: '/booking 999' },
      reply: jest.fn(),
      replyWithMarkdown: jest.fn()
    };

    // Find and execute the booking command handler
    const bookingHandler = (bot as any).handlers.command.find(
      (h: any) => h.triggers.includes('booking')
    )?.middleware;

    await bookingHandler(mockCtx as any);

    // Verify that the appropriate not found message was sent
    expect(mockCtx.reply).toHaveBeenCalledWith(
      expect.stringContaining('Бронирование с ID 999 не найдено')
    );
  });
});
