import { AxiosResponse } from 'axios';
import { Context } from 'telegraf';
import { api } from '../../api';
import { registerSyncHandlers } from '../syncHandlers';

// Mock the API
jest.mock('../../api');
const mockApi = jest.mocked(api);

describe('Sync Handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sync handler should trigger sync operation', async () => {
    // Mock API response
    const mockResponse: AxiosResponse = {
      data: 'ok',
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };

    mockApi.syncData.mockResolvedValue(mockResponse);

    // Create a mock bot with spies
    const mockBot = {
      command: jest.fn()
    };

    // Register handlers
    registerSyncHandlers(mockBot as any);

    // Extract the sync command handler (first argument of the first call)
    expect(mockBot.command).toHaveBeenCalled();
    const [commandName, handler] = mockBot.command.mock.calls.find(
      (call) => call[0] === 'sync'
    );

    // Verify command name
    expect(commandName).toBe('sync');

    // Mock context for the handler
    const mockCtx = {
      reply: jest.fn()
    };

    // Call the handler
    await handler(mockCtx as any);

    // Verify API was called
    expect(mockApi.syncData).toHaveBeenCalled();

    // Verify replies
    expect(mockCtx.reply).toHaveBeenCalledTimes(2);
    expect(mockCtx.reply).toHaveBeenNthCalledWith(1, 'Синхронизация запущена...');
    expect(mockCtx.reply).toHaveBeenNthCalledWith(2, 'Синхронизация успешно выполнена');
  });

  test('sync handler should handle API errors', async () => {
    // Mock API error
    mockApi.syncData.mockRejectedValue(new Error('Network error'));

    // Create a mock bot with spies
    const mockBot = {
      command: jest.fn()
    };

    // Register handlers
    registerSyncHandlers(mockBot as any);

    // Extract the sync command handler
    const [commandName, handler] = mockBot.command.mock.calls.find(
      (call) => call[0] === 'sync'
    );

    // Verify command name
    expect(commandName).toBe('sync');

    // Mock context for the handler
    const mockCtx = {
      reply: jest.fn()
    };

    // Call the handler
    await handler(mockCtx as any);

    // Verify error message
    expect(mockCtx.reply).toHaveBeenCalledTimes(2);
    expect(mockCtx.reply).toHaveBeenNthCalledWith(1, 'Синхронизация запущена...');
    expect(mockCtx.reply).toHaveBeenNthCalledWith(2, 'Произошла ошибка при синхронизации. Пожалуйста, попробуйте позже.');
  });

  test('syncstatus handler should fetch and display sync status', async () => {
    // Mock sync status response
    const mockSyncStatus = {
      last_sync_at: '2023-04-15T12:30:45Z',
      status: 'SUCCESS',
      duration: 3.5,
      details: 'Synchronized 24 bookings'
    };

    const mockResponse: AxiosResponse = {
      data: mockSyncStatus,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };

    mockApi.get.mockResolvedValue(mockResponse);

    // Create a mock bot with spies
    const mockBot = {
      command: jest.fn()
    };

    // Register handlers
    registerSyncHandlers(mockBot as any);

    // Extract the syncstatus command handler
    const [commandName, handler] = mockBot.command.mock.calls.find(
      (call) => call[0] === 'syncstatus'
    );

    // Verify command name
    expect(commandName).toBe('syncstatus');

    // Mock context for the handler
    const mockCtx = {
      replyWithMarkdown: jest.fn()
    };

    // Call the handler
    await handler(mockCtx as any);

    // Verify API was called correctly
    expect(mockApi.get).toHaveBeenCalledWith('/sync/status');

    // Verify reply with formatted data
    expect(mockCtx.replyWithMarkdown).toHaveBeenCalled();

    // Verify reply content
    const replyText = mockCtx.replyWithMarkdown.mock.calls[0][0];
    expect(replyText).toContain('Статус синхронизации');
    expect(replyText).toContain('SUCCESS');
    expect(replyText).toContain('3.5 сек.');
    expect(replyText).toContain('Synchronized 24 bookings');
  });
});
