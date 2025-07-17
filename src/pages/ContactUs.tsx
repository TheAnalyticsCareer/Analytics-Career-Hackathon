import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const ContactUs: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await addDoc(collection(db, 'contact_us'), {
        ...form,
        createdAt: Timestamp.now(),
      });
      setSuccess('Thank you for contacting us! We will get back to you soon.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 py-10">
      <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-900 dark:text-white">Contact Us</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-700 dark:text-slate-200 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-200 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-200 mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        {success && <div className="mt-4 text-green-600 text-center">{success}</div>}
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default ContactUs;
