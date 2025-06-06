import { Task } from './types';
import { diffMinutes, formatMinutes } from './utils/time';

export function generateReport(tasks: Task[]): string {
  if (tasks.length === 0) return '';

  const sorted = [...tasks].sort((a, b) => a.start.localeCompare(b.start));
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  const workStart = sorted[0].start;
  const workEnd = sorted[sorted.length - 1].end;

  let breakMinutes = 0;
  const workMap: Record<string, number> = {};

  sorted.forEach(t => {
    const { start, end } = t;
    if (!start || !end) return;
    const min = diffMinutes(start, end);
    if (t.name === '休憩') {
      breakMinutes += min;
    } else {
      workMap[t.name] = (workMap[t.name] || 0) + min;
    }
  });

  const totalMinutes = diffMinutes(workStart, workEnd) - breakMinutes;

  let txt = `${y}/${m}/${d}\n`;
  txt += `出勤: ${workStart}\n`;
  txt += `退勤: ${workEnd}\n`;
  txt += `休憩: ${formatMinutes(breakMinutes)}\n`;
  txt += `稼働: ${formatMinutes(totalMinutes)}\n`;
  txt += `タスク一覧\n`;
  Object.entries(workMap).forEach(([name, min]) => {
    txt += `  - ${name}　｜　${formatMinutes(min)}\n`;
  });

  return txt;
}

