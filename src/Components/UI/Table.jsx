import React from 'react';

const Table = ({
    headers,
    data,
    renderRow,
    className = '',
    loading = false,
    emptyMessage = "No data found."
}) => {
    return (
        <div className={`bg-surface rounded-3xl border border-foreground/5 overflow-hidden shadow-xl ${className}`}>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="border-b border-foreground/5 bg-foreground/5">
                            {headers.map((header, idx) => (
                                <th
                                    key={idx}
                                    className={`py-5 px-6 text-xs uppercase tracking-widest font-black text-foreground/40 ${header.className || ''}`}
                                >
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="relative">
                        {loading ? (
                            <tr>
                                <td colSpan={headers.length} className="py-20 text-center">
                                    <span className="loading loading-spinner loading-lg text-primary"></span>
                                </td>
                            </tr>
                        ) : data.length > 0 ? (
                            data.map((item, idx) => (
                                <React.Fragment key={item._id || idx}>
                                    {renderRow(item, idx)}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={headers.length} className="py-20 text-center text-foreground/40 font-medium italic">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
