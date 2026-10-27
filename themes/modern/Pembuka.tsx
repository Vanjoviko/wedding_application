type Props = {
  quote?: string;
  source?: string;
  invitation: string;
};

export function Pembuka({ quote, source, invitation }: Props) {
  return (
    <section id="pembuka" className="px-6 pt-20 text-center">
      {quote ? (
        <>
          <p className="mx-auto max-w-[300px] font-serif text-quote font-medium text-ink italic">
            {quote}
          </p>
          {source ? <p className="mt-3 text-note text-muted">{source}</p> : null}
          <span aria-hidden className="mx-auto mt-8 block h-px w-12 bg-accent" />
        </>
      ) : null}

      <p className="mx-auto mt-6 max-w-[290px] text-[14px] leading-[1.6] text-muted">
        {invitation}
      </p>
    </section>
  );
}
