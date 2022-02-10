import { GetServerSideProps, NextPage } from 'next'
import { posterInstance } from '../lib/posterService'

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
      ingredients: [],
      error: e.toString()
    }
  }  
}

type IngredientsMovementsProps = {
  ingredients: any[],
  error: string | null
}

const IngredientsMovements: NextPage<IngredientsMovementsProps> = ({ ingredients, error }) => {
  if (error) {
    return (<div>{error}</div>)
  }
  return (
    <div>
      <table className='table-auto'>
        <tr>
          <th>Name</th>
          <th>Start</th>
          <th>End</th>
        </tr>
        {
          ingredients.map((ingredient: any) => {
            return (
              <tr key={ingredient.ingredient_id}>
                <td>{ingredient.ingredient_name}</td>
                <td>{ingredient.start}</td>
                <td>{ingredient.end}</td>
              </tr>
            )
          })
        }
        <tr>
        </tr>
      </table>
    </div>
  )
}

export default IngredientsMovements