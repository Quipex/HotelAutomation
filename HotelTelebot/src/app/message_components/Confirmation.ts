function Confirmation(message: string): string {
  return (
    '<b>Подтвердите действие</b>:\n'
    + `${message}`
  );
}

export default Confirmation;
