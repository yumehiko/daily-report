# 今後実装すべきタスク

- [ ] `dailyReportAPI.saveReport` を用いた日報のテキストファイル保存機能を追加する
  - ファイル名は `DailyReportYYYYMMDD.txt` とし、デスクトップに出力する
- [ ] タスク入力確定時に一時保存する仕組みを実装する
  - `dailyReportAPI.saveTemp` を呼び出し、`daily-report-temp.tsv` へ書き込む
- [ ] アプリ起動時に一時保存ファイルを読み込み、前回の編集内容を復元できるようにする
- [ ] 日報保存完了後は一時保存ファイルを削除する
