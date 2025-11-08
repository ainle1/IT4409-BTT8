import { useState } from 'react'
import './App.css'
import SearchForm from './SearchForm'
import AddUser from './AddUser'
import ResultTable from './ResultTable'

function App() {
	const [kw, setKeyword] = useState('')
	const [newUser, setNewUser] = useState(null)

	return (
		<div className="App" style={{ padding: 16 }}>
			<h1>Quản lý người dùng</h1>
			<SearchForm onChangeValue={setKeyword} />
			<AddUser onAdd={setNewUser} />
			<ResultTable keyword={kw} user={newUser} onAdded={() => setNewUser(null)} />
		</div>
	)
}

export default App