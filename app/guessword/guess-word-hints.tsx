export default function GuessWordHints({
  show,
  hints,
  showChanged,
}: {
  show: boolean;
  hints: string[];
  showChanged: Function;
}) {
  const cbChanged = () => {
    showChanged({ show: !show });
  };
  return (
    <div className="rounded-box">
      <input
        type="checkbox"
        name="show-hints"
        checked={show}
        onChange={cbChanged}
        className="mr-1"
      />
      <label htmlFor="show-hints">Show Hints</label>
      <div className="flex flex-wrap max-h-96 overflow-y-auto">
        {hints.map((hint, i) => (
          <div key={i} className="mr-2 mb-2">
            {hint}
          </div>
        ))}
      </div>
    </div>
  );
}
