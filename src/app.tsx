import { useState } from "react";

// タスク型定義
type Task = {
  id: string;
  start: string;
  name: string;
  end: string;
};

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
    const newTasks = [
      ...tasks,
      { id: Math.random().toString(36).slice(2), start: "", name: "", end: "" }
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

  // 日報出力用データ生成
  const generateReport = () => {
    if (tasks.length === 0) return;
    if (hasIncomplete) {
      alert("開始時刻と終了時刻を入力してください");
      return;
    }
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
    const workMap: Record<string, number> = {};
    sorted.forEach(t => {
      const start = t.start;
      const end = t.end;
      if (!start || !end) return;
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);
      const min = (eh * 60 + em) - (sh * 60 + sm);
      if (t.name === "休憩") {
        breakMinutes += min;
      } else {
        workMap[t.name] = (workMap[t.name] || 0) + min;
      }
    });
    // 合計稼働時間
    const [sh, sm] = workStart.split(":").map(Number);
    const [eh, em] = workEnd.split(":").map(Number);
    const totalMinutes = (eh * 60 + em) - (sh * 60 + sm) - breakMinutes;
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

  // 保存ボタン活性判定（日付またぎ・未入力チェックは簡易実装）
  const isMultiDay = tasks.some(t => t.start && t.end && t.start > t.end);

  // 新規作成（タスク全消去＋localStorageクリア）
  const handleNewDay = () => {
    setTasks([]);
    setResult("");
    localStorage.removeItem('daily-report-tasks');
  };

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
        <button onClick={generateReport} disabled={isMultiDay || hasIncomplete || tasks.length === 0} style={{ fontSize: "1.1em", padding: "0.5em 1.5em" }}>
          保存
        </button>
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
