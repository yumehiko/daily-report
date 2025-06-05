// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge } from 'electron';
import { writeFile } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

contextBridge.exposeInMainWorld('dailyReportAPI', {
  saveTemp: (data: string) => {
    const filePath = join(homedir(), 'daily-report-temp.tsv');
    writeFile(filePath, data, err => {
      if (err) console.error('一時保存失敗', err);
    });
  },
  saveReport: (filename: string, data: string) => {
    const filePath = join(homedir(), 'Desktop', filename);
    writeFile(filePath, data, err => {
      if (err) console.error('日報保存失敗', err);
    });
  }
});
