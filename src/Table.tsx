import {ReactNode, useEffect, useState} from 'react'

export const Table = ({
  data,
  columns,
  defaultLimit = 25
}: {
  defaultLimit?: number
  data: any[]
  columns: {
    id: string
    title: ReactNode
    render: (_: any) => any
  }[]
}) => {
  const [searchedId, setSearchedId] = useState<string | undefined>()
  const [innerData, setInnerData] = useState(data)
  const [inputValue, setInputValue] = useState('')
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [sortedColumn, setSortedColumn] = useState<string | undefined>()
  const [limit, setLimit] = useState<number>(defaultLimit)

  useEffect(() => {
    setInnerData(data)
  }, [data])

  return (
    <div>
      {defaultLimit && ![10, 25, 50, 100, 250, 500, 1000, 2000].includes(defaultLimit) && (
        <span style={{color: 'red'}}>Invalid limit value {defaultLimit}</span>
      )}
      <div>
        <input value={searchedId} onChange={e => setSearchedId(e.target.value)}/>
        <button>Search</button>
      </div>
      <div>
        <input value={inputValue} onChange={e => setInputValue(e.target.value)}/>
        <button onClick={() => setInnerData(innerData.map(d => {
          if (selectedRows.includes(d.id)) {
            selectedColumns.forEach(c => {
              d[c] = inputValue
            })
          }
          return d
        }))}>
          Edit&nbsp;
          {data.filter(_ => selectedRows.includes(_.id)).splice(0, 3).map(r => selectedColumns.map(c => r[c]).join(', ')).join(', ')}
        </button>
        <button>Undo last</button>
      </div>
      <div>
        Sort by:
        <select value={sortedColumn} onChange={e => setSortedColumn(e.target.value)}>
          {columns.map(_ =>
            <option value={_.id} key={_.id}>{_.title}</option>
          )}
        </select>
      </div>
      <div>
        Limit displayed:
        <select value={limit} onChange={e => setLimit(+e.target.value)}>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={250}>250</option>
          <option value={500}>500</option>
          <option value={1000}>100</option>
          <option value={2000}>2000</option>
        </select>
      </div>
      <br/>
      <table border={1}>
        <thead>
        <tr>
          <th></th>
          {columns.map(_ =>
            <th key={_.id}>
              <input
                type="checkbox"
                checked={selectedColumns.includes(_.id)}
                onChange={e => setSelectedColumns([...selectedColumns, _.id])}
              />
              {_.title}
            </th>
          )}
        </tr>
        </thead>
        <tbody>
        {innerData
          .slice(0, limit)
          .sort((a, b) => {
            if (!sortedColumn) return 0
            return (a as any)[sortedColumn].localeCompare((b as any)[sortedColumn])
          })
          .filter(_ => !searchedId || _.id === +searchedId)
          .map(d =>
            <tr key={d.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(d.id)}
                  onChange={e => setSelectedRows([...selectedRows, d.id])}
                />
              </td>
              {columns.map(_ =>
                <td key={_.id}>{_.render(d)}</td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}