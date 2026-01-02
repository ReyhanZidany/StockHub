import { ChevronRight } from "lucide-react";

export default function Table({ columns, data, renderAction }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${
                    col.align === "right" ? "text-right" : 
                    col.align === "center" ? "text-center" : "text-left"
                  }`}
                >
                  {col.label}
                </th>
              ))}
              {renderAction && (
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.map((row, index) => (
              <tr 
                key={row.id || index} 
                className="hover:bg-slate-50/80 transition-colors duration-150"
              >
                {columns.map((col) => (
                  <td 
                    key={col.key} 
                    className={`px-6 py-4 whitespace-nowrap text-slate-700 ${
                      col.align === "right" ? "text-right" : 
                      col.align === "center" ? "text-center" : "text-left"
                    }`}
                  >
                    {col.render ? col.render(row[col.key], row) : (
                       col.key === "price" 
                        ? `Rp ${Number(row[col.key]).toLocaleString("id-ID")}`
                        : row[col.key]
                    )}
                  </td>
                ))}

                {renderAction && (
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {renderAction(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}