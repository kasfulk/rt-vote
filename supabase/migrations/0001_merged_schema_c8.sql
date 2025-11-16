-- Merged schema for C8 blok residents voting system
-- This migration combines the original and updated schemas into a single comprehensive migration

-- Drop existing tables if they exist (from both original and updated schemas)
drop table if exists pilihan;
drop table if exists warga;

-- Create updated warga table with new structure matching the C8 requirements
create table warga (
  id bigint generated always as identity primary key,
  blok text not null,
  nomor_rumah text not null,
  no_kk text not null unique,
  nama text not null,
  domisili text not null check (domisili in ('Tetap', 'Domisili')),
  pemilik_rumah text,
  penyewa text,
  is_calon boolean default false,
  sudah_memilih boolean default false,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);

-- Create pilihan (votes) table
create table pilihan (
  id bigint generated always as identity primary key,
  pemilih_id bigint not null references warga(id),
  calon_id bigint not null references warga(id),
  waktu_pilih timestamp default current_timestamp,
  constraint unique_vote unique (pemilih_id)
);

-- Create indexes for better performance
create index idx_warga_blok_nomor on warga(blok, nomor_rumah);
create index idx_warga_no_kk on warga(no_kk);
create index idx_warga_is_calon on warga(is_calon);
create index idx_pilihan_pemilih on pilihan(pemilih_id);
create index idx_pilihan_calon on pilihan(calon_id);

-- Insert C8 blok residents data
INSERT INTO warga (blok, nomor_rumah, no_kk, nama, domisili, pemilik_rumah, penyewa, is_calon, sudah_memilih)
VALUES
('C8', '1', '6471040609190004', 'Amal Jauhari', 'Tetap', NULL, NULL, FALSE, FALSE),
('C8', '2', '6471030309210012', 'Aris Darma', 'Domisili', 'Pemilik Rumah', NULL, FALSE, FALSE),
('C8', '3', '6471031907100005', 'Heryy Septianto', 'Domisili', 'Pemilik Rumah', NULL, FALSE, FALSE),
('C8', '4', '6471030712230002', 'Fadhel Al Farisy', 'Tetap', NULL, NULL, FALSE, FALSE),
('C8', '5', '6471060209200003', 'A Epsonny Kristian S', 'Domisili', NULL, 'Penyewa', FALSE, FALSE);

-- Create function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = current_timestamp;
    return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger update_warga_updated_at 
before update on warga 
for each row 
execute function update_updated_at_column();