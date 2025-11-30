"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface TopCandidate {
  id: string;
  nama: string;
  blok: string;
  nomor_rumah: string;
  votes: number;
}

export default function Home() {
  const [topCandidates, setTopCandidates] = useState<TopCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch('/api/results');
        const data = await res.json();
        
        if (res.ok && data.status === 'ok') {
          setTopCandidates(data.data);
        } else {
          setError(data.message || 'Gagal memuat hasil voting');
        }
      } catch {
        setError('Gagal memuat hasil voting');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold mb-2">Pemilihan Ketua RT <br />RT. 61 Kel. Batu Ampar, Kec. Balikpapan Utara, Balikpapan - 2025</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Top 3 Kandidat dengan Suara Terbanyak</p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Memuat hasil voting...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : topCandidates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Belum ada hasil voting.</p>
          </div>
        ) : (
          <ol className="font-mono list-inside text-sm/6 text-center sm:text-left space-y-4">
            {topCandidates.map((candidate, index) => (
              <li key={candidate.id} className="tracking-[-.01em] text-lg">
                <span className="font-bold text-xl">{index + 1}.</span> {candidate.nama} / {candidate.blok} / {candidate.nomor_rumah} - <span className="font-bold">{candidate.votes}</span>
              </li>
            ))}
          </ol>
        )}

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            href="/login"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            Login untuk Voting
          </a>
        </div>
      </main>
    </div>
  );
}
