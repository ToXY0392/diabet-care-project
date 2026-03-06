# 1. Presentation

Diabetes management requires daily monitoring, clear communication with healthcare professionals, and reliable centralization of medical information. Today, this data is often scattered between paper logs, disconnected applications, or fragmented medical records, which complicates patient monitoring and coordination of care.

This responsive web application developed with Ruby on Rails aims to centralize and secure the medical data of diabetic patients. It allows patients to record their blood glucose levels, treatments, and observations, while providing healthcare professionals with real-time access to the information necessary for effective medical follow-up.

The application is designed to be easy to use, secure, and compliant with GDPR, with an initial implementation intended for the French territory.

---

# 2. User Journey

A patient creates a secure account on the platform and enters their basic information. Once logged in, they access their dashboard where they can record their blood glucose measurements daily, their insulin injections, their treatments, and add observations or symptoms.

All this data is stored and displayed in a history viewable through tables and graphs, allowing the patient to track the evolution of their health.

Healthcare professionals (doctors or nurses) have dedicated access that allows them to consult their patients' data in real time via a professional dashboard. They can also communicate with patients through secure messaging and organize consultations using an integrated calendar.

If necessary, an emergency module allows quick access to essential medical information and emergency contacts.

---

# 3. Concretely and Technically

The application will be developed using Ruby on Rails as a responsive web application, accessible from a computer, tablet, or smartphone through a web browser.

## 3.1 Database

The database must allow the management of several types of users with different roles.

The main tables could include:

### Users
- email
- secure password
- role (patient, doctor, nurse, administrator)

### Patient_profiles
- basic medical information
- emergency contacts

### Glycemia_records
- blood glucose value
- date / time
- associated patient

### Treatments
- treatment type
- dose
- frequency

### Prescriptions
- medical prescriptions
- associated doctor
- modification history

### Appointments
- date
- patient
- healthcare professional
- status

### Messages
- sender
- recipient
- content
- date

Sensitive medical data must be encrypted in order to guarantee confidentiality.

---

## 3.2 Frontend

The frontend must be responsive in order to function properly on mobile, tablet, and desktop.

The main components will include:

- registration / login page  
- patient dashboard  
- healthcare professional dashboard  
- blood glucose recording form  
- treatment management  
- secure messaging  
- appointment calendar  
- graphical data visualization  

Some JavaScript will be necessary for:

- blood glucose monitoring graphs  
- the interactive calendar  
- certain dynamic interactions (dashboard updates, messaging)

---

## 3.3 Backend

The backend will be built with Ruby on Rails.

It will handle:

- secure user authentication  
- role and permission management  
- encryption of sensitive medical data  
- appointment management  
- sending automatic reminders (treatments or appointments)  
- secure messaging between patients and healthcare professionals  

Internal APIs will allow the different features of the application to connect together (medical data management, messaging, calendar).

---

## 3.4 My Technical Needs

### Current Skills

- web development with Ruby on Rails  
- web application design  
- database management  
- application project structuring  

### Needs to Complete the Team

- frontend development (UI/UX and dynamic components)  
- security and sensitive data management  
- implementation of graphs and visualizations  
- user experience optimization  
- testing and application validation  

---

# 4. The Minimal but Functional Version to Deliver in the First Week (MVP)

The MVP must allow the delivery of a first simple but functional version of the application.

Minimal features:

- user registration and login  
- role management (patient / healthcare professional)  
- recording of blood glucose measurements by patients  
- display of measurement history  
- doctor access to patient data  
- simple dashboard interface  

This first version will already allow:

- patients to record their data  
- doctors to consult them  

Advanced features (messaging, automatic reminders, advanced graphs, full calendar) can be added later.

---

# 5. The Version That Will Be Presented to the Jury

During the second week, several features can be added to improve the user experience:

- blood glucose monitoring graphs  
- secure patient / doctor messaging  
- interactive appointment calendar  
- automatic treatment reminders  
- improved professional dashboard  
- more advanced user interface  
- improved security and data encryption  

The objective will be to propose a more complete, fluid, and pleasant application to use, while maintaining a solid technical foundation.

---

# 6. Dexcom integration
