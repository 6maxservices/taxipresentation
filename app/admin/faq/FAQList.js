'use client';
import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, GripVertical } from 'lucide-react';
import { saveFAQ, deleteFAQ } from './actions';

export default function FAQList({ initialFaqs }) {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [tempFaq, setTempFaq] = useState({ question: '', answer: '' });

  const handleSave = async (id = null) => {
    const payload = id ? { ...faqs.find(f => f.id === id), ...tempFaq } : tempFaq;
    
    if (!payload.question || !payload.answer) return alert('Both question and answer are required');

    const result = await saveFAQ(payload);
    if (result.success) {
      if (id) {
        setFaqs(faqs.map(f => f.id === id ? result.faq : f));
        setEditingId(null);
      } else {
        setFaqs([...faqs, result.faq]);
        setIsAdding(false);
      }
      setTempFaq({ question: '', answer: '' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    const result = await deleteFAQ(id);
    if (result.success) {
      setFaqs(faqs.filter(f => f.id !== id));
    }
  };

  const startEditing = (faq) => {
    setEditingId(faq.id);
    setTempFaq({ question: faq.question, answer: faq.answer });
  };

  return (
    <div className="admin-faq-list">
      <div style={{ marginBottom: '2rem' }}>
        {!isAdding ? (
          <button onClick={() => setIsAdding(true)} className="btn btn-primary">
            <Plus size={18} /> Add New Question
          </button>
        ) : (
          <div className="admin-card">
            <h3 className="font-serif">New FAQ</h3>
            <div className="form-group">
              <label>Question</label>
              <input 
                value={tempFaq.question} 
                onChange={e => setTempFaq({...tempFaq, question: e.target.value})} 
                placeholder="e.g. Do you provide child seats?"
              />
            </div>
            <div className="form-group">
              <label>Answer</label>
              <textarea 
                value={tempFaq.answer} 
                onChange={e => setTempFaq({...tempFaq, answer: e.target.value})} 
                rows="4"
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => handleSave()} className="btn btn-primary">Save</button>
              <button onClick={() => setIsAdding(false)} className="btn btn-outline">Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div className="faq-items">
        {faqs.map((faq) => (
          <div key={faq.id} className="admin-card" style={{ marginBottom: '1rem' }}>
            {editingId === faq.id ? (
              <div>
                <div className="form-group">
                  <label>Question</label>
                  <input 
                    value={tempFaq.question} 
                    onChange={e => setTempFaq({...tempFaq, question: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>Answer</label>
                  <textarea 
                    value={tempFaq.answer} 
                    onChange={e => setTempFaq({...tempFaq, answer: e.target.value})} 
                    rows="4"
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => handleSave(faq.id)} className="btn btn-primary">Update</button>
                  <button onClick={() => setEditingId(null)} className="btn btn-outline">Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h4 className="font-serif" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{faq.question}</h4>
                  <p style={{ color: '#666', whiteSpace: 'pre-wrap' }}>{faq.answer}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                  <button onClick={() => startEditing(faq)} className="btn btn-outline btn-small" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(faq.id)} className="btn btn-outline btn-small" style={{ color: 'red' }} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
