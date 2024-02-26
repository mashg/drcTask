import React, { useState, useEffect } from 'react';
import './Table.css';

type DataItem = {
  id: number;
  firstname: string;
  lastname: string;
  country: string;
};

interface TableColumn<T> {
  id: keyof T;
  title: React.ReactNode;
  render: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  defaultLimit?: number;
}

export const Table = <T extends DataItem>({ data, columns, defaultLimit = 10 }: TableProps<T>) => {
  const [searchedId, setSearchedId] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortedColumn, setSortedColumn] = useState<keyof T | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [limit, setLimit] = useState<number>(defaultLimit);
  const [searchError, setSearchError] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<keyof T | ''>('');
  const [page, setPage] = useState<number>(1);
  const [sortedData, setSortedData] = useState<T[]>([]);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  useEffect(() => {
    setSortedData([...data]);
  }, [data]);

  useEffect(() => {
    if (sortedColumn) {
      const sorted = [...sortedData].sort((a, b) => {
        const itemA = a[sortedColumn];
        const itemB = b[sortedColumn];

        let comparison = 0;
        if (typeof itemA === 'number' && typeof itemB === 'number') {
          comparison = itemA - itemB;
        } else if (typeof itemA === 'string' && typeof itemB === 'string') {
          comparison = itemA.localeCompare(itemB);
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });

      setSortedData(sorted);
    }
  }, [sortedColumn, sortDirection, data]);

  const totalPages = Math.ceil(sortedData.length / limit);

  const handleSearch = () => {
    setSearchError('');
    const idToSearch = Number(searchedId);
    if (!isNaN(idToSearch)) {
      const index = sortedData.findIndex((item) => item.id === idToSearch);
      if (index !== -1) {
        const newPage = Math.ceil((index + 1) / limit);
        setPage(newPage);
      } else {
        setSearchError(`No item found with ID: ${searchedId}`);
      }
    } else {
      setSearchError('Please enter a valid numeric ID.');
    }
  };

  const handleSort = (columnId: keyof T) => {
    if (columnId === sortedColumn) {
      setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortedColumn(columnId);
      setSortDirection('asc');
    }
  };

  const handleEdit = () => {
    if (selectedRow) {
      const updatedData = data.map((item) =>
          item.id === selectedRow.id ? { ...item, [selectedColumn]: inputValue } : item
      );
      setSortedData(updatedData);
      setSelectedRow(null);
      setInputValue('');
      setSelectedColumn('');
    } else {
      console.log('No row selected for editing');
    }
  };

  const startIndex = (page - 1) * limit;
  const paginatedData = sortedData.slice(startIndex, startIndex + limit);

  return (
      <div className="table-container">
        <div className="search-container">
          <input
              value={searchedId}
              onChange={(e) => setSearchedId(e.target.value)}
              placeholder="Search by ID"
          />
          <button onClick={handleSearch}>Search</button>
          {searchError && <div style={{ color: 'red' }}>{searchError}</div>}
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
            {columns.map((col) => (
                <option key={String(col.id)} value={String(col.id)}>
                  {col.title}
                </option>
            ))}
          </select>
          <button className="edit-button" onClick={handleEdit}>
            Edit
          </button>
        </div>

        <div className="sort-container">
          <select
              value={String(sortedColumn)}
              onChange={(e) => handleSort(e.target.value as keyof T)}
          >
            <option value="">Sort by</option>
            {columns.map((col) => (
                <option key={String(col.id)} value={String(col.id)}>
                  {col.title}
                </option>
            ))}
          </select>
        </div>

        <div className="limit-container">
          <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            {[10, 25, 50, 100].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
            ))}
          </select>
        </div>

        <table className="table">
          <thead>
          <tr>
            <th></th>
            {columns.map((col) => (
                <th key={String(col.id)} onClick={() => handleSort(col.id)}>
                  {col.title} {sortedColumn === col.id && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                </th>
            ))}
          </tr>
          </thead>
          <tbody>
          {paginatedData.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                      type="checkbox"
                      checked={selectedRow === item}
                      onChange={() => setSelectedRow(item)}
                  />
                </td>
                {columns.map((col) => (
                    <td key={String(col.id)}>{col.render(item)}</td>
                ))}
              </tr>
          ))}
          </tbody>
        </table>

        <div className="pagination">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
            Previous
          </button>
          <span>
          Page {page} of {totalPages}
        </span>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
            Next
          </button>
        </div>
      </div>
  );
};
