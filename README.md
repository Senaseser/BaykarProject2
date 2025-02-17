# ✈️ Flight Seat Reservation System

A modern, interactive flight seat reservation system built with Next.js, TypeScript, and Tailwind CSS. This application provides a user-friendly interface for selecting seats and managing passenger information in real-time.

## 🌟 Features

### Seat Selection
- Interactive seat map visualization
- Support for up to 3 seats per reservation
 -  Available seats
 -  Selected seats
 -  Occupied seats
- Real-time seat availability status
- Hover tooltips showing passenger information for occupied seats

### Passenger Management
- Detailed passenger information collection:
  - Name and surname
  - Phone number (with Turkish format validation)
  - Email validation
  - Gender selection
  - Birthday
- Multi-passenger support with step-by-step form progression
- Real-time form validation
- Progress tracking between multiple passengers

### User Experience
- Persistent data storage using localStorage
- Inactivity detection (30-second timeout)
- Confirmation modal for session management
- Toast notifications for user feedback
- Responsive design
- Dynamic pricing calculation

## 🛠️ Technical Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Form Handling**: Custom validation
- **Notifications**: React Hot Toast
- **Data Persistence**: LocalStorage API


## 🚀 Getting Started

To run the project locally, follow these steps:

1. Clone the repository:
Open your terminal and run this commands:

### `git clone https://github.com/Senaseser/BaykarProject2.git`  

### `cd BaykarProject2`

2. Install the necessary dependencies:
### `npm install`

3. Run the development server:

npm run dev

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💻 Usage

1. **Seat Selection**
   - Click on available seats to select (maximum 3)
   - Selected seats will be highlighted in yellow
   - Occupied seats are shown in gray

2. **Passenger Information**
   - Fill in required information for each selected seat
   - Navigate between passengers using "Next" and "Previous" buttons
   - All fields must be completed with valid data

3. **Completion**
   - Review your selection and total price
   - Click "Complete Transaction" to finalize reservation
   - Receive confirmation via toast notification

## 🔒 Validation Rules

- **Phone Numbers**: Must match Turkish format (5xxxxxxxxx)
- **Email**: Must be a valid email format
- **Required Fields**: All fields must be completed
- **Passenger Limit**: Maximum 3 seats per reservation

## 🎨 UI Components

- Interactive seat grid
- Passenger information forms
- Status indicators
- Toast notifications
- Confirmation modals
- Price summary panel

## 🔄 State Management

The application manages several key states:
- Selected seats
- Passenger information
- Active passenger
- Form validation
- Session timeout
- Local storage synchronization

## 🏗️ Project Structure
**├── components/**  
**│   ├── Home.tsx**  
**│   ├── ConfirmationModal.tsx**  
**├── types/**  
**│   ├── Passenger.ts**  
**├── public/**  
**├── styles/**  
└── ...

`components/:` Reusable components of the application.

`types/:` TypeScript type definitions.


For any questions or feedback, please reach out to [sena.eser02@gmail.com](mailto:sena.eser02@gmail.com)

Made with ❤️ by Sena ESER
