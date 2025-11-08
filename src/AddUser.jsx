import { useState } from 'react'

// Component: form để thêm người dùng mới
// - Thu thập input từ user
// - Gọi `onAdd(newUser)` mà không gán id (id sẽ do list quản lý gán)
export default function AddUser({ onAdd }) {
  const [adding, setAdding] = useState(false)
  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
    address: { street: '', suite: '', city: '' },
    phone: '',
    website: '',
  })

  // Cập nhật state khi input thay đổi
  const handleChange = (e) => {
    const { id, value } = e.target
    if (['street', 'suite', 'city'].includes(id)) {
      setUser((prev) => ({ ...prev, address: { ...prev.address, [id]: value } }))
    } else {
      setUser((prev) => ({ ...prev, [id]: value }))
    }
  }

  // Validate và gửi dữ liệu lên parent
  // Lưu ý: không gán id ở đây để tránh xung đột id; ResultTable sẽ gán id an toàn
  const handleAdd = () => {
    if (!user.name.trim() || !user.username.trim()) {
      alert('Vui lòng nhập Name và Username!')
      return
    }
    const newUser = { ...user }
    onAdd(newUser)
    // reset form
    setUser({ name: '', username: '', email: '', address: { street: '', suite: '', city: '' }, phone: '', website: '' })
    setAdding(false)
  }

  return (
    <div style={{ margin: '12px 0' }}>
      <button onClick={() => setAdding(true)}>Thêm</button>
      {adding && (
        <div style={{ marginTop: 8, border: '1px solid #ccc', padding: 8, maxWidth: 520 }}>
          <h4>Thêm người dùng</h4>
          <div>
            <label>Name: </label>
            <input id="name" value={user.name} onChange={handleChange} />
          </div>
          <div>
            <label>Username: </label>
            <input id="username" value={user.username} onChange={handleChange} />
          </div>
          <div>
            <label>Email: </label>
            <input id="email" value={user.email} onChange={handleChange} />
          </div>
          <div>
            <label>City: </label>
            <input id="city" value={user.address.city} onChange={handleChange} />
          </div>
          <div style={{ marginTop: 8 }}>
            <button onClick={handleAdd}>Lưu</button>{' '}
            <button onClick={() => setAdding(false)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  )
}
