import { GuessWordGuess } from "@/types/guess-word-guess.type";

export default function GuessWordGuessList({
  guesses,
}: {
  guesses: GuessWordGuess[];
}) {
  return (
    <div className="rounded-box">
      {guesses.map((guess) => (
        <div key={guess.id} className="flex flex-wrap guess-word-guess mb-2">
          {guess.ratings != undefined &&
            guess.Guess != undefined &&
            guess.ratings.map((rating, index) => (
              <div key={rating.id} className={rating.Rating}>
                {guess.Guess ? guess.Guess[index] : ""}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
