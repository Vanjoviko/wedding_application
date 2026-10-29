type Props = {
  closing: string;
  coupleNames: string;
  coInviters?: string[];
  watermark?: string | null;
};

export function Penutup({ closing, coupleNames, coInviters, watermark }: Props) {
  return (
    <section id="penutup" className="px-6 pt-20 pb-24 text-center">
      <p className="text-body text-ink-soft">{closing}</p>

      <p className="mt-8 font-serif text-name font-medium text-ink italic">
        {coupleNames}
      </p>

      {coInviters && coInviters.length > 0 ? (
        <div className="mt-10">
          <p className="text-meta text-muted">Turut mengundang</p>
          <p className="mt-1 text-meta text-muted">{coInviters.join(", ")}</p>
        </div>
      ) : null}

      {watermark ? <p className="mt-12 text-note text-muted">{watermark}</p> : null}
    </section>
  );
}
