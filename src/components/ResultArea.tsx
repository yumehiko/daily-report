
import styles from './ResultArea.module.css';

type Props = {
  result: string;
  copyResult: () => void;
  isMultiDay: boolean;
  hasIncomplete: boolean;
};

export default function ResultArea({ result, copyResult, isMultiDay, hasIncomplete }: Props) {
  return (
    <>
      <div className={styles.warningContainer}>
        {isMultiDay && (
          <span className={styles.warning}>
            日付をまたぐタスクが含まれています
          </span>
        )}
        {hasIncomplete && (
          <span className={styles.warning}>
            未入力の項目があります
          </span>
        )}
      </div>
      <div>
        <h2>結果表示エリア</h2>
        <pre
          onClick={copyResult}
          className={styles.resultArea}
        >
          {result}
        </pre>
      </div>
    </>
  );
}
