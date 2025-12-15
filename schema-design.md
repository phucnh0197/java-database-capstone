# Schema Design

## MySQL Database Design

### Table: patients
- id: INT, Primary Key, Auto Increment
- first_name: VARCHAR(50), Not Null
- last_name: VARCHAR(50), Not Null
- email: VARCHAR(100), Unique, Not Null
- phone_number: VARCHAR(20), Not Null
- date_of_birth: DATE, Not Null
- address: TEXT
- created_at: DATETIME, Default CURRENT_TIMESTAMP

### Table: doctors
- id: INT, Primary Key, Auto Increment
- first_name: VARCHAR(50), Not Null
- last_name: VARCHAR(50), Not Null
- specialty: VARCHAR(100), Not Null
- email: VARCHAR(100), Unique, Not Null
- phone_number: VARCHAR(20), Not Null
- working_hours: VARCHAR(255) (e.g., "Mon-Fri 09:00-17:00")
- created_at: DATETIME, Default CURRENT_TIMESTAMP

### Table: appointments
- id: INT, Primary Key, Auto Increment
- doctor_id: INT, Foreign Key → doctors(id)
- patient_id: INT, Foreign Key → patients(id)
- appointment_time: DATETIME, Not Null
- status: INT (0 = Scheduled, 1 = Completed, 2 = Cancelled)
- reason: TEXT
- created_at: DATETIME, Default CURRENT_TIMESTAMP

### Table: admin
- id: INT, Primary Key, Auto Increment
- username: VARCHAR(50), Unique, Not Null
- password: VARCHAR(255), Not Null
- role: VARCHAR(20), Not Null (e.g., 'ADMIN', 'RECEPTIONIST')
- created_at: DATETIME, Default CURRENT_TIMESTAMP

## MongoDB Collection Design

### Collection: prescriptions
This collection stores prescription details. A document model is chosen here because prescriptions can have a variable number of medications, instructions, and nested details (like pharmacy info) that don't map cleanly to a rigid tabular structure without excessive joins.

```json
{
  "_id": "ObjectId('64abc123456')",
  "patient_id": 123,
  "doctor_id": 45,
  "appointment_id": 789,
  "issued_date": "2023-10-27T10:00:00Z",
  "status": "active",
  "medications": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "3x daily",
      "duration": "7 days",
      "instructions": "Take with food"
    },
    {
      "name": "Ibuprofen",
      "dosage": "400mg",
      "frequency": "As needed",
      "instructions": "Do not exceed 3 tablets a day"
    }
  ],
  "notes": "Patient should stay hydrated.",
  "pharmacy_preference": {
    "name": "HealthPlus Pharmacy",
    "location": "123 Main St, Springfield",
    "phone": "555-0199"
  }
}
```
