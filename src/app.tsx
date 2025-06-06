import { useState, useEffect } from "react";
import { roundedNow } from "./utils/time";
import { Task } from "./types";
import { generateReport } from "./report";

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // localStorageから初期値を取得
    const saved = localStorage.getItem('daily-report-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [result, setResult] = useState<string>("");
  const hasIncomplete = tasks.some(t => !t.start || !t.end);

  // タスク編集
  const updateTask = (id: string, key: keyof Task, value: string) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, [key]: value } : t);
    setTasks(newTasks);
    localStorage.setItem('daily-report-tasks', JSON.stringify(newTasks));
  };

  // タスク追加
  const addTask = () => {
    const last = tasks[tasks.length - 1];
    let start = last ? last.end : "";
    if (tasks.length === 0) {
      start = roundedNow();
    }
    const newTasks = [
      ...tasks,
      { id: Math.random().toString(36).slice(2), start, name: "", end: "" }
    ];
    setTasks(newTasks);
    localStorage.setItem('daily-report-tasks', JSON.stringify(newTasks));
  };

  // タスク削除
  const removeTask = (id: string) => {
    const newTasks = tasks.filter(t => t.id !== id);
    setTasks(newTasks);
    localStorage.setItem('daily-report-tasks', JSON.stringify(newTasks));
  };


  // バリデーション用フラグ（日付またぎ・未入力チェックは簡易実装）
  const isMultiDay = tasks.some(t => t.start && t.end && t.start > t.end);

  // 新規作成（タスク全消去＋localStorageクリア）
  const handleNewDay = () => {
    setTasks([]);
    setResult("");
    localStorage.removeItem('daily-report-tasks');
  };

  // 入力検証を通過したら自動で結果を更新
  useEffect(() => {
    if (!isMultiDay && !hasIncomplete && tasks.length > 0) {
      const txt = generateReport(tasks);
      setResult(txt);
    }
  }, [tasks, isMultiDay, hasIncomplete]);

  // 結果エリアクリック時にテキストをコピー
  const copyResult = () => {
    if (!result) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(result);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = result;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>日報記録</h1>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>タスク一覧</h2>
        <button onClick={handleNewDay} style={{ background: '#eee', border: '1px solid #ccc', borderRadius: 4, padding: '0.3em 1em', marginLeft: 16 }}>
          新規作成
        </button>
      </div>
      <div>
        {tasks.map(t => (
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
        {isMultiDay && <span style={{ color: "red", marginLeft: 12 }}>日付をまたぐタスクが含まれています</span>}
        {hasIncomplete && <span style={{ color: "red", marginLeft: 12 }}>未入力の項目があります</span>}
      </div>
      <div>
        <h2>結果表示エリア</h2>
        <pre
          onClick={copyResult}
          style={{ background: "#f4f4f4", padding: 12, borderRadius: 6, cursor: "pointer" }}
        >
          {result}
        </pre>
      </div>
    </div>
  );
}

export default App;
