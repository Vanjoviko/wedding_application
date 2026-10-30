"use client";

import { Field, SubHead, TextInput } from "@/components/wizard/fields";
import type { StepProps } from "@/components/wizard/types";

export function StepMempelai({ content, onChange }: StepProps) {
  return (
    <div>
      <SubHead>Mempelai pria</SubHead>
      <Field label="Nama panggilan" htmlFor="groom-nickname">
        <TextInput
          id="groom-nickname"
          value={content.groom?.nickname ?? ""}
          onChange={(value) =>
            onChange((draft) => ({
              ...draft,
              groom: { ...draft.groom, nickname: value },
            }))
          }
          placeholder="Raka"
          maxLength={40}
        />
      </Field>
      <Field label="Nama lengkap dan gelar" htmlFor="groom-fullname">
        <TextInput
          id="groom-fullname"
          value={content.groom?.fullName ?? ""}
          onChange={(value) =>
            onChange((draft) => ({
              ...draft,
              groom: { ...draft.groom, fullName: value },
            }))
          }
          placeholder="Raka Pradipta Wibowo, S.T."
        />
      </Field>
      <Field label="Urutan anak" htmlFor="groom-order" hint="Contoh: pertama, kedua">
        <TextInput
          id="groom-order"
          value={content.groom?.childOrder ?? ""}
          onChange={(value) =>
            onChange((draft) => ({
              ...draft,
              groom: { ...draft.groom, childOrder: value },
            }))
          }
          placeholder="pertama"
          maxLength={40}
        />
      </Field>
      <Field label="Nama ayah" htmlFor="groom-father">
        <TextInput
          id="groom-father"
          value={content.groom?.father ?? ""}
          onChange={(value) =>
            onChange((draft) => ({
              ...draft,
              groom: { ...draft.groom, father: value },
            }))
          }
          placeholder="Bapak Haryo Wibowo"
        />
      </Field>
      <Field label="Nama ibu" htmlFor="groom-mother">
        <TextInput
          id="groom-mother"
          value={content.groom?.mother ?? ""}
          onChange={(value) =>
            onChange((draft) => ({
              ...draft,
              groom: { ...draft.groom, mother: value },
            }))
          }
          placeholder="Ibu Sri Lestari"
        />
      </Field>
      <Field
        label="Instagram (opsional)"
        htmlFor="groom-instagram"
        hint="Tanpa tanda @. Kosongkan bila tidak ingin ditampilkan."
      >
        <TextInput
          id="groom-instagram"
          value={content.groom?.instagram ?? ""}
          onChange={(value) =>
            onChange((draft) => ({
              ...draft,
              groom: { ...draft.groom, instagram: value },
            }))
          }
          placeholder="raka.pradipta"
          maxLength={30}
        />
      </Field>

      <SubHead>Mempelai wanita</SubHead>
      <Field label="Nama panggilan" htmlFor="bride-nickname">
        <TextInput
          id="bride-nickname"
          value={content.bride?.nickname ?? ""}
          onChange={(value) =>
            onChange((draft) => ({
              ...draft,
              bride: { ...draft.bride, nickname: value },
            }))
          }
          placeholder="Sekar"
          maxLength={40}
        />
      </Field>
      <Field label="Nama lengkap dan gelar" htmlFor="bride-fullname">
        <TextInput
          id="bride-fullname"
          value={content.bride?.fullName ?? ""}
          onChange={(value) =>
            onChange((draft) => ({
              ...draft,
              bride: { ...draft.bride, fullName: value },
            }))
          }
          placeholder="Sekar Ayu Kinanti, S.Ds."
        />
      </Field>
      <Field label="Urutan anak" htmlFor="bride-order" hint="Contoh: pertama, kedua">
        <TextInput
          id="bride-order"
          value={content.bride?.childOrder ?? ""}
          onChange={(value) =>
            onChange((draft) => ({
              ...draft,
              bride: { ...draft.bride, childOrder: value },
            }))
          }
          placeholder="kedua"
          maxLength={40}
        />
      </Field>
      <Field label="Nama ayah" htmlFor="bride-father">
        <TextInput
          id="bride-father"
          value={content.bride?.father ?? ""}
          onChange={(value) =>
            onChange((draft) => ({
              ...draft,
              bride: { ...draft.bride, father: value },
            }))
          }
          placeholder="Bapak Bambang Kuncoro"
        />
      </Field>
      <Field label="Nama ibu" htmlFor="bride-mother">
        <TextInput
          id="bride-mother"
          value={content.bride?.mother ?? ""}
          onChange={(value) =>
            onChange((draft) => ({
              ...draft,
              bride: { ...draft.bride, mother: value },
            }))
          }
          placeholder="Ibu Ratna Dewi"
        />
      </Field>
      <Field label="Instagram (opsional)" htmlFor="bride-instagram" hint="Tanpa tanda @.">
        <TextInput
          id="bride-instagram"
          value={content.bride?.instagram ?? ""}
          onChange={(value) =>
            onChange((draft) => ({
              ...draft,
              bride: { ...draft.bride, instagram: value },
            }))
          }
          placeholder="sekar.kinanti"
          maxLength={30}
        />
      </Field>
    </div>
  );
}
