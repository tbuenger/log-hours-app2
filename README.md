# Home or Office Application

## Overview

This Vue.js application provides a user-friendly interface for managing work schedules. It allows users to view and modify their work type (home or office) and work hours for each day of the month.

## Features

- Monthly calendar view
- Flip animation to change work type (home/office)
- Hours selector for adjusting work hours
- Responsive design for mobile and desktop use

## Components

### 1. Index Page (`pages/index.vue`)

The main page component that displays the entire work schedule for a month. It includes:
- A month picker for navigating between months
- A grid of day cards representing each day of the month

### 2. DayCard Component (`components/DayCard.vue`)

Represents a single day in the work schedule. Features include:
- Display of date, work type, and work hours
- Flip animation to switch between home and office work types
- Integration with HoursSelector for adjusting work hours

### 3. HoursSelector Component (`components/HoursSelector.vue`)

A modal component for selecting work hours. It provides:
- A slider interface for easy hour selection
- Confirmation and cancellation options

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/work-schedule-app.git
   ```

2. Navigate to the project directory:
   ```
   cd work-schedule-app
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000`

## Usage

- Use the month picker to navigate between months
- Click on a day card to flip between home and office work types
- Click on the hours display to open the hours selector and adjust work hours

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.