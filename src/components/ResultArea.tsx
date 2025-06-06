
type Props = {
  result: string;
  copyResult: () => void;
  isMultiDay: boolean;
  hasIncomplete: boolean;
};

export default function ResultArea({ result, copyResult, isMultiDay, hasIncomplete }: Props) {
  return (
    <>
      <div style={{ margin: '1.5rem 0' }}>
        {isMultiDay && (
          <span style={{ color: 'red', marginLeft: 12 }}>
            日付をまたぐタスクが含まれています
          </span>
        )}
        {hasIncomplete && (
          <span style={{ color: 'red', marginLeft: 12 }}>
            未入力の項目があります
          </span>
        )}
      </div>
      <div>
        <h2>結果表示エリア</h2>
        <pre
          onClick={copyResult}
          style={{ background: '#f4f4f4', padding: 12, borderRadius: 6, cursor: 'pointer' }}
        >
          {result}
        </pre>
      </div>
    </>
  );
}
