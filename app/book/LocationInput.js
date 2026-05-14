'use client';
import { useState, useEffect, useRef } from 'react';

export default function LocationInput({ id, name, placeholder, required }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocations = async (val) => {
    if (val.length < 3) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&countrycodes=gr&limit=5&addressdetails=1`);
      const data = await res.json();
      setResults(data);
      setShowResults(true);
    } catch (err) {
      console.error('Location search failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (item) => {
    setQuery(item.display_name);
    setShowResults(false);
  };

  return (
    <div className="location-input-wrapper" ref={wrapperRef} style={{ position: 'relative' }}>
      <input
        type="text"
        id={id}
        name={name}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          searchLocations(e.target.value);
        }}
        onFocus={() => query.length >= 3 && setShowResults(true)}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />
      {isLoading && <div className="loader-mini"></div>}
      
      {showResults && results.length > 0 && (
        <ul className="location-results">
          {results.map((item, idx) => (
            <li key={idx} onClick={() => handleSelect(item)}>
              <span className="location-icon">📍</span>
              <span className="location-text">{item.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
