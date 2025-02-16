"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PassengerType } from "@/types/Passenger";
import { ConfirmationModal } from "@/components/ConfirmationModal";

const BASE_URL = "https://jsonplaceholder.typicode.com/users";


export default function Home() {
        const initialSelectedSeats = typeof window !== 'undefined' 
          ? JSON.parse(localStorage.getItem('selectedSeats') || '[]') 
          : [];
        const initialPassengers = typeof window !== 'undefined' 
          ? JSON.parse(localStorage.getItem('passengers') || '[]') 
          : [];
        const [selectedSeats, setSelectedSeats] = useState<number[]>(initialSelectedSeats);
        const [activePassenger, setActivePassenger] = useState(1);
        const [passengers, setPassengers] = useState<PassengerType[]>(initialPassengers);
        const [warning, setWarning] = useState<string>('');
        const [successMessage, setSuccessMessage] = useState<string>('');
        const [showConfirmation, setShowConfirmation] = useState(false);
      
        useEffect(() => {
         // localStorage.removeItem('selectedSeats');
         // localStorage.removeItem('passengers');
          const savedSeats = localStorage.getItem('selectedSeats');
          const savedPassengers = localStorage.getItem('passengers');
      
          if (savedSeats) {
            try {
              const seats = JSON.parse(savedSeats);
              setSelectedSeats(seats);
              if (seats.length > 0) {
                setActivePassenger(seats[0]);
              }
            } catch (error) {
              console.error('Error parsing savedSeats:', error);
              setSelectedSeats([]);
            }
          }
          if (savedPassengers) {
            try {
              setPassengers(JSON.parse(savedPassengers));
            } catch (error) {
              console.error('Error parsing savedPassengers:', error);
              setPassengers([]);
            }
          }
          
        }, []);
      
        useEffect(() => {
          localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
          localStorage.setItem('passengers', JSON.stringify(passengers));
        }, [selectedSeats, passengers]);
      
        const occupiedSeats = passengers.map(passenger => passenger.id).filter(Boolean);
      
        const timerRef = useRef<NodeJS.Timeout | null>(null);
        const lastActionRef = useRef<number>(0);
      
      
        const startInactivityTimer = () => {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
          
          lastActionRef.current = Date.now();
          
          timerRef.current = setTimeout(() => {
            const timeSinceLastAction = Date.now() - lastActionRef.current;
            if (timeSinceLastAction >= 30000) { 
              setShowConfirmation(true);
            }
          }, 30000);
        };
      
        useEffect(() => {
          if (selectedSeats.length > 0) {
            startInactivityTimer();
          }
          return () => {
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
          };
        }, [selectedSeats, passengers, activePassenger]);
      
        const fetchUsers = useCallback(async () => {
          try {
            const response = await fetch(BASE_URL);
            const data: Array<{
              id: number;
              name: string;
              phone: string;
              email: string;
            }> = await response.json();
            
            const passengersWithSeats = data.slice(0, 10).map((user, index) => ({
              id: index + 1,
              name: user.name,
              surname: user.name,
              phoneNumber: user.phone,
              gender: "" as const,
              birthday: new Date().toISOString(),
              seatNumber: index + 1,
              email: user.email
            }));
            setPassengers(passengersWithSeats);
          } catch (error) {
            console.error("Kullanıcılar yüklenirken hata oluştu:", error);
          }
        }, []);
      
        useEffect(() => {
          fetchUsers();
        }, [fetchUsers]);
      
        const showWarning = (message: string) => {
          setWarning(message);
          setTimeout(() => {
            setWarning('');
          }, 3000);
        };
      
        const showSuccess = (message: string) => {
          setSuccessMessage(message);
          setTimeout(() => {
            setSuccessMessage('');
            setSelectedSeats([]);
            setActivePassenger(1);
          }, 3000);
        };
      
        const handleSeatSelect = (seatNumber: number) => {
          startInactivityTimer(); 
          if (occupiedSeats.includes(seatNumber)) {
            showWarning('* Bu koltuk dolu');
            return;
          }
      
          if (selectedSeats.includes(seatNumber)) {
            const newSeats = selectedSeats.filter(seat => seat !== seatNumber);
            setSelectedSeats(newSeats);
          } else if (selectedSeats.length < 3) {
            setSelectedSeats([...selectedSeats, seatNumber]);
          } else {
            showWarning('* En fazla 3 koltuk seçebilirsiniz');
          }
        };
      
        const isValidEmail = (email: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        };
      
        const isValidPhone = (phone: string) => {
          const phoneRegex = /^(?:\+90|0)?([5]{1}[0-9]{9})$/;
          return phoneRegex.test(phone);
        };
      
        const handlePassengerUpdate = (seatNumber: number, field: keyof PassengerType, value: string) => {
          const updatedPassengers = [...passengers];
          const passengerIndex = updatedPassengers.findIndex(p => p.id === seatNumber);
          
          if (passengerIndex !== -1) {
            updatedPassengers[passengerIndex] = {
              ...updatedPassengers[passengerIndex],
              [field]: value
            };
            setPassengers(updatedPassengers);
          } else {
            const newPassenger: PassengerType = {
              id: seatNumber,
              name: '',
              surname: '',
              phoneNumber: '',
              email: '',
              gender: '',
              birthday: '',
              [field]: value
            };
            setPassengers([...passengers, newPassenger]);
          }
        };
      
        const isFormValid = (passenger: PassengerType) => {
          return (
            passenger.name.trim() !== '' &&
            passenger.surname.trim() !== '' &&
            passenger.phoneNumber.trim() !== '' &&
            passenger.email.trim() !== '' &&
            passenger.gender !== ("" as const) &&
            passenger.birthday !== ''
          );
        };
      
        const handleNextPassenger = () => {
          let currentPassenger = passengers.find(p => p.id === activePassenger);
          
          console.log('Current Passenger:', currentPassenger);
          console.log('Selected Seats:', selectedSeats);
          console.log('Active Passenger:', activePassenger);
          console.log('Seat Number:', activePassenger);
          
          if (!currentPassenger) {
            currentPassenger = {
              id: activePassenger,
              name: '',
              surname: '',
              phoneNumber: '',
              email: '',
              gender: '',
              birthday: '',
            };
            setPassengers([...passengers, currentPassenger]);
            showWarning('* Lütfen tüm alanları doldurun');
            return;
          }
      
          const checks = {
            name: Boolean(currentPassenger.name?.trim()),
            surname: Boolean(currentPassenger.surname?.trim()),
            gender: currentPassenger.gender === 'female' || currentPassenger.gender === 'male',
            birthday: Boolean(currentPassenger.birthday),
            phone: Boolean(currentPassenger.phoneNumber?.trim()),
            email: Boolean(currentPassenger.email?.trim())
          };
      
          console.log('Field checks:', checks);
      
          if (Object.values(checks).some(check => check === false)) {
            showWarning('* Lütfen tüm alanları doldurun');
            return;
          }
      
          if (!isValidPhone(currentPassenger.phoneNumber)) {
            showWarning('* Geçerli bir telefon numarası giriniz');
            return;
          }
      
          if (!isValidEmail(currentPassenger.email)) {
            showWarning('* Geçerli bir email adresi giriniz');
            return;
          }
      
          const currentIndex = selectedSeats.indexOf(activePassenger);
          if (currentIndex < selectedSeats.length - 1) {
            setActivePassenger(selectedSeats[currentIndex + 1]);
          }
        };
      
        const handleConfirmationInactivity = () => {
          const inactivityTimeout = setTimeout(() => {
            setSelectedSeats([]);
            setActivePassenger(1);
            setPassengers([]);
            setShowConfirmation(false);
            window.location.reload();
          },30000); 
      
          return () => clearTimeout(inactivityTimeout);
        };
      
        useEffect(() => {
          if (selectedSeats.length > 0) {
            setActivePassenger(selectedSeats[0]);
          } else {
            setActivePassenger(1);
          }
        }, [selectedSeats]);
      
        useEffect(() => {
          const savedSeats = localStorage.getItem('selectedSeats');
          const savedPassengers = localStorage.getItem('passengers');
      
          if (savedSeats) {
            try {
              const seats = JSON.parse(savedSeats);
              setSelectedSeats(seats);
              if (seats.length > 0) {
                setActivePassenger(seats[0]);
              }
            } catch (error) {
              console.error('Error parsing savedSeats:', error);
              setSelectedSeats([]);
            }
          }
          if (savedPassengers) {
            try {
              setPassengers(JSON.parse(savedPassengers));
            } catch (error) {
              console.error('Error parsing savedPassengers:', error);
              setPassengers([]);
            }
          }
        }, []);
      
        return (
          <main className="flex min-h-screen p-8">
            <div className="w-1/2 relative">
              <div className="airplane-outline px-20 py-10">
                <div className="grid grid-cols-4 gap-0.5 max-w-[150px] mx-auto">
                  {[...Array(90)].map((_, index) => {
                    const seatNumber = index + 1;
                    const isOccupied = occupiedSeats.includes(seatNumber) && !selectedSeats.includes(seatNumber);
                    const passenger = passengers.find(p => p.id === seatNumber);
                    
                    const extraClass = seatNumber % 4 === 2 
                      ? 'mr-12 after:content-[""] after:absolute after:right-[-31px] after:top-0 after:h-full after:w-[1px] after:bg-gray-300' 
                      : '';
                    
                    return (
                      <div className={`relative ${extraClass}`} key={index}>
                        <button
                          onClick={() => handleSeatSelect(seatNumber)}
                          className={`w-6 h-8 border rounded-md flex items-center justify-center text-sm
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
                  <div className="w-4 h-5 bg-[#fcc75b] border rounded-md"></div>
                  <span>Seçili</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-5 bg-[#e5e5e5] border rounded-md"></div>
                  <span>Dolu</span>
                </div>
              </div>
            </div>
      
            <div className="w-1/2 space-y-5 mt-10">
              {selectedSeats.map((seatNumber, index) => (
                <div
                  key={seatNumber}
                  className="bg-[#d1d1d1] rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => {
                      const currentIndex = selectedSeats.indexOf(seatNumber);
                      
                      for (let i = 0; i < currentIndex; i++) {
                        const prevSeat = selectedSeats[i];
                        const prevPassenger = passengers.find(p => p.id === prevSeat);
                        
                        if (!prevPassenger || !isFormValid(prevPassenger)) {
                          showWarning(`* Lütfen ${i + 1}. yolcu bilgilerini tamamlayın`);
                          setActivePassenger(prevSeat);
                          return;
                        }
                      }
                      
                      setActivePassenger(seatNumber);
                    }}
                    className="w-full p-4 text-left flex justify-between items-center "
                  >
                    <span>{index + 1}. Yolcu (Koltuk {seatNumber})</span>
                    <span className="transform transition-transform duration-200">
                      {activePassenger === seatNumber ? "▼" : "▶"}
                    </span>
                  </button>
                  
                  {activePassenger === seatNumber && (
                    <div className="p-4 bg-white">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1">İsim</label>
                          <input 
                            type="text" 
                            className="w-full border rounded p-2"
                            value={passengers.find(p => p.id === seatNumber)?.name || ''}
                            onChange={(e) => handlePassengerUpdate(seatNumber, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Soyisim</label>
                          <input 
                            type="text" 
                            className="w-full border rounded p-2"
                            value={passengers.find(p => p.id === seatNumber)?.surname || ''}
                            onChange={(e) => handlePassengerUpdate(seatNumber, 'surname', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Telefon</label>
                          <input 
                            type="tel" 
                            className={`w-full border rounded p-2 ${
                              passengers.find(p => p.id === seatNumber)?.phoneNumber 
                                ? isValidPhone(passengers.find(p => p.id === seatNumber)?.phoneNumber || '')
                                  ? 'border-gray-300'
                                  : 'border-red-500 border-2'
                                : 'border-gray-300'
                            }`}
                            placeholder="5xxxxxxxxx"
                            value={passengers.find(p => p.id === seatNumber)?.phoneNumber || ''}
                            onChange={(e) => handlePassengerUpdate(seatNumber, 'phoneNumber', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">E-Posta</label>
                          <input 
                            type="email" 
                            className={`w-full border rounded p-2 ${
                              passengers.find(p => p.id === seatNumber)?.email
                                ? isValidEmail(passengers.find(p => p.id === seatNumber)?.email || '')
                                  ? 'border-gray-300'
                                  : 'border-red-500 border-2'
                                : 'border-gray-300'
                            }`}
                            placeholder="ornek@email.com"
                            value={passengers.find(p => p.id === seatNumber)?.email || ''}
                            onChange={(e) => handlePassengerUpdate(seatNumber, 'email', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Cinsiyet</label>
                          <select 
                            className="w-full border rounded p-2"
                            value={passengers.find(p => p.id === seatNumber)?.gender || ''}
                            onChange={(e) => handlePassengerUpdate(seatNumber, 'gender', e.target.value as "female" | "male")}
                          >
                            <option value="">Seçiniz</option>
                            <option value="female">Kadın</option>
                            <option value="male">Erkek</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Doğum Tarihi</label>
                          <input 
                            type="date" 
                            className="w-full border rounded p-2"
                            value={passengers.find(p => p.id === seatNumber)?.birthday || ''}
                            onChange={(e) => handlePassengerUpdate(seatNumber, 'birthday', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between">
                        {index > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePassenger(selectedSeats[index - 1]);
                            }}
                            className="px-4 py-2 bg-gray-200 rounded"
                          >
                            Önceki Yolcu
                          </button>
                        )}
                        {index < selectedSeats.length - 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNextPassenger();
                            }}
                            className="px-4 py-2 bg-[#fcc75b] rounded ml-auto"
                          >
                            Sonraki Yolcu
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
      
              {selectedSeats.length === 0 && (
                <div className="text-center p-4 bg-gray-100 rounded-lg">
                  Lütfen koltuk seçimi yapınız
                </div>
              )}
              
              <button 
                className="relative w-full bg-[#d1d1d1] p-4 rounded-lg font-medium"
                disabled={selectedSeats.length === 0}
                onClick={() => {
                  const allPassengersValid = selectedSeats.every(seat => {
                    const passenger = passengers.find(p => p.id === seat);
                    return passenger && isFormValid(passenger);
                  });
      
                  if (!allPassengersValid) {
                    showWarning('* Lütfen tüm yolcu bilgilerini tamamlayın');
                    return;
                  }
                  
                  showSuccess('✓ Rezervasyon işleminiz başarıyla tamamlanmıştır');
                }}
              >
                İşlemleri Tamamla
                {warning && (
                  <p className="absolute -top-4 left-0 text-red-500 text-xs animate-fade-in-out">
                    {warning}
                  </p>
                )}
                {successMessage && (
                  <p className="absolute -top-4 left-0 text-green-500 text-xs animate-fade-in-out">
                    {successMessage}
                  </p>
                )}
              </button>
      
              {selectedSeats.length > 0 && (
                <div className="bg-[#d1d1d1] p-8 rounded-lg mt-4 ">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {selectedSeats.map(seat => (
                        <span key={seat} className="bg-[#fcc75b] w-6 h-8 flex justify-center items-center rounded border border-[#b9b3a9]">
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
      
            {showConfirmation && (
              <ConfirmationModal 
                onConfirm={() => {
                  setShowConfirmation(false);
                  startInactivityTimer();
                }}
                onCancel={() => {
                  setSelectedSeats([]);
                  setActivePassenger(1);
                  setShowConfirmation(false);
                }}
                onMount={handleConfirmationInactivity}
              />
            )}
          </main>
        );
} 