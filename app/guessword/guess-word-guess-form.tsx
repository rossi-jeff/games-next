import { useEffect, useState } from "react";

export default function GuessWordGuessForm({
  length,
  sendGuess,
}: {
  length: number;
  sendGuess: Function;
}) {
  const [letters, setLetters] = useState<string[]>([]);
  const [ready, setReady] = useState<boolean>(false);

  const inputChanged = (ev: any, index: number) => {
    const { value } = ev.target;
    const current: string[] = [...letters];
    current[index] = value;
    setLetters(current);
    if (index + 1 < length) {
      const inputs = document.getElementsByClassName("single");
      const el = inputs[index + 1] as HTMLInputElement;
      if (el) el.focus();
    }
  };

  const guessClicked = () => {
    const Guess: string = letters.join("").toLowerCase();
    sendGuess({ Guess });
    let l: string[] = [];
    for (let i = 0; i < length; i++) l[i] = "";
    setLetters(l);
  };

  useEffect(() => {
    let l: string[] = [];
    for (let i = 0; i < length; i++) l[i] = "";
    setLetters(l);
  }, [length]);

  useEffect(() => {
    let valid: boolean = true;
    for (const l of letters) if (l == "") valid = false;
    setReady(valid);
  }, [letters]);

  return (
    <div className="rounded-box">
      <div className="flex flex-wrap">
        {letters.map((letter, index) => (
          <div key={index} className="mr-2">
            <input
              type="text"
              value={letter}
              onChange={(e) => inputChanged(e, index)}
              className="single"
              maxLength={1}
            />
          </div>
        ))}
        <div>
          <button onClick={guessClicked} disabled={!ready}>
            Guess
          </button>
        </div>
      </div>
    </div>
  );
}
