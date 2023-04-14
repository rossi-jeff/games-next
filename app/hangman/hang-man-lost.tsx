export default function HangManLost({ word }: { word: string }) {
  return (
    <div className="rounded-box">
      The word was <strong className="uppercase">{word}</strong>
    </div>
  );
}
