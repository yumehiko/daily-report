import Button from './Button';
import { Task } from '../types';

type Props = {
  task: Task;
  onChange: (id: string, key: keyof Task, value: string) => void;
  onRemove: (id: string) => void;
};

export default function TaskRow({ task, onChange, onRemove }: Props) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
      <input
        type="time"
        value={task.start}
        onChange={e => onChange(task.id, 'start', e.target.value)}
        style={{ width: 80 }}
      />
      <input
        type="text"
        value={task.name}
        placeholder="タスク名"
        onChange={e => onChange(task.id, 'name', e.target.value)}
        style={{ width: 120 }}
      />
      <input
        type="time"
        value={task.end}
        onChange={e => onChange(task.id, 'end', e.target.value)}
        style={{ width: 80 }}
      />
      <Button onClick={() => onRemove(task.id)} title="削除" style={{ padding: '0 0.5em' }}>
        🗑️
      </Button>
    </div>
  );
}
