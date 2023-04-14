export default function HangManWordDisplay({ letters }: { letters: string[] }) {
  return (
    <div className="rounded-box">
      <div className="flex flex-wrap">
        {letters.map((letter, index) => (
          <div key={index} className="hang-man-letter">
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
}
