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

  let txt = `日付: ${y}/${m}/${d}\n`;
  txt += `出勤時刻: ${workStart}\n`;
  txt += `退勤時刻: ${workEnd}\n`;
  txt += `休憩時間: ${formatMinutes(breakMinutes)}\n`;
  txt += `合計稼働時間: ${formatMinutes(totalMinutes)}\n`;
  txt += `タスク一覧\n`;
  Object.entries(workMap).forEach(([name, min]) => {
    txt += `  - 名前: ${name} / 総作業時間: ${formatMinutes(min)}\n`;
  });

  return txt;
}

