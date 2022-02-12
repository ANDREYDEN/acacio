import { NextPage } from 'next'
import { useMemo } from 'react'
import { posterInstance } from '../lib/posterService'
import { useSortBy, useTable } from 'react-table'

export async function getServerSideProps() {
  try {
    const { data } = await posterInstance.get('storage.getReportMovement')
    if (data.error) throw data.error
    const ingredients = data.response
    return {
      props: {
        ingredients
      }
    }
  } catch(e: any) {
    return { 
      props:
      {
        ingredients: [],
        error: e.toString()
      }
    }
  }  
}

type Ingredient = {
  ingredient_id: string,
  ingredient_name: string,
  start: number,
  end: number
}

type IngredientsMovementsProps = {
  ingredients: Ingredient[],
  error: string | null
}

const IngredientsMovements: NextPage<IngredientsMovementsProps> = ({ ingredients, error }) => {
  const columns = useMemo(
    () => Object.keys(ingredients[0]).map((key, i) => ({
      Header: key.split('_').map(word => word[0].toUpperCase() + word.substring(1)).join(' '),
      accessor: key
    })),
    [ingredients]
  )

  const data = useMemo(
    () => ingredients, 
    [ingredients]
  )

  const {
    getTableProps,
    getTableBodyProps,
    headers,
    rows,
    prepareRow,
  } = useTable<Ingredient>(
    {
      columns,
      data
    },
    useSortBy
  )

  if (error) {
    return (<div>{error}</div>)
  }

  return (
    <div>
      <table {...getTableProps()} className='table-auto'>
        <thead>
          {headers.map((header, i) => (
            <tr key={i}>
              <th {...header.getHeaderProps()}>
                {header.render('Header')}
              </th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default IngredientsMovements