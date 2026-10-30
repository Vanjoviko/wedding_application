-- M7: template pesan WhatsApp yang bisa diedit pembuat undangan.
alter table public.events
  add column if not exists guest_message_template text;

alter table public.events
  add constraint events_guest_template_length
  check (guest_message_template is null or char_length(guest_message_template) <= 1200);
