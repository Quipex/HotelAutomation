type FromStatusFn = (args: { living: boolean, prepaid: boolean, cancelled: boolean }) => string;

const getStatusText: FromStatusFn = ({ living, prepaid, cancelled }) => {
  if (cancelled) {
    return '❌ Отмена';
  }
  if (living) {
    return '🟩 Проживает';
  }
  if (prepaid) {
    return '🟨 Предоплата';
  }
  return '🟥 Без предоплаты';
};

export { getStatusText };
