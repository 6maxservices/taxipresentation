'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LocationInput from './LocationInput';
import './book.css';

function BookingForm() {
  const searchParams = useSearchParams();
  const preselectedType = searchParams.get('type') || 'tour';
  
  const [serviceType, setServiceType] = useState(preselectedType);
  const [products, setProducts] = useState({ tours: [], transfers: [] });
  const [arrivalType, setArrivalType] = useState('hotel');
  const [customPassengers, setCustomPassengers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.tours) setProducts(data);
      } catch (err) {
        console.error('Failed to load products', err);
      }
    }
    fetchProducts();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: data.serviceType,
          clientName: data.name,
          clientEmail: data.email,
          clientPhone: data.phone,
          date: data.date,
          passengers: data.passengers === 'custom' ? data.passengersCustom : data.passengers,
          pickupLocation: data.pickup,
          dropoffLocation: data.dropoff,
          
          // Arrival Details
          arrivalType: data.arrivalType,
          flightNumber: data.flightNumber || null,
          arrivalTime: data.arrivalTime || null,
          portName: data.portName || null,
          portGate: data.portGate || null,
          
          notes: `${data.product ? `Interested in: ${data.product}\n` : ''}${data.notes}`
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit booking');
      }

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again or contact us directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="booking-success text-center">
        <h2 className="font-serif" style={{ color: 'var(--color-azure-dark)' }}>Request Sent!</h2>
        <p>Thank you for reaching out. George will review your request and get back to you via email or WhatsApp within a few hours to confirm details and availability.</p>
        <p className="italic" style={{ marginTop: 'var(--space-md)' }}>Remember: No deposit is required. You pay only after the service is completed.</p>
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      {error && <div className="form-error" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      
      <div className="form-group">
        <label htmlFor="serviceType">What do you need?</label>
        <select 
          id="serviceType" 
          name="serviceType" 
          value={serviceType} 
          onChange={(e) => setServiceType(e.target.value)}
          required
        >
          <option value="tour">Private Tour</option>
          <option value="transfer">Transfer</option>
          <option value="custom">Custom Itinerary</option>
        </select>
      </div>

      {(serviceType === 'tour' || serviceType === 'transfer') && (
        <div className="form-group">
          <label htmlFor="product">Which one are you interested in?</label>
          <select id="product" name="product" required>
            <option value="">Select a {serviceType}...</option>
            {serviceType === 'tour' ? (
              products.tours.map(t => <option key={t.id} value={t.title}>{t.title}</option>)
            ) : (
              products.transfers.map(t => <option key={t.id} value={t.title}>{t.title}</option>)
            )}
          </select>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input type="text" id="name" name="name" required placeholder="John Doe" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" required placeholder="john@example.com" />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number (WhatsApp preferred)</label>
          <input type="tel" id="phone" name="phone" required placeholder="+1 234 567 8900" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">Preferred Date</label>
          <input type="date" id="date" name="date" required />
        </div>
        <div className="form-group">
          <label htmlFor="passengers">Number of Passengers</label>
          <select 
            id="passengers" 
            name="passengers" 
            required 
            onChange={(e) => setCustomPassengers(e.target.value === 'custom')}
          >
            <option value="1">1 Person</option>
            <option value="2">2 Persons</option>
            <option value="3">3 Persons</option>
            <option value="4">4 Persons</option>
            <option value="5">5 Persons</option>
            <option value="custom">More / Custom</option>
          </select>
          {customPassengers && (
            <input 
              type="text" 
              name="passengersCustom" 
              placeholder="How many people?" 
              required 
              style={{ marginTop: '10px' }} 
            />
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="arrivalType">Pick-up From</label>
        <select 
          id="arrivalType" 
          name="arrivalType" 
          value={arrivalType} 
          onChange={(e) => setArrivalType(e.target.value)}
          required
        >
          <option value="hotel">Hotel / Private Address</option>
          <option value="airport">Airport (ATH)</option>
          <option value="port">Port (Piraeus, Rafina, Lavrio)</option>
          <option value="other">Other</option>
        </select>
      </div>

      {arrivalType === 'airport' && (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="flightNumber">Flight Number</label>
            <input type="text" id="flightNumber" name="flightNumber" placeholder="e.g. DL123" required />
          </div>
          <div className="form-group">
            <label htmlFor="arrivalTime">Arrival Time</label>
            <input type="time" id="arrivalTime" name="arrivalTime" required />
          </div>
        </div>
      )}

      {arrivalType === 'port' && (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="portName">Ship Name / Port</label>
            <input type="text" id="portName" name="portName" placeholder="e.g. Blue Star Delos" required />
          </div>
          <div className="form-group">
            <label htmlFor="portGate">Gate / Arrival Time</label>
            <input type="text" id="portGate" name="portGate" placeholder="e.g. Gate E1 / 08:30" required />
          </div>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="pickup">Pick-up Location Details</label>
          <LocationInput 
            id="pickup" 
            name="pickup" 
            placeholder={arrivalType === 'hotel' ? "Hotel name or address" : "Specific terminal or meeting point"} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="dropoff">Drop-off Location</label>
          <LocationInput id="dropoff" name="dropoff" placeholder="Destination address (optional)" />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Tell us more about your trip</label>
        <textarea 
          id="notes" 
          name="notes" 
          rows="4" 
          placeholder="Any special requests or requirements?"
        ></textarea>
      </div>

      <div className="form-submit">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', minHeight: '56px' }}>
          {isSubmitting ? 'Sending Request...' : 'Send Request'}
        </button>
        <p className="submit-note text-center">We will contact you to confirm. No payment details required.</p>
      </div>
    </form>
  );
}

export default function BookPage() {
  return (
    <div className="book-page page-container">
      <div className="container">
        <header className="page-header text-center">
          <h1 className="font-serif">Request a Booking</h1>
          <p className="page-subtitle">Let's plan your journey. Fill out the form below and we'll get back to you promptly to confirm availability.</p>
        </header>

        <div className="booking-container">
          <Suspense fallback={<div className="text-center">Loading form...</div>}>
            <BookingForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
