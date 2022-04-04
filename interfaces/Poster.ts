export interface Waste {
  waste_id: string
  reason_name?: string
  total_sum: string
}

export interface SalesData {
  data: string[]
}

export interface IngredientMovementVM {
  ingredient_id: string
  ingredient_name: string
  start: number
  end: number
  cost_start: number
  cost_end: number
  income: number
  write_offs: number
}

export interface IngredientCategory {
  category_id: string
  name: string
}

export interface Ingredient {
  ingredient_id: number
  category_id: number
  supplier: string
  last_supply: string
}

export interface Supply {
  supply_id: string
  supplier_name: string
}

export interface SupplyIngredient {
  ingredient_id: number
  supply_ingredient_num: number
}

export interface WriteOff {
  elements: WriteOffElements[]
}

interface WriteOffElements {
  ingredients: WriteOffIngredient[]
}

export interface WriteOffIngredient {
  ingredient_id: string
  cost: string
  weight: number
}