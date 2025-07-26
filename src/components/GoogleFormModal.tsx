import React from 'react';

interface GoogleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formUrl: string;
}

const GoogleFormModal: React.FC<GoogleFormModalProps> = ({ isOpen, onClose, formUrl }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <iframe
          src={formUrl}
          width="100%"
          height="600"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title="Google Form"
          allow="camera; microphone; clipboard-write"
        >
          Loading…
        </iframe>
      </div>
    </div>
  );
};

export default GoogleFormModal;
