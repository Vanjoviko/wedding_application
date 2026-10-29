"use client";

import { useEffect, useState } from "react";
import { CountdownBox } from "@/components/ui/CountdownBox";
import { countdownParts, type Countdown as CountdownValue } from "@/lib/datetime";

type Props = {
  targetIso: string;
  initial: CountdownValue;
};

export function Countdown({ targetIso, initial }: Props) {
  const [values, setValues] = useState<CountdownValue>(initial);

  useEffect(() => {
    const target = new Date(targetIso);
    const tick = () => setValues(countdownParts(target));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [targetIso]);

  if (values.finished) {
    return (
      <p className="rounded-count bg-surface px-4 py-6 text-center text-body text-muted">
        Acara telah berlangsung.
      </p>
    );
  }

  return <CountdownBox values={values} />;
}
