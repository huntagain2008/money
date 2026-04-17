import { useState } from 'react'
import { useApp } from './context/AppContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import RecordList from './components/RecordList'
import RecordModal from './components/RecordModal'
import ConfirmDialog from './components/ConfirmDialog'
import CategoryManager from './components/CategoryManager'
import Statistics from './components/Statistics'
import SearchFilter from './components/SearchFilter'
import './App.css'

function App() {
  const { state, dispatch } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [editRecord, setEditRecord] = useState(null)
  const [deleteRecord, setDeleteRecord] = useState(null)

  const handleAddRecord = () => {
    setEditRecord(null)
    setShowModal(true)
  }

  const handleEditRecord = (record) => {
    setEditRecord(record)
    setShowModal(true)
  }

  const handleDeleteRecord = (record) => {
    setDeleteRecord(record)
  }

  const confirmDelete = () => {
    if (deleteRecord) {
      dispatch({ type: 'DELETE_RECORD', payload: deleteRecord.id })
      setDeleteRecord(null)
    }
  }

  const renderContent = () => {
    switch (state.activeTab) {
      case 'records':
        return (
          <RecordList
            onAddRecord={handleAddRecord}
            onEditRecord={handleEditRecord}
            onDeleteRecord={handleDeleteRecord}
          />
        )
      case 'categories':
        return <CategoryManager />
      case 'statistics':
        return <Statistics />
      case 'search':
        return <SearchFilter />
      default:
        return null
    }
  }

  if (state.isLoading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <span>加载中...</span>
      </div>
    )
  }

  return (
    <div className="app">
      <Header />
      <div className="main">
        <Sidebar />
        <main className="content">
          {renderContent()}
        </main>
      </div>

      <RecordModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editRecord={editRecord}
      />

      <ConfirmDialog
        isOpen={!!deleteRecord}
        title="确认删除"
        message={`确定要删除这条${deleteRecord?.type === 'income' ? '收入' : '支出'}记录吗？此操作无法撤销。`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteRecord(null)}
      />
    </div>
  )
}

export default App
