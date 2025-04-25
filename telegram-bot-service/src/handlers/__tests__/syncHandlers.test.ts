import { AxiosResponse } from 'axios';
import { Context, Telegraf } from 'telegraf';
import { api } from '../../api';
import { registerSyncHandlers } from '../syncHandlers';

// Mock the API
jest.mock('../../api');
const mockApi = api as jest.Mocked<typeof api>;

describe('Sync Handlers', () => {
  let bot: Telegraf<Context>;

  beforeEach(() => {
    bot = new Telegraf('TEST_TOKEN');
    jest.clearAllMocks();
  });

  test('sync handler should trigger sync operation', async () => {
    registerSyncHandlers(bot);

    // Mock API response
    const mockResponse: AxiosResponse = {
      data: 'ok',
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };

    mockApi.syncData.mockResolvedValue(mockResponse);

    // Mock Telegraf Context
    const mockCtx = {
      message: { text: '/sync' },
      reply: jest.fn()
    };

    // Find and execute the sync command handler
    const syncHandler = (bot as any).handlers.command.find(
      (h: any) => h.triggers.includes('sync')
    )?.middleware;

    await syncHandler(mockCtx as any);

    // Verify that the API was called
    expect(mockApi.syncData).toHaveBeenCalled();

    // Verify the initial and success messages
    expect(mockCtx.reply).toHaveBeenCalledTimes(2);
    expect(mockCtx.reply).toHaveBeenNthCalledWith(1, 'Синхронизация запущена...');
    expect(mockCtx.reply).toHaveBeenNthCalledWith(2, 'Синхронизация успешно выполнена');
  });

  test('sync handler should handle API errors', async () => {
    registerSyncHandlers(bot);

    // Mock API error
    mockApi.syncData.mockRejectedValue(new Error('Network error'));

    // Mock Telegraf Context
    const mockCtx = {
      message: { text: '/sync' },
      reply: jest.fn()
    };

    // Find and execute the sync command handler
    const syncHandler = (bot as any).handlers.command.find(
      (h: any) => h.triggers.includes('sync')
    )?.middleware;

    await syncHandler(mockCtx as any);

    // Verify that error message was sent
    expect(mockCtx.reply).toHaveBeenCalledTimes(2);
    expect(mockCtx.reply).toHaveBeenNthCalledWith(1, 'Синхронизация запущена...');
    expect(mockCtx.reply).toHaveBeenNthCalledWith(2, 'Произошла ошибка при синхронизации. Пожалуйста, попробуйте позже.');
  });

  test('syncstatus handler should fetch and display sync status', async () => {
    registerSyncHandlers(bot);

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

    // Mock Telegraf Context
    const mockCtx = {
      message: { text: '/syncstatus' },
      reply: jest.fn(),
      replyWithMarkdown: jest.fn()
    };

    // Find and execute the syncstatus command handler
    const syncStatusHandler = (bot as any).handlers.command.find(
      (h: any) => h.triggers.includes('syncstatus')
    )?.middleware;

    await syncStatusHandler(mockCtx as any);

    // Verify that API was called correctly
    expect(mockApi.get).toHaveBeenCalledWith('/sync/status');

    // Verify that the reply was called with formatted data
    expect(mockCtx.replyWithMarkdown).toHaveBeenCalled();

    // Get the reply text and verify it contains expected elements
    const replyText = mockCtx.replyWithMarkdown.mock.calls[0][0];
    expect(replyText).toContain('Статус синхронизации');
    expect(replyText).toContain('SUCCESS');
    expect(replyText).toContain('3.5 сек.');
    expect(replyText).toContain('Synchronized 24 bookings');
  });
});
