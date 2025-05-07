const PromotionModal = ({ onClose, children }) => {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]"
        onClick={() => onClose(false)}
      >
        <div
          // 4) stopPropagation so clicks inside the white box don't bubble up
          className="relative w-1/3 rounded bg-white p-6 shadow-lg"
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
            onClick={() => onClose(false)}
          >
            ✕
          </button>
          <h1 className="text-xl font-semibold mb-4">Promotion (Bundle/BOGO)</h1>
            {children}
        </div>
      </div>
    );
  }
  
  export default PromotionModal;