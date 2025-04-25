import { AxiosResponse } from 'axios';
import { Context, Telegraf } from 'telegraf';
import { api } from '../../api';
import { registerAvailabilityHandlers } from '../availabilityHandlers';

// Mock the API
jest.mock('../../api');
const mockApi = api as jest.Mocked<typeof api>;

describe('Availability Handlers', () => {
  let bot: Telegraf<Context>;

  beforeEach(() => {
    bot = new Telegraf('TEST_TOKEN');
    jest.clearAllMocks();
  });

  test('available handler should fetch and format available rooms', async () => {
    registerAvailabilityHandlers(bot);

    // Mock available rooms response
    const mockRoomsData = [
      {
        id: 1,
        number: '101',
        floor: 1,
        capacity: 2,
        features: {
          sea_view: true,
          balcony_side: 'South'
        },
        type: 'Standard'
      },
      {
        id: 2,
        number: '205',
        floor: 2,
        capacity: 3,
        features: {
          sea_view: false,
          balcony_side: 'North'
        },
        type: 'Deluxe'
      }
    ];

    const mockResponse: AxiosResponse = {
      data: mockRoomsData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };

    mockApi.getAvailableRooms.mockResolvedValue(mockResponse);

    // Mock Telegraf Context
    const mockCtx = {
      message: { text: '/available 2023-12-25 3 2' },
      reply: jest.fn(),
      replyWithMarkdown: jest.fn()
    };

    // Find and execute the available command handler
    const availableHandler = (bot as any).handlers.command.find(
      (h: any) => h.triggers.includes('available')
    )?.middleware;

    await availableHandler(mockCtx as any);

    // Verify that API was called with correct parameters
    expect(mockApi.getAvailableRooms).toHaveBeenCalledWith('2023-12-25', 3, 2);

    // Verify that the reply was called with formatted data
    expect(mockCtx.replyWithMarkdown).toHaveBeenCalled();

    // Get the reply text and verify it contains expected elements
    const replyText = mockCtx.replyWithMarkdown.mock.calls[0][0];
    expect(replyText).toContain('Свободные номера на 2023-12-25, 3 дней, 2 гостей');
    expect(replyText).toContain('Номер 101');
    expect(replyText).toContain('Вид на море');
    expect(replyText).toContain('Номер 205');
    expect(replyText).toContain('Deluxe');
  });

  test('available handler should validate date format', async () => {
    registerAvailabilityHandlers(bot);

    // Mock Telegraf Context with invalid date format
    const mockCtx = {
      message: { text: '/available 25-12-2023 3 2' },
      reply: jest.fn(),
      replyWithMarkdown: jest.fn()
    };

    // Find and execute the available command handler
    const availableHandler = (bot as any).handlers.command.find(
      (h: any) => h.triggers.includes('available')
    )?.middleware;

    await availableHandler(mockCtx as any);

    // Verify that error message was sent
    expect(mockCtx.reply).toHaveBeenCalledWith(
      expect.stringContaining('Дата должна быть в формате YYYY-MM-DD')
    );

    // Verify that API was not called
    expect(mockApi.getAvailableRooms).not.toHaveBeenCalled();
  });

  test('available handler should validate days parameter', async () => {
    registerAvailabilityHandlers(bot);

    // Mock Telegraf Context with invalid days
    const mockCtx = {
      message: { text: '/available 2023-12-25 -1 2' },
      reply: jest.fn(),
      replyWithMarkdown: jest.fn()
    };

    // Find and execute the available command handler
    const availableHandler = (bot as any).handlers.command.find(
      (h: any) => h.triggers.includes('available')
    )?.middleware;

    await availableHandler(mockCtx as any);

    // Verify that error message was sent
    expect(mockCtx.reply).toHaveBeenCalledWith(
      expect.stringContaining('Количество дней должно быть положительным числом')
    );

    // Verify that API was not called
    expect(mockApi.getAvailableRooms).not.toHaveBeenCalled();
  });

  test('available handler should validate guests parameter', async () => {
    registerAvailabilityHandlers(bot);

    // Mock Telegraf Context with invalid guests
    const mockCtx = {
      message: { text: '/available 2023-12-25 3 0' },
      reply: jest.fn(),
      replyWithMarkdown: jest.fn()
    };

    // Find and execute the available command handler
    const availableHandler = (bot as any).handlers.command.find(
      (h: any) => h.triggers.includes('available')
    )?.middleware;

    await availableHandler(mockCtx as any);

    // Verify that error message was sent
    expect(mockCtx.reply).toHaveBeenCalledWith(
      expect.stringContaining('Количество гостей должно быть положительным числом')
    );

    // Verify that API was not called
    expect(mockApi.getAvailableRooms).not.toHaveBeenCalled();
  });

  test('available handler should validate parameter count', async () => {
    registerAvailabilityHandlers(bot);

    // Mock Telegraf Context with missing parameters
    const mockCtx = {
      message: { text: '/available 2023-12-25' },
      reply: jest.fn(),
      replyWithMarkdown: jest.fn()
    };

    // Find and execute the available command handler
    const availableHandler = (bot as any).handlers.command.find(
      (h: any) => h.triggers.includes('available')
    )?.middleware;

    await availableHandler(mockCtx as any);

    // Verify that error message was sent
    expect(mockCtx.reply).toHaveBeenCalledWith(
      expect.stringContaining('Пожалуйста, укажите дату, количество дней и количество гостей')
    );

    // Verify that API was not called
    expect(mockApi.getAvailableRooms).not.toHaveBeenCalled();
  });

  test('available handler should handle API errors', async () => {
    registerAvailabilityHandlers(bot);

    // Mock API error
    mockApi.getAvailableRooms.mockRejectedValue(new Error('Network error'));

    // Mock Telegraf Context
    const mockCtx = {
      message: { text: '/available 2023-12-25 3 2' },
      reply: jest.fn(),
      replyWithMarkdown: jest.fn()
    };

    // Find and execute the available command handler
    const availableHandler = (bot as any).handlers.command.find(
      (h: any) => h.triggers.includes('available')
    )?.middleware;

    await availableHandler(mockCtx as any);

    // Verify that error message was sent
    expect(mockCtx.reply).toHaveBeenCalledWith(
      expect.stringContaining('Произошла ошибка при получении свободных номеров')
    );
  });
});
