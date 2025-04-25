/**
 * Formats booking information into readable text
 */
export const formatBooking = (booking: any): string => {
  if (!booking) return 'Бронирование не найдено.';

  return `
*Бронирование №${booking.id}*
*Клиент:* ${booking.client?.first_name} ${booking.client?.last_name}
*Телефон:* ${booking.client?.phone || 'Не указан'}
*Заезд:* ${formatDate(booking.checkin_date)}
*Выезд:* ${formatDate(booking.checkout_date)}
*Номер:* ${booking.room?.number || 'Не назначен'}
*Статус:* ${getStatusText(booking.status)}
*Сумма:* ${booking.cost || 0} руб.
${booking.notes ? `*Заметки:* ${booking.notes}` : ''}
  `.trim();
};

/**
 * Formats available rooms list
 */
export const formatAvailableRooms = (rooms: any[], date: string, days: number, guests: number): string => {
  if (!rooms || rooms.length === 0) {
    return `На дату ${date} на ${days} дней для ${guests} гостей свободных номеров не найдено.`;
  }

  let result = `*Свободные номера на ${date}, ${days} дней, ${guests} гостей:*\n\n`;

  rooms.forEach((room, index) => {
    result += `${index + 1}. *Номер ${room.number}* (Этаж ${room.floor})\n`;
    result += `   Вместимость: ${room.capacity} чел.\n`;
    if (room.features?.sea_view) result += '   ✓ Вид на море\n';
    if (room.features?.balcony_side) result += `   ✓ Балкон: ${room.features.balcony_side}\n`;
    result += `   Тип: ${room.type || 'Стандарт'}\n\n`;
  });

  return result;
};

/**
 * Formats sync status information
 */
export const formatSyncStatus = (status: any): string => {
  if (!status) return 'Информация о синхронизации недоступна.';

  return `
*Статус синхронизации*
*Последняя синхронизация:* ${formatDateTime(status.last_sync_at)}
*Статус:* ${status.status}
*Длительность:* ${status.duration} сек.
${status.details ? `*Подробности:* ${status.details}` : ''}
  `.trim();
};

// Helper functions
const formatDate = (dateString: string): string => {
  if (!dateString) return 'Не указано';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
};

const formatDateTime = (dateTimeString: string): string => {
  if (!dateTimeString) return 'Не указано';
  const date = new Date(dateTimeString);
  return date.toLocaleString('ru-RU');
};

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: 'Ожидает оплаты',
    CONFIRMED: 'Подтверждено',
    CHECKED_IN: 'Проживает',
    CHECKED_OUT: 'Выехал',
    CANCELLED: 'Отменено'
  };

  return statusMap[status] || status;
};
