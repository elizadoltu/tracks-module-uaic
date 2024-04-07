import React, { useEffect, useState } from 'react';

const LocationsList = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        console.log('Fetched data:', jsonData); // Log fetched data
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {data ? ( // Check if data is not null
        <>
          <h2>Locations</h2>
          <ul>
            {data.locations.map(location => (
              <li key={location.LOCATION_ID}>
                {location.NAME}: {location.DESCRIPTION}
              </li>
            ))}
          </ul>
          <h2>Categories</h2>
          <ul>
            {data.categories.map(category => (
              <li key={category.CATEGORY_ID}>
                {category.CATEGORY_NAME}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
  
};

export default LocationsList;
