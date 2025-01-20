import { useState, useEffect } from 'react';
import './App.css';
import AppointmentBooking from './components/AppointmentBooking';

function App() {
  const [medications, setMedications] = useState(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved) : [];
  });
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: '',
  });

  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMedication.name || !newMedication.time) {
      alert('Please fill in all required fields');
      return;
    }

    setMedications(prev => [...prev, {
      ...newMedication,
      id: Date.now(),
      taken: false,
      nextDose: new Date().toISOString()
    }]);

    setNewMedication({
      name: '',
      dosage: '',
      frequency: '',
      time: '',
    });
  };

  const toggleMedicationTaken = (id) => {
    setMedications(prev =>
      prev.map(med =>
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    );
  };

  const deleteMedication = (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      setMedications(prev => prev.filter(med => med.id !== id));
    }
  };

  return (
    <div className="app-container">
      <header className="nhs-header">
        <div className="nhs-container">
          <h1>NHS Medication Reminder</h1>
        </div>
      </header>

      <main className="nhs-container">
        <section className="medication-form">
          <h2>Add New Medication</h2>
          <form onSubmit={handleSubmit}>
            <div className="nhs-form-group">
              <label className="nhs-form-label" htmlFor="name">
                Medication Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="nhs-input"
                value={newMedication.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="nhs-form-group">
              <label className="nhs-form-label" htmlFor="dosage">
                Dosage
              </label>
              <input
                id="dosage"
                name="dosage"
                type="text"
                className="nhs-input"
                value={newMedication.dosage}
                onChange={handleInputChange}
                placeholder="e.g., 1 tablet"
              />
            </div>

            <div className="nhs-form-group">
              <label className="nhs-form-label" htmlFor="frequency">
                Frequency
              </label>
              <select
                id="frequency"
                name="frequency"
                className="nhs-input"
                value={newMedication.frequency}
                onChange={handleInputChange}
              >
                <option value="">Select frequency</option>
                <option value="daily">Daily</option>
                <option value="twice-daily">Twice Daily</option>
                <option value="weekly">Weekly</option>
                <option value="as-needed">As Needed</option>
              </select>
            </div>

            <div className="nhs-form-group">
              <label className="nhs-form-label" htmlFor="time">
                Time *
              </label>
              <input
                id="time"
                name="time"
                type="time"
                className="nhs-input"
                value={newMedication.time}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="nhs-button">
              Add Medication
            </button>
          </form>
        </section>

        <section className="medications-list">
          <h2>Your Medications</h2>
          {medications.length === 0 ? (
            <p>No medications added yet.</p>
          ) : (
            medications.map(medication => (
              <div key={medication.id} className="medication-card">
                <div className="medication-header">
                  <h3>{medication.name}</h3>
                  <span className="medication-time">{medication.time}</span>
                </div>
                <p>Dosage: {medication.dosage || 'Not specified'}</p>
                <p>Frequency: {medication.frequency || 'Not specified'}</p>
                <div className="medication-actions">
                  <button
                    className={`nhs-button ${medication.taken ? 'secondary' : ''}`}
                    onClick={() => toggleMedicationTaken(medication.id)}
                  >
                    {medication.taken ? 'Undo' : 'Mark as Taken'}
                  </button>
                  <button
                    className="nhs-button secondary"
                    onClick={() => deleteMedication(medication.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        <AppointmentBooking />
      </main>
    </div>
  );
}

export default App;