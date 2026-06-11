export type OneLinerTrigger = 'start' | 'complete' | 'stop' | 'stopwatch-stop';

const START_POOL = [
  "session initiated. good luck out there.",
  "clock is running. go do the thing.",
  "signal acquired. begin.",
  "timer active. you've got this.",
  "block started. make it count.",
  "running. the rest can wait."
];

const COMPLETE_POOL = [
  "session complete. well done.",
  "time. take a breath.",
  "block finished. you showed up.",
  "transmission end. rest now.",
  "done. that one counted.",
  "logged. good session."
];

const STOP_POOL = [
  "session logged.",
  "stopping here. that counts.",
  "recorded. rest if you need it.",
  "noted. good enough is real.",
  "logged early. still counts.",
  "marked. whenever you're ready."
];

const STOPWATCH_STOP_POOL = [
  "time captured.",
  "session logged. nice work.",
  "marked. that was something.",
  "recorded. go breathe.",
  "stopwatch closed. logged.",
  "noted. you did a thing."
];

/**
 * Returns a randomized one-liner message for the given trigger event.
 */
export function getOneLiner(trigger: OneLinerTrigger): string {
  let pool: string[];
  switch (trigger) {
    case 'start':
      pool = START_POOL;
      break;
    case 'complete':
      pool = COMPLETE_POOL;
      break;
    case 'stop':
      pool = STOP_POOL;
      break;
    case 'stopwatch-stop':
      pool = STOPWATCH_STOP_POOL;
      break;
    default:
      return '';
  }
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
