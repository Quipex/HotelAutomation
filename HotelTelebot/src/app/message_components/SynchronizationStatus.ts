function SynchronizationStatus(stageText: string, currentStage: number, maxStages: number, done = false): string {
  const status = done ? '✅ Готово' : '🏃‍♂️ Синхронизируем...';
  return (
    `${status}\n\n`
    + `(${currentStage}/${maxStages}) ${stageText}`
  );
}

export default SynchronizationStatus;
