import { AxiosResponse } from 'axios';
import { Context } from 'telegraf';
import { api } from '../../api';
import { registerAvailabilityHandlers } from '../availabilityHandlers';

// Mock the API
jest.mock('../../api');
const mockApi = jest.mocked(api);

describe('Availability Handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('available handler should fetch and format available rooms', async () => {
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

    // Create a mock bot with spies
    const mockBot = {
      command: jest.fn()
    };

    // Register handlers
    registerAvailabilityHandlers(mockBot as any);

    // Extract the available command handler
    expect(mockBot.command).toHaveBeenCalled();
    const [commandName, handler] = mockBot.command.mock.calls.find(
      (call) => call[0] === 'available'
    );

    // Verify command name
    expect(commandName).toBe('available');

    // Mock context with valid parameters
    const mockCtx = {
      message: { text: '/available 2023-12-25 3 2' },
      reply: jest.fn(),
      replyWithMarkdown: jest.fn()
    };

    // Call the handler
    await handler(mockCtx as any);

    // Verify API call with correct parameters
    expect(mockApi.getAvailableRooms).toHaveBeenCalledWith('2023-12-25', 3, 2);

    // Verify reply with formatted data
    expect(mockCtx.replyWithMarkdown).toHaveBeenCalled();

    // Verify reply content
    const replyText = mockCtx.replyWithMarkdown.mock.calls[0][0];
    expect(replyText).toContain('Свободные номера на 2023-12-25, 3 дней, 2 гостей');
    expect(replyText).toContain('Номер 101');
    expect(replyText).toContain('Вид на море');
    expect(replyText).toContain('Номер 205');
    expect(replyText).toContain('Deluxe');
  });

  test('available handler should validate date format', async () => {
    // Create a mock bot with spies
    const mockBot = {
      command: jest.fn()
    };

    // Register handlers
    registerAvailabilityHandlers(mockBot as any);

    // Extract the available command handler
    const [commandName, handler] = mockBot.command.mock.calls.find(
      (call) => call[0] === 'available'
    );

    // Verify command name
    expect(commandName).toBe('available');

    // Mock context with invalid date format
    const mockCtx = {
      message: { text: '/available 25-12-2023 3 2' },
      reply: jest.fn(),
      replyWithMarkdown: jest.fn()
    };

    // Call the handler
    await handler(mockCtx as any);

    // Verify error message
    expect(mockCtx.reply).toHaveBeenCalledWith(
      expect.stringContaining('Дата должна быть в формате YYYY-MM-DD')
    );

    // Verify API was not called
    expect(mockApi.getAvailableRooms).not.toHaveBeenCalled();
  });

  test('available handler should validate days parameter', async () => {
    // Create a mock bot with spies
    const mockBot = {
      command: jest.fn()
    };

    // Register handlers
    registerAvailabilityHandlers(mockBot as any);

    // Extract the available command handler
    const [commandName, handler] = mockBot.command.mock.calls.find(
      (call) => call[0] === 'available'
    );

    // Verify command name
    expect(commandName).toBe('available');

    // Mock context with invalid days
    const mockCtx = {
      message: { text: '/available 2023-12-25 -1 2' },
      reply: jest.fn(),
      replyWithMarkdown: jest.fn()
    };

    // Call the handler
    await handler(mockCtx as any);

    // Verify error message
    expect(mockCtx.reply).toHaveBeenCalledWith(
      expect.stringContaining('Количество дней должно быть положительным числом')
    );

    // Verify API was not called
    expect(mockApi.getAvailableRooms).not.toHaveBeenCalled();
  });

  test('available handler should validate guests parameter', async () => {
    // Create a mock bot with spies
    const mockBot = {
      command: jest.fn()
    };

    // Register handlers
    registerAvailabilityHandlers(mockBot as any);

    // Extract the available command handler
    const [commandName, handler] = mockBot.command.mock.calls.find(
      (call) => call[0] === 'available'
    );

    // Verify command name
    expect(commandName).toBe('available');

    // Mock context with invalid guests
    const mockCtx = {
      message: { text: '/available 2023-12-25 3 0' },
      reply: jest.fn(),
      replyWithMarkdown: jest.fn()
    };

    // Call the handler
    await handler(mockCtx as any);

    // Verify error message
    expect(mockCtx.reply).toHaveBeenCalledWith(
      expect.stringContaining('Количество гостей должно быть положительным числом')
    );

    // Verify API was not called
    expect(mockApi.getAvailableRooms).not.toHaveBeenCalled();
  });

  test('available handler should validate parameter count', async () => {
    // Create a mock bot with spies
    const mockBot = {
      command: jest.fn()
    };

    // Register handlers
    registerAvailabilityHandlers(mockBot as any);

    // Extract the available command handler
    const [commandName, handler] = mockBot.command.mock.calls.find(
      (call) => call[0] === 'available'
    );

    // Verify command name
    expect(commandName).toBe('available');

    // Mock context with missing parameters
    const mockCtx = {
      message: { text: '/available 2023-12-25' },
      reply: jest.fn(),
      replyWithMarkdown: jest.fn()
    };

    // Call the handler
    await handler(mockCtx as any);

    // Verify error message
    expect(mockCtx.reply).toHaveBeenCalledWith(
      expect.stringContaining('Пожалуйста, укажите дату, количество дней и количество гостей')
    );

    // Verify API was not called
    expect(mockApi.getAvailableRooms).not.toHaveBeenCalled();
  });

  test('available handler should handle API errors', async () => {
    // Mock API error
    mockApi.getAvailableRooms.mockRejectedValue(new Error('Network error'));

    // Create a mock bot with spies
    const mockBot = {
      command: jest.fn()
    };

    // Register handlers
    registerAvailabilityHandlers(mockBot as any);

    // Extract the available command handler
    const [commandName, handler] = mockBot.command.mock.calls.find(
      (call) => call[0] === 'available'
    );

    // Verify command name
    expect(commandName).toBe('available');

    // Mock context with valid parameters
    const mockCtx = {
      message: { text: '/available 2023-12-25 3 2' },
      reply: jest.fn(),
      replyWithMarkdown: jest.fn()
    };

    // Call the handler
    await handler(mockCtx as any);

    // Verify error message
    expect(mockCtx.reply).toHaveBeenCalledWith(
      expect.stringContaining('Произошла ошибка при получении свободных номеров')
    );
  });
});
