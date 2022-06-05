const sourceToText = (source: string): string => {
  switch (source.toUpperCase()) {
    case 'EASYMS':
    case 'FRONT_DESK':
      return '🟣 Напрямую';
    case 'BOOKING':
      return '🔵 Booking';
    default:
      return '⚠ Неизвестный ⚠';
  }
};

export { sourceToText };
