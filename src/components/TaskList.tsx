import { Task } from '../types';
import Button from './Button';
import TaskRow from './TaskRow';
import styles from './TaskList.module.css';

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
      <Button onClick={addTask} className={styles.addButton}>
        ＋タスク追加
      </Button>
    </div>
  );
}
