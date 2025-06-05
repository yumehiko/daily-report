import { useState } from "react";

// タスク型定義
type Task = {
  id: string;
  start: string;
  name: string;
  end: string;
};

declare global {
  interface Window {
    dailyReportAPI: {
      saveTemp: (data: string) => void;
      saveReport: (filename: string, data: string) => void;
    };
  }
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [result, setResult] = useState<string>("");

  // タスク編集
  const updateTask = (id: string, key: keyof Task, value: string) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, [key]: value } : t);
    setTasks(newTasks);
  };

  // タスク追加
  const addTask = () => {
    const newTasks = [
      ...tasks,
      { id: Math.random().toString(36).slice(2), start: "", name: "", end: "" }
    ];
    setTasks(newTasks);
  };

  // タスク削除
  const removeTask = (id: string) => {
    const newTasks = tasks.filter(t => t.id !== id);
    setTasks(newTasks);
  };

  // 日報出力用データ生成
  const generateReport = () => {
    if (tasks.length === 0) return;
    // 日付・出勤・退勤・休憩・合計稼働・タスク集計
    const sorted = [...tasks].sort((a, b) => a.start.localeCompare(b.start));
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const workStart = sorted[0].start;
    const workEnd = sorted[sorted.length - 1].end;
    // 休憩時間合計
    let breakMinutes = 0;
    let workMap: Record<string, number> = {};
    sorted.forEach(t => {
      const start = t.start;
      const end = t.end;
      if (!start || !end) return;
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);
      let min = (eh * 60 + em) - (sh * 60 + sm);
      if (t.name === "休憩") {
        breakMinutes += min;
      } else {
        workMap[t.name] = (workMap[t.name] || 0) + min;
      }
    });
    // 合計稼働時間
    const [sh, sm] = workStart.split(":").map(Number);
    const [eh, em] = workEnd.split(":").map(Number);
    let totalMinutes = (eh * 60 + em) - (sh * 60 + sm) - breakMinutes;
    // フォーマット関数
    const fmt = (min: number) => `${Math.floor(min/60)}:${(min%60).toString().padStart(2, "0")}`;
    // 出力
    let txt = `日付: ${y}/${m}/${d}\n`;
    txt += `出勤時刻: ${workStart}\n`;
    txt += `退勤時刻: ${workEnd}\n`;
    txt += `休憩時間: ${fmt(breakMinutes)}\n`;
    txt += `合計稼働時間: ${fmt(totalMinutes)}\n`;
    txt += `タスク一覧\n`;
    Object.entries(workMap).forEach(([name, min]) => {
      txt += `  - 名前: ${name} / 総作業時間: ${fmt(min as number)}\n`;
    });
    setResult(txt);
  };

  // 保存ボタン活性判定（日付またぎチェックは簡易実装）
  const isMultiDay = tasks.some(t => t.start && t.end && t.start > t.end);

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>日報記録</h1>
      <div>
        <h2>タスク一覧</h2>
        {tasks.map((t, i) => (
          <div key={t.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
            <input type="time" value={t.start} onChange={e => updateTask(t.id, "start", e.target.value)} style={{ width: 80 }} />
            <input type="text" value={t.name} placeholder="タスク名" onChange={e => updateTask(t.id, "name", e.target.value)} style={{ width: 120 }} />
            <input type="time" value={t.end} onChange={e => updateTask(t.id, "end", e.target.value)} style={{ width: 80 }} />
            <button onClick={() => removeTask(t.id)} title="削除">🗑️</button>
          </div>
        ))}
        <button onClick={addTask} style={{ marginTop: 8 }}>＋タスク追加</button>
      </div>
      <div style={{ margin: "1.5rem 0" }}>
        <button onClick={generateReport} disabled={isMultiDay || tasks.length === 0} style={{ fontSize: "1.1em", padding: "0.5em 1.5em" }}>
          保存
        </button>
        {isMultiDay && <span style={{ color: "red", marginLeft: 12 }}>日付をまたぐタスクが含まれています</span>}
      </div>
      <div>
        <h2>結果表示エリア</h2>
        <pre style={{ background: "#f4f4f4", padding: 12, borderRadius: 6 }}>{result}</pre>
      </div>
    </div>
  );
}

export default App;
