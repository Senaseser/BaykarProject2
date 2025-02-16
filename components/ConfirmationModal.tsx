'use client';

interface ConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal = ({ onConfirm, onCancel }: ConfirmationModalProps) => (
  <>
    <div className="fixed inset-0 bg-black/50 z-40" />
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">
          İşleme devam etmek istiyor musunuz?
        </h3>
        <div className="flex justify-end gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#fcc75b] rounded"
          >
            Devam Et
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  </>
); 