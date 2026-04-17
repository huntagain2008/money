import { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext()

const PRESET_EXPENSE_CATEGORIES = [
  { id: 'food', name: '食物', color: '#f97316', type: 'expense', isPreset: true },
  { id: 'transport', name: '交通', color: '#3b82f6', type: 'expense', isPreset: true },
  { id: 'entertainment', name: '娱乐', color: '#a855f7', type: 'expense', isPreset: true },
  { id: 'medical', name: '医疗', color: '#ef4444', type: 'expense', isPreset: true },
  { id: 'education', name: '教育', color: '#8b5cf6', type: 'expense', isPreset: true },
  { id: 'shopping', name: '购物', color: '#ec4899', type: 'expense', isPreset: true },
  { id: 'housing', name: '居住', color: '#14b8a6', type: 'expense', isPreset: true },
  { id: 'other-expense', name: '其他', color: '#6b7280', type: 'expense', isPreset: true },
]

const PRESET_INCOME_CATEGORIES = [
  { id: 'salary', name: '工作收入', color: '#22c55e', type: 'income', isPreset: true },
  { id: 'investment', name: '投资收入', color: '#10b981', type: 'income', isPreset: true },
  { id: 'bonus', name: '奖金', color: '#84cc16', type: 'income', isPreset: true },
  { id: 'other-income', name: '其他收入', color: '#6b7280', type: 'income', isPreset: true },
]

const initialCategories = [...PRESET_EXPENSE_CATEGORIES, ...PRESET_INCOME_CATEGORIES]

const initialState = {
  records: [],
  categories: initialCategories,
  theme: 'light',
  activeTab: 'records',
  isLoading: true,
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        records: action.payload.records || [],
        categories: action.payload.categories || initialCategories,
        theme: action.payload.theme || 'light',
        isLoading: false,
      }
    case 'ADD_RECORD':
      return { ...state, records: [action.payload, ...state.records] }
    case 'UPDATE_RECORD':
      return {
        ...state,
        records: state.records.map(r =>
          r.id === action.payload.id ? action.payload : r
        ),
      }
    case 'DELETE_RECORD':
      return {
        ...state,
        records: state.records.filter(r => r.id !== action.payload),
      }
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] }
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload),
      }
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'SET_TAB':
      return { ...state, activeTab: action.payload }
    case 'IMPORT_RECORDS':
      return { ...state, records: action.payload }
    case 'SET_RECORDS':
      return { ...state, records: action.payload }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const savedRecords = localStorage.getItem('family_ledger_records')
    const savedCategories = localStorage.getItem('family_ledger_categories')
    const savedTheme = localStorage.getItem('family_ledger_theme')

    dispatch({
      type: 'LOAD_DATA',
      payload: {
        records: savedRecords ? JSON.parse(savedRecords) : [],
        categories: savedCategories ? JSON.parse(savedCategories) : initialCategories,
        theme: savedTheme || 'light',
      },
    })
  }, [])

  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('family_ledger_records', JSON.stringify(state.records))
    }
  }, [state.records, state.isLoading])

  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('family_ledger_categories', JSON.stringify(state.categories))
    }
  }, [state.categories, state.isLoading])

  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('family_ledger_theme', state.theme)
      document.documentElement.setAttribute('data-theme', state.theme)
    }
  }, [state.theme, state.isLoading])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
