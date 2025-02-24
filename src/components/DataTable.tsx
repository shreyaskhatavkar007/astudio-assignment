interface DataTableProps<T extends { [key: string]: any }> {
  data: T[];
  columns: { key: string; label: string }[];
  loading: boolean;
}

export default function DataTable<T extends { [key: string]: any }>({
  data,
  columns,
  loading,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto border border-grey bg-white max-h-[500px] min-h-[500px]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue text-black">
            {columns.map((col) => (
              <th
                key={col.key as string}
                className="p-3 text-left uppercase border-2 border-grey"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center">
                Loading...
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((item: T, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td
                    key={col.key as string}
                    className="p-3 border-t b-2 border-grey border-2 border-grey"
                  >
                    {item[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
