import { formatElapsed } from "@/lib/clock.class";

export default function ClockDisplay({ elapsed }: { elapsed: number }) {
  return <div className="clock-display">{formatElapsed(elapsed)}</div>;
}
