"use client";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-4 text-[#fcc75b]">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Rezervasyonunuz Başarıyla Gerçekleşmiştir
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Rezervasyon detaylarınız e-posta adresinize gönderilecektir.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-[#fcc75b] text-black px-4 py-2 rounded hover:bg-[#e5b552] transition-colors"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
} 