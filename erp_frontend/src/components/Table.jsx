export default function Table({ columns, data, renderAction }) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-left">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium">
                {col.label}
              </th>
            ))}
            {renderAction && <th className="px-4 py-3">Action</th>}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-t hover:bg-slate-50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  {col.key === "price"
                    ? Number(row[col.key]).toLocaleString("id-ID")
                    : row[col.key]}
                </td>
              ))}

              {renderAction && (
                <td className="px-4 py-3">
                  {renderAction(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
