import React, { useState, useEffect } from 'react';
import './Table.css'; // Import the CSS file

type DataItem = Record<string, any>;

interface TableColumn<T extends DataItem> {
  id: keyof T;
  title: React.ReactNode;
  render: (item: T) => React.ReactNode;
}

interface TableProps<T extends DataItem> {
  data: T[];
  columns: TableColumn<T>[];
  defaultLimit?: number;
}

export const Table = <T extends DataItem>({ data, columns, defaultLimit = 25 }: TableProps<T>) => {
  const [searchedId, setSearchedId] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortedColumn, setSortedColumn] = useState<keyof T | undefined>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [limit, setLimit] = useState<number>(defaultLimit);
  const [searchError, setSearchError] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<keyof T | ''>('');

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = limit;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  useEffect(() => {
    setTotalPages(Math.ceil(data.length / pageSize));
    setPage(1); // Reset page when data changes
  }, [data, pageSize]);

  const handleSort = (columnId: keyof T) => {
    const newSortDirection = sortedColumn === columnId && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortedColumn(columnId);
    setSortDirection(newSortDirection);
  };

  const handleSearch = () => {
    if (!searchedId.trim()) {
      setSearchError('Please enter an ID');
      return;
    }
    const id = parseInt(searchedId);
    const item = data.find(item => item.id === id);
    if (!item) {
      setSearchError(`Please enter an ID from 1 to ${data.length}`);
      return;
    }
    // Update pagination
    setPage(Math.ceil((data.indexOf(item) + 1) / pageSize));
    setSearchError('');
  };

  const handleShowAllItems = () => {
    setLimit(data.length);
    setPage(1); // Reset page
    setSearchedId(''); // Clear the search box
  };

  const handleEdit = () => {
    // Handle edit
  };

  const handlePrevPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  return (
      <div className="table-container"> {/* Apply container class */}
        <div className="search-container">
          {/* Apply container class */}
          <input
              value={searchedId}
              onChange={(e) => setSearchedId(e.target.value)}
              placeholder={`Search by ID (1-${data.length})`}
              maxLength={String(data.length).length}
          />
          <button onClick={handleSearch}>Search</button>
          {searchError && <div style={{color: 'red'}}>{searchError}</div>}
        </div>
        <div className="edit-container">
          <input
              className="edit-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value to edit"
          />
          <select
              className="select-column"
              value={String(selectedColumn)}
              onChange={(e) => setSelectedColumn(e.target.value as keyof T)}
          >
            <option value="">Select column</option>
            {columns.map(col => (
                <option key={String(col.id)} value={String(col.id)}>
                  {col.title}
                </option>
            ))}
          </select>
          <button className="edit-button" onClick={handleEdit}>
            Edit
          </button>
        </div>
        <div className="sort-container"> {/* Apply container class */}
          <select value={String(sortedColumn)} onChange={(e) => handleSort(e.target.value as keyof T)}>
            <option value="">None</option>
            {columns.map(col =>
                <option key={String(col.id)} value={String(col.id)}>{col.title}</option>
            )}
          </select>
        </div>
        <div className="limit-container"> {/* Apply container class */}
          <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))}>
            {[10, 25, 50, 100, 250, 500, 1000, 2000].map(val => (
                <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
        <div className="show-all-container"> {/* Apply container class */}
          <button onClick={handleShowAllItems}>Show all items</button>
        </div>
        <table className="table"> {/* Apply table class */}
          <thead>
          <tr>
            <th></th>
            {columns.map(col =>
                <th key={String(col.id)} onClick={() => handleSort(col.id)}>
                  {col.title}
                  {sortedColumn === col.id && (
                      <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
            )}
          </tr>
          </thead>
          <tbody>
          {paginatedData.map(item =>
              <tr key={String(item.id)}>
                <td>
                  <input
                      type="checkbox"
                      checked={selectedRows.includes(String(item.id))}
                      onChange={() => {
                        if (selectedRows.includes(String(item.id))) {
                          setSelectedRows(selectedRows.filter(selectedRow => selectedRow !== String(item.id)));
                        } else {
                          setSelectedRows([...selectedRows, String(item.id)]);
                        }
                      }}
                  />
                </td>
                {columns.map(col =>
                    <td key={String(col.id)}>{col.render(item)}</td>
                )}
              </tr>
          )}
          </tbody>
        </table>
        <div className="pagination"> {/* Apply pagination class */}
          <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={page === totalPages}>Next</button>
        </div>
      </div>
  );
};
