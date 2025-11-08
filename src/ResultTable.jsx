import { useEffect, useState } from 'react'

// Component: hiển thị danh sách người dùng
// - fetch dữ liệu ban đầu từ API
// - khi có `user` mới (prop), gán id theo next sequential và append vào list
export default function ResultTable({ keyword = '', user = null, onAdded = () => {} }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)

  // Fetch on mount
  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => {
        if (!res.ok) throw new Error('Network error')
        return res.json()
      })
      .then((data) => {
        if (!mounted) return
        setUsers(data)
        setLoading(false)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message || 'Error')
        setLoading(false)
      })
    return () => (mounted = false)
  }, [])

  // Khi parent truyền `user` mới vào prop: tính id tiếp theo và thêm vào cuối danh sách
  useEffect(() => {
    if (user) {
      setUsers((prev) => {
        const maxId = prev.reduce((m, u) => {
          const n = Number(u?.id) || 0
          return Math.max(m, n)
        }, 0)
        const nextId = maxId + 1
        const toAdd = { ...user, id: nextId }
        return [...prev, toAdd]
      })
      // báo parent đã xử lý xong (reset newUser)
      onAdded()
    }
  }, [user, onAdded])

  const lowerKw = (keyword || '').toLowerCase()
  const filteredUsers = users.filter((u) => {
    return (
      u.name?.toLowerCase().includes(lowerKw) ||
      u.username?.toLowerCase().includes(lowerKw)
    )
  })

  function editUser(u) {
    // deep copy để chỉnh sửa (không mutate trực tiếp trong list)
    setEditing({ ...u, address: { ...(u.address || {}) } })
  }

  function handleEditChange(field, value) {
    if (!editing) return
    if (['street', 'suite', 'city'].includes(field)) {
      setEditing((prev) => ({ ...prev, address: { ...prev.address, [field]: value } }))
    } else {
      setEditing((prev) => ({ ...prev, [field]: value }))
    }
  }

  function saveUser() {
    // Lưu thay đổi: tìm theo id và thay thế
    setUsers((prev) => prev.map((u) => (u.id === editing.id ? editing : u)))
    setEditing(null)
  }

  function removeUser(id) {
    // Xóa theo id
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  if (loading) return <div>Đang tải dữ liệu...</div>
  if (error) return <div style={{ color: 'red' }}>Lỗi: {error}</div>

  return (
    <div>
      {editing && (
        <div style={{ border: '1px solid #ccc', padding: 8, marginBottom: 12, maxWidth: 640 }}>
          <h4>Chỉnh sửa người dùng</h4>
          <div>
            <label>Name: </label>
            <input value={editing.name} onChange={(e) => handleEditChange('name', e.target.value)} />
          </div>
          <div>
            <label>Username: </label>
            <input value={editing.username} onChange={(e) => handleEditChange('username', e.target.value)} />
          </div>
          <div>
            <label>City: </label>
            <input value={editing.address?.city || ''} onChange={(e) => handleEditChange('city', e.target.value)} />
          </div>
          <div style={{ marginTop: 8 }}>
            <button onClick={saveUser}>Lưu</button>{' '}
            <button onClick={() => setEditing(null)}>Hủy</button>
          </div>
        </div>
      )}

      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.address?.city}</td>
              <td>
                <button onClick={() => editUser(u)}>Sửa</button>{' '}
                <button onClick={() => removeUser(u.id)}>Xóa</button>
              </td>
            </tr>
          ))}
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                Không tìm thấy người dùng phù hợp.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
