export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded shadow">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">{title}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
