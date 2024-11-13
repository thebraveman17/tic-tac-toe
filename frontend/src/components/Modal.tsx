import React from 'react';

export default function Modal({show, closeModal, message, children}: {show: boolean, closeModal: () => void, message: string, children: React.ReactNode}) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div
        className="relative bg-white rounded-lg p-6 w-80 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-1 right-3 text-gray-600 text-lg"
          onClick={closeModal}
        > 
          &times;
        </button>

        <div>
          {children}
        </div>
      </div>
    </div>
  );
}