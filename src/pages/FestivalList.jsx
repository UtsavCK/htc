import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // Import your Supabase client
import '../styles/FestivalList.css'; // Import the CSS file

const FestivalList = () => {
  const [festivals, setFestivals] = useState([]); // State to store fetched data
  const [filteredFestivals, setFilteredFestivals] = useState([]); // State to store filtered festivals
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors
  const [selectedDate, setSelectedDate] = useState(''); // State to store selected date
  const [selectedFestival, setSelectedFestival] = useState(null); // State to store selected festival for modal

  useEffect(() => {
    const fetchFestivals = async () => {
      setLoading(true); // Start loading spinner
      try {
        // Fetch all records from the 'festivals' table
        const { data, error } = await supabase
          .from('Festival') // Replace with your actual table name
          .select('*'); // Select all columns

        if (error) throw error; // Throw an error if it occurs

        setFestivals(data); // Store the fetched data
        setFilteredFestivals(data); // Initially show all festivals
      } catch (err) {
        setError(err.message); // Handle and store errors
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchFestivals();
  }, []); // Run once when the component is mounted

  const handleDateChange = (e) => {
    const selected = e.target.value;
    setSelectedDate(selected);

    if (selected) {
      // Normalize the selected Date to compare with the fetched data
      const filtered = festivals.filter((festival) => {
        // Assuming festival.Date is stored in the format yyyy-mm-dd
        const festivalDate = festival.Date.split('T')[0]; // Adjust this if necessary
        return festivalDate === selected;
      });

      setFilteredFestivals(filtered);
    } else {
      setFilteredFestivals(festivals); // Show all if no Date is selected
    }
  };

  const openModal = (festival) => {
    setSelectedFestival(festival); // Set the selected festival to display in the modal
  };

  const closeModal = () => {
    setSelectedFestival(null); // Close the modal by setting the selected festival to null
  };

  if (loading) return <p>Loading...</p>; // Display loading state
  if (error) return <p>Error: {error}</p>; // Display error state

  return (
    <div className="festival-container">
      <h1>Festivals</h1>

      <div>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      <div>
        {filteredFestivals.length === 0 ? (
          <p>No festivals found for this date.</p>
        ) : (
          <div className="card-container">
            {filteredFestivals.map((festival) => (
              <div
                key={festival.id}
                className="card"
                onClick={() => openModal(festival)} // Open modal on card click
              >
                <h2 className="card-title">{festival.Festival}</h2>
                <p className="card-date">Date: {festival.Date}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedFestival && (
        <div className="modal" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent modal closing on clicking inside
          >
            <button className="close" onClick={closeModal}>
              ❌
            </button>
            <h2 className="modal-title">{selectedFestival.Festival}</h2>
            <p className="modal-date">{selectedFestival.Date}</p>
            <p className="modal-description">{selectedFestival.Folklore}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FestivalList;