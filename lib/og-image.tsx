import { ImageResponse } from "next/og";

type Props = {
  title: string;
  dateLabel: string;
  photo: string | null;
};

/** Komposisi gambar pratinjau tautan, 1200×630. */
export function renderOgImage({ title, dateLabel, photo }: Props) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#1C1916",
      }}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : null}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage:
            "linear-gradient(to bottom, rgba(28,25,22,0.10) 0%, rgba(28,25,22,0.72) 48%, #1C1916 90%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          bottom: 64,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ color: "#B9AFA2", fontSize: 24, letterSpacing: 2 }}>
          Undangan pernikahan
        </div>

        <div
          style={{
            marginTop: 18,
            color: "#F2ECE2",
            fontSize: title.length > 18 ? 88 : 112,
            lineHeight: 1,
          }}
        >
          {title}
        </div>

        <div style={{ marginTop: 26, color: "#E9E1D4", fontSize: 34 }}>{dateLabel}</div>

        <div
          style={{
            marginTop: 30,
            width: 96,
            height: 3,
            backgroundColor: "#C8A46A",
          }}
        />
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
