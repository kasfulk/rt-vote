-- Seed data for C8 blok residents (Updated Schema)
INSERT INTO warga (blok, nomor_rumah, no_kk, nama, domisili, pemilik_rumah, penyewa, is_calon, sudah_memilih)
VALUES
('C8', '1', '6471040609190004', 'Amal Jauhari', 'Tetap', NULL, NULL, FALSE, FALSE),
('C8', '2', '6471030309210012', 'Aris Darma', 'Domisili', 'Pemilik Rumah', NULL, FALSE, FALSE),
('C8', '3', '6471031907100005', 'Heryy Septianto', 'Domisili', 'Pemilik Rumah', NULL, FALSE, FALSE),
('C8', '4', '6471030712230002', 'Fadhel Al Farisy', 'Tetap', NULL, NULL, FALSE, FALSE),
('C8', '5', '6471060209200003', 'A Epsonny Kristian S', 'Domisili', NULL, 'Penyewa', FALSE, FALSE);

-- Example votes (empty for new installation)
-- INSERT INTO pilihan (pemilih_id, calon_id) VALUES (1, 2);