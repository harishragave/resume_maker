import React, { useEffect, useState } from 'react';
import axios from 'axios';

// First install axios if you haven't:
// npm install axios

function YourComponent() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/');
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Message from backend: {message}</h1>
    </div>
  );
}

export default YourComponent; 