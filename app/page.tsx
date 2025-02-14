"use client";

import PlaneSVG from "../assets/plane.svg";
import { useState } from "react";

export default function Home() {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [activePassenger, setActivePassenger] = useState(1);
  const [occupiedSeats] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); 

  const handleSeatSelect = (seatNumber: number) => {
    if (occupiedSeats.includes(seatNumber)) {
      return;
    }

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else if (selectedSeats.length < 3) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  return (
    <main className="flex min-h-screen p-8">
      {/* Sol taraf - Koltuk seçimi */}
      <div className="w-1/2 relative">
      <div 
          className="absolute inset-0 -z-10 bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${PlaneSVG.src})` }}
        />
        <div className="airplane-outline px-20 py-10">
          <div className="grid grid-cols-4 gap-1 max-w-[150px] mx-auto">
            {[...Array(90)].map((_, index) => {
              const seatNumber = index + 1;
              const isOccupied = occupiedSeats.includes(seatNumber);
              
              return (
                <button
                  key={index}
                  onClick={() => handleSeatSelect(seatNumber)}
                  disabled={isOccupied}
                  className={`w-8 h-8 border rounded-md flex items-center justify-center text-sm
                    ${isOccupied ? 'bg-gray-300 cursor-not-allowed' : 
                      selectedSeats.includes(seatNumber) ? 'bg-yellow-200' : 'bg-white hover:bg-gray-100'}
                    transition-colors`}
                >
                  {seatNumber}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-8 flex gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border"></div>
            <span>Boş</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200"></div>
            <span>Seçili</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#e5e5e5]"></div>
            <span>Dolu</span>
          </div>
        </div>
      </div>

      {/* Sağ taraf - Yolcu formu */}
      <div className="w-1/2 space-y-4">
        {[1, 2, 3].map((passengerNum) => (
          <div
            key={passengerNum}
            className="bg-[#c6c6c6] rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setActivePassenger(passengerNum)}
              className="w-full p-4 text-left flex justify-between items-center"
            >
              <span>{passengerNum}. Yolcu</span>
              <span className="transform transition-transform duration-200">
                {activePassenger === passengerNum ? "▼" : "▶"}
              </span>
            </button>
            
            {activePassenger === passengerNum && (
              <div className="p-4 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">İsim</label>
                    <input type="text" className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Soyisim</label>
                    <input type="text" className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Telefon</label>
                    <input type="tel" className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">E-Posta</label>
                    <input type="email" className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Cinsiyet</label>
                    <select className="w-full border rounded p-2">
                      <option value="">Seçiniz</option>
                      <option value="K">Kadın</option>
                      <option value="E">Erkek</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Doğum Tarihi</label>
                    <input type="date" className="w-full border rounded p-2" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <button className="w-full bg-[#c6c6c6] p-4 rounded-lg font-medium mt-8">
          İşlemleri Tamamla
        </button>

        {selectedSeats.length > 0 && (
          <div className="bg-[#c6c6c6] p-4 rounded-lg mt-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {selectedSeats.map(seat => (
                  <span key={seat} className="bg-yellow-200 px-2 py-1 rounded">
                    {seat}
                  </span>
                ))}
              </div>
              <div className="text-right">
                <div>{selectedSeats.length}x</div>
                <div className="text-xl font-bold">
                  {(selectedSeats.length * 1000).toLocaleString('tr-TR')} TL
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
