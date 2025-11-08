function SearchForm({ onChangeValue }) {
	return (
		<div style={{ margin: '8px 0' }}>
			<input
				type="text"
				placeholder="Tìm theo name, username"
				onChange={(e) => onChangeValue(e.target.value)}
				style={{ padding: 8, width: '100%', maxWidth: 400 }}
			/>
		</div>
	)
}

export default SearchForm