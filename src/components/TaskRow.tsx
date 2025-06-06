import Button from './Button';
import { Task } from '../types';
import styles from './TaskRow.module.css';

type Props = {
  task: Task;
  onChange: (id: string, key: keyof Task, value: string) => void;
  onRemove: (id: string) => void;
};

export default function TaskRow({ task, onChange, onRemove }: Props) {
  return (
    <div className={styles.row}>
      <input
        type="time"
        value={task.start}
        onChange={e => onChange(task.id, 'start', e.target.value)}
        className={styles.timeInput}
      />
      <input
        type="text"
        value={task.name}
        placeholder="タスク名"
        onChange={e => onChange(task.id, 'name', e.target.value)}
        className={styles.nameInput}
      />
      <input
        type="time"
        value={task.end}
        onChange={e => onChange(task.id, 'end', e.target.value)}
        className={styles.timeInput}
      />
      <Button onClick={() => onRemove(task.id)} title="削除" className={styles.removeButton}>
        🗑️
      </Button>
    </div>
  );
}
