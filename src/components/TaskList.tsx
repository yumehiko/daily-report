import { Task } from '../types';
import Button from './Button';
import TaskRow from './TaskRow';

type Props = {
  tasks: Task[];
  addTask: () => void;
  updateTask: (id: string, key: keyof Task, value: string) => void;
  removeTask: (id: string) => void;
};

export default function TaskList({ tasks, addTask, updateTask, removeTask }: Props) {
  return (
    <div>
      {tasks.map(t => (
        <TaskRow key={t.id} task={t} onChange={updateTask} onRemove={removeTask} />
      ))}
      <Button onClick={addTask} style={{ marginTop: 8 }}>
        ＋タスク追加
      </Button>
    </div>
  );
}
