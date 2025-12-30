import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://lego-flip-api.onrender.com";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ set_number: '', buy_price: '', sell_price: '' });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
  if (token) {
    console.log("Raw token:", token);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("JWT payload:", payload);
      console.log("Extracted user ID:", payload.sub);
    } catch (e) {
      console.error("Invalid token", e);
    }
    fetchPosts();
  }
}, [token]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/posts`);
      setPosts(res.data.reverse()); // Newest first
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/posts`, {
        set_number: form.set_number,
        buy_price: parseFloat(form.buy_price),
        sell_price: form.sell_price ? parseFloat(form.sell_price) : null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ set_number: '', buy_price: '', sell_price: '' });
      setMessage('Flip added! 🧱💰');
      fetchPosts();
    } catch (err) {
      setMessage('Error adding flip');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this flip?')) return;
    try {
      await axios.delete(`${API_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
      setMessage('Flip deleted!');
    } catch (err) {
      console.error("Delete error details:", err);  // ← ADD THIS
      console.error("Response status:", err.response?.status);  // ← ADD THIS
      console.error("Response data:", err.response?.data);  // ← ADD THIS
      setMessage('Error deleting flip');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const ProfitBadge = ({ buy, sell }) => {
    if (!sell) return <span style={{ color: '#999', fontWeight: 'bold' }}>Holding</span>;
    const profit = sell - buy;
    const percent = ((profit / buy) * 100).toFixed(1);
    const color = profit >= 0 ? '#0b0' : '#e33';
    return <span style={{ color, fontWeight: 'bold', fontSize: '1.3em' }}>${profit.toFixed(2)} ({percent}%)</span>;
  };

  const currentUserId = token ? JSON.parse(atob(token.split('.')[1])).sub : null;

  if (!token) return <p style={{ textAlign: 'center', fontSize: '1.2em' }}>Please <a href="/login" style={{ color: '#06c' }}>login</a> to add flips.</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'right', marginBottom: '30px' }}>
        <button onClick={handleLogout}
                style={{
                  padding: '10px 20px',
                  background: '#c42',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'text-decoration 0.2s'
                }}
          onMouseOver={e => e.currentTarget.style.color = '#a00'}
          onMouseOut={e => e.currentTarget.style.color = 'white'}>
          Logout
        </button>
      </div>

      <h2 style={{ color: '#d42', textAlign: 'center', cursor: 'pointer', textDecoration: 'none', transition: 'text-decoration 0.2s' }}
          onMouseOver={e => e.currentTarget.style.color = '#a00'}
          onMouseOut={e => e.currentTarget.style.color = '#d42'}>➕ Add New Flip</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '12px', margin: '30px 0', alignItems: 'end' }}>
        <input
          placeholder="LEGO Set # (e.g. 10305)"
          value={form.set_number}
          onChange={e => setForm({ ...form, set_number: e.target.value })}
          required
          style={{ padding: '12px', fontSize: '1.1em' }}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Buy Price $"
          value={form.buy_price}
          onChange={e => setForm({ ...form, buy_price: e.target.value })}
          required
          style={{ padding: '12px', fontSize: '1.1em' }}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Sell Price $ (optional)"
          value={form.sell_price}
          onChange={e => setForm({ ...form, sell_price: e.target.value })}
          style={{ padding: '12px', fontSize: '1.1em' }}
        />
        <button
          type="submit"
          style={{
            padding: '12px 24px',
            background: '#06c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '1.1em',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'text-decoration 0.2s'
          }}
            onMouseOver={e => e.currentTarget.style.background = '#10c'}
            onMouseOut={e => e.currentTarget.style.background = '#06c'}        >
          Add
        </button>
      </form>
      {message && <p style={{ textAlign: 'center', color: 'green', fontWeight: 'bold', fontSize: '1.2em' }}>{message}</p>}

      <h2 style={{ color: '#d42', marginTop: '50px' }}>🏆 Community Flips ({posts.length})</h2>
      <div style={{ display: 'grid', gap: '20px' }}>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', gridColumn: '1 / -1', fontSize: '1.2em' }}>
            No flips yet — be the first to add one! 🧱
          </p>
        ) : (
          posts.map(post => (
            <div
              key={post.id}
              style={{ border: '2px solid #eee', borderRadius: '12px', padding: '20px', background: '#fafafa', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 20px rgba(0,0,0,0.1)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.6em', color: '#d42' }}>
                    LEGO {post.set_number}
                  </h3>
                  <p style={{ margin: '0 0 12px 0', color: '#555' }}>by <strong>{post.username}</strong></p>
                </div>
                <div style={{ minWidth: '120px', display: 'flex', justifyContent: 'flex-end' }}>
                  {post.user_id == currentUserId && (
                    <button
                      onClick={() => handleDelete(post.id)}
                      style={{
                        background: '#c00',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = '#a00'}
                      onMouseOut={e => e.currentTarget.style.background = '#c00'}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <div style={{ fontSize: '1.2em', margin: '15px 0' }}>
                Bought for <strong>${parseFloat(post.buy_price).toFixed(2)}</strong>
                {post.sell_price && <> → Sold for <strong>${parseFloat(post.sell_price).toFixed(2)}</strong></>}
              </div>
              <div style={{ fontSize: '1.5em' }}>
                Profit: <ProfitBadge buy={post.buy_price} sell={post.sell_price} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Posts;