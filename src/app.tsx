import { useState, useEffect } from "react";
import { roundedNow } from "./utils/time";
import { Task } from "./types";
import { generateReport } from "./report";
import Button from "./components/Button";
import TaskList from "./components/TaskList";
import ResultArea from "./components/ResultArea";
import styles from "./App.module.css";

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
    <div className={styles.container}>
      <h1>日報記録</h1>
      <div className={styles.header}>
        <h2>タスク一覧</h2>
        <Button onClick={handleNewDay} className={styles.newDayButton}>
          新規作成
        </Button>
      </div>
      <TaskList tasks={tasks} addTask={addTask} updateTask={updateTask} removeTask={removeTask} />
      <ResultArea
        result={result}
        copyResult={copyResult}
        isMultiDay={isMultiDay}
        hasIncomplete={hasIncomplete}
      />
    </div>
  );
}

export default App;
