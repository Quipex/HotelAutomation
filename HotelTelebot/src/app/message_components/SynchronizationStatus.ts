type SynchronizationStatusArgs = {
  stageText: string, currentStage: number, maxStages: number, done?: boolean
};

function SynchronizationStatus(
  { stageText, currentStage, maxStages, done = false }: SynchronizationStatusArgs
): string {
  const status = done ? '✅ Готово' : '🏃‍♂️ Синхронизируем...';
  return (
    `${status}\n\n`
    + `(${currentStage}/${maxStages}) ${stageText}`
  );
}

export type { SynchronizationStatusArgs };

export default SynchronizationStatus;
