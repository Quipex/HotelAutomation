import { AxiosResponse } from 'axios';
import { Context } from 'telegraf';
import { api } from '../../api';
import { registerBookingHandlers } from '../bookingHandlers';

// Mock the API
jest.mock('../../api');
const mockApi = jest.mocked(api);

describe('Booking Handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('booking handler should get and format booking info', async () => {
    // Mock booking data
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

    // Create a mock bot with spies
    const mockBot = {
      command: jest.fn()
    };

    // Register handlers
    registerBookingHandlers(mockBot as any);

    // Extract the booking command handler
    expect(mockBot.command).toHaveBeenCalled();
    const [commandName, handler] = mockBot.command.mock.calls.find(
      (call) => call[0] === 'booking'
    );

    // Verify command name
    expect(commandName).toBe('booking');

    // Mock context with booking ID
    const mockCtx = {
      message: { text: '/booking 123' },
      reply: jest.fn(),
      replyWithMarkdown: jest.fn()
    };

    // Call the handler
    await handler(mockCtx as any);

    // Verify API call
    expect(mockApi.getBooking).toHaveBeenCalledWith('123');

    // Verify reply with formatted data
    expect(mockCtx.replyWithMarkdown).toHaveBeenCalled();

    // Verify reply content
    const replyText = mockCtx.replyWithMarkdown.mock.calls[0][0];
    expect(replyText).toContain('Бронирование №123');
    expect(replyText).toContain('*Клиент:* John Doe');
    expect(replyText).toContain('*Номер:* 101');
    expect(replyText).toContain('*Заметки:* VIP guest');
  });

  test('booking handler should handle missing ID', async () => {
    // Create a mock bot with spies
    const mockBot = {
      command: jest.fn()
    };

    // Register handlers
    registerBookingHandlers(mockBot as any);

    // Extract the booking command handler
    const [commandName, handler] = mockBot.command.mock.calls.find(
      (call) => call[0] === 'booking'
    );

    // Verify command name
    expect(commandName).toBe('booking');

    // Mock context without booking ID
    const mockCtx = {
      message: { text: '/booking' },
      reply: jest.fn()
    };

    // Call the handler
    await handler(mockCtx as any);

    // Verify error message
    expect(mockCtx.reply).toHaveBeenCalledWith(
      expect.stringContaining('Пожалуйста, укажите ID бронирования')
    );

    // Verify API was not called
    expect(mockApi.getBooking).not.toHaveBeenCalled();
  });

  test('booking handler should handle API errors', async () => {
    // Mock API error
    mockApi.getBooking.mockRejectedValue(new Error('API error'));

    // Create a mock bot with spies
    const mockBot = {
      command: jest.fn()
    };

    // Register handlers
    registerBookingHandlers(mockBot as any);

    // Extract the booking command handler
    const [commandName, handler] = mockBot.command.mock.calls.find(
      (call) => call[0] === 'booking'
    );

    // Verify command name
    expect(commandName).toBe('booking');

    // Mock context with booking ID
    const mockCtx = {
      message: { text: '/booking 123' },
      reply: jest.fn()
    };

    // Call the handler
    await handler(mockCtx as any);

    // Verify error message
    expect(mockCtx.reply).toHaveBeenCalledWith(
      expect.stringContaining('Произошла ошибка при получении данных бронирования')
    );
  });

  test('booking handler should handle 404 not found', async () => {
    // Mock API 404 error
    const error = new Error('Not found');
    (error as any).response = { status: 404 };
    mockApi.getBooking.mockRejectedValue(error);

    // Create a mock bot with spies
    const mockBot = {
      command: jest.fn()
    };

    // Register handlers
    registerBookingHandlers(mockBot as any);

    // Extract the booking command handler
    const [commandName, handler] = mockBot.command.mock.calls.find(
      (call) => call[0] === 'booking'
    );

    // Verify command name
    expect(commandName).toBe('booking');

    // Mock context with non-existent booking ID
    const mockCtx = {
      message: { text: '/booking 999' },
      reply: jest.fn()
    };

    // Call the handler
    await handler(mockCtx as any);

    // Verify not found message
    expect(mockCtx.reply).toHaveBeenCalledWith(
      expect.stringContaining('Бронирование с ID 999 не найдено')
    );
  });
});
