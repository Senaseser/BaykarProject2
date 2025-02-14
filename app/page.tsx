"use client";

import { PassengerType } from "@/types/Passenger";
// import Image from "next/image";
import Plane from "../assets/airplane.png";
import { useState, useEffect } from "react";

const BASE_URL = "https://jsonplaceholder.typicode.com/users";

export default function Home() {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [activePassenger, setActivePassenger] = useState(1);
  const [occupiedSeats] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [passengers, setPassengers] = useState<Array<PassengerType>>([]);
  const [warning, setWarning] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(BASE_URL);
        const data = await response.json();
        setPassengers(data.slice(0, 10));
      } catch (error) {
        console.error("Kullanıcılar yüklenirken hata oluştu:", error);
      }
    };
    fetchUsers();
  }, []);

  const showWarning = (message: string) => {
    setWarning(message);
    setTimeout(() => {
      setWarning('');
    }, 3000);
  };

  const handleSeatSelect = (seatNumber: number) => {
    if (occupiedSeats.includes(seatNumber)) {
      showWarning('* Bu koltuk dolu');
      return;
    }

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else if (selectedSeats.length < 3) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    } else {
      showWarning('* En fazla 3 koltuk seçebilirsiniz');
    }
  };

  return (
    <main className="flex min-h-screen p-8">
      {/* Sol taraf - Koltuk seçimi */}
      <div className="w-1/2 relative">
      {/* <Image
      src={Plane}
      alt="plane"
      width={1500}
      height={2000}
      className="absolute top-0 "/> */}

      <div 
          className="absolute inset-0 -z-10 bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${Plane.src})` }}
        />
        <div className="airplane-outline px-20 py-10">
          <div className="grid grid-cols-4 gap-1 max-w-[150px] mx-auto">
            {[...Array(90)].map((_, index) => {
              const seatNumber = index + 1;
              const isOccupied = occupiedSeats.includes(seatNumber);
              const passenger = passengers.find(p => p.id === seatNumber);
              
              return (
                <div className="relative" key={index}>
                  <button
                    onClick={() => handleSeatSelect(seatNumber)}
                    className={`w-8 h-10 border rounded-md flex items-center justify-center text-sm
                      ${isOccupied ? 'bg-gray-300 cursor-not-allowed group' : 
                        selectedSeats.includes(seatNumber) ? 'bg-[#fcc75b]' : 'bg-white hover:bg-gray-100'}
                      transition-colors`}
                  >
                    {seatNumber}
                    {isOccupied && passenger && (
                      <div className="absolute invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 -top-8 left-1/2 -translate-x-1/2 w-max">
                        {passenger.name}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-8 flex gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-5 bg-white border rounded-md"></div>
            <span>Boş</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-5 bg-[#fcc75b] rounded-md"></div>
            <span>Seçili</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-5 bg-[#e5e5e5] rounded-md"></div>
            <span>Dolu</span>
          </div>
        </div>
      </div>

      {/* Sağ taraf - Yolcu formu */}
      <div className="w-1/2 space-y-5">
        {[1, 2, 3].map((passengerNum) => (
          <div
            key={passengerNum}
            className="bg-[#d1d1d1] rounded-lg overflow-hidden "
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
        
        <button className="relative w-full bg-[#d1d1d1] p-4 rounded-lg font-medium">
          İşlemleri Tamamla

        {warning && (
          <p className="absolute -top-4 left-0 text-red-500 text-xs animate-fade-in-out">
            {warning}
          </p>
        )}
        </button>


        {selectedSeats.length > 0 && (
          <div className="bg-[#d1d1d1] p-8 rounded-lg mt-4 ">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {selectedSeats.map(seat => (
                  <span key={seat} className="bg-[#fcc75b] px-1 py-1.5 rounded border border-[#b9b3a9]">
                    {seat}
                  </span>
                ))}
              </div>
              <div className="text-right">
                <div className="flex justify-end items-center gap-1">
                <div>{selectedSeats.length}x</div>  <div className="w-4 h-5 bg-[#fcc75b] rounded-md border border-[#b9b3a9]"></div>
                </div>
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
