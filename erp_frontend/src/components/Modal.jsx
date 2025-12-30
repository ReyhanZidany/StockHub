// Tambahkan 'isOpen' di dalam kurung kurawal (props)
export default function Modal({ isOpen, title, onClose, children }) {
  
  // --- LOGIKA PENTING ---
  // Jika isOpen bernilai false, jangan tampilkan apa-apa (return null).
  if (!isOpen) return null;
  // ----------------------

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl transform transition-all scale-100">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">{title}</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}