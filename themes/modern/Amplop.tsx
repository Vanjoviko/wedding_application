import { CopyButton } from "@/components/invitation/CopyButton";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Account = {
  bank: string;
  number: string;
  holder: string;
};

type Props = {
  accounts: Account[];
  address?: string;
};

export function Amplop({ accounts, address }: Props) {
  return (
    <section id="amplop" className="px-6 pt-16 pb-4">
      <SectionHeading supporting="Doa restu Anda sudah lebih dari cukup. Bila ingin memberi tanda kasih, ini caranya.">
        Amplop digital
      </SectionHeading>

      <div className="mt-6 flex flex-col gap-3">
        {accounts.map((account) => (
          <div
            key={`${account.bank}-${account.number}`}
            className="rounded-card border border-line bg-surface p-5"
          >
            <p className="text-meta text-muted">{account.bank}</p>
            <p className="mt-1 text-body tracking-[0.04em] text-ink tabular-nums">
              {account.number}
            </p>
            <p className="mt-1 text-meta text-muted">a.n. {account.holder}</p>
            <div className="mt-4">
              <CopyButton value={account.number} label="Salin nomor" />
            </div>
          </div>
        ))}

        {address ? (
          <div className="rounded-card border border-line bg-surface p-5">
            <p className="text-meta text-muted">Alamat kirim kado</p>
            <p className="mt-1 text-body text-ink-soft">{address}</p>
            <div className="mt-4">
              <CopyButton value={address} label="Salin alamat" />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
