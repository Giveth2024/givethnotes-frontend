'use client';

import { useEffect, useState } from 'react';

export default function DailyQuote() {
  const [quote, setQuote] = useState(null);

    useEffect(() => {
        // Fetch from your OWN API route instead of zenquotes.io
        fetch('/api/quote') 
        .then(res => res.json())
        .then(data => {
            if (data && data[0]) {
            setQuote(data[0]);
            }
        })
        .catch(() => setQuote(null));
    }, []);

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">

        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Daily <span className="text-amber-400">Perspective</span>
        </h2>

        {!quote && (
          <p className="mt-8 text-gray-500 italic">
            Loading today's thought…
          </p>
        )}

        {quote && (
          <>
            <blockquote className="mt-10 text-xl md:text-2xl italic text-gray-300 font-light leading-relaxed">
              “{quote.q}”
            </blockquote>

            <p className="mt-6 text-sm text-gray-500">
              — {quote.a}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
