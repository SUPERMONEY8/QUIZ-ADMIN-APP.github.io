# FreshGrocer - Grocery Delivery Web Application

A modern, responsive grocery delivery web application with a clean frontend and Laravel backend.

## Project Structure

```
grocery-delivery-app/
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css          # Main stylesheet
│   │   ├── js/
│   │   │   ├── app.js            # Core application logic
│   │   │   ├── api.js            # API communication module
│   │   │   ├── cart.js           # Shopping cart management
│   │   │   └── auth.js           # Authentication management
│   │   └── images/               # Image assets
│   ├── pages/                    # Additional HTML pages
│   └── index.html                # Landing page
├── backend/                      # Laravel project (to be added)
└── README.md                     # Project documentation
```

## Features

- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Clean Architecture**: Separated concerns with modular JavaScript
- **Shopping Cart**: Local storage-based cart management
- **Authentication**: User login and registration system
- **API Integration**: Ready for Laravel backend integration

## Technology Stack

### Frontend
- HTML5
- CSS3 (Custom properties, Flexbox, Grid)
- Vanilla JavaScript (ES6+)

### Backend (To be implemented)
- Laravel (PHP Framework)

## Getting Started

### Prerequisites
- Bun runtime (for build tools and package management)

### Installation

1. Navigate to the project directory:
```bash
cd grocery-delivery-app
```

2. Install dependencies (when package.json is created):
```bash
bun install
```

3. Start development server:
```bash
bun run dev
```

## Development

### Frontend Development
The frontend is a static site that can be served using any static file server. For development:

```bash
# Using Bun's built-in server
bun run dev

# Or using a simple HTTP server
bunx serve frontend
```

### Backend Development
The Laravel backend will be set up in the `backend/` directory. Once configured:

```bash
cd backend
bun run dev  # or php artisan serve
```

## File Descriptions

### Frontend Files

- **index.html**: Main landing page with hero section and features
- **assets/css/main.css**: Complete styling with grocery-themed color scheme
- **assets/js/app.js**: Core application logic and utilities
- **assets/js/api.js**: API communication module for backend integration
- **assets/js/cart.js**: Shopping cart management with localStorage
- **assets/js/auth.js**: Authentication and session management

## Color Scheme

The application uses a fresh, grocery-themed color palette:
- Primary Green: `#2d8659`
- Light Green: `#4caf50`
- Fresh Green: `#66bb6a`
- Dark Green: `#1b5e3e`
- White: `#ffffff`
- Accent Orange: `#ff9800`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for development.

## Notes

- All commands use Bun instead of npm/node
- Backend Laravel project will be added to the `backend/` directory
- Additional pages can be added to the `pages/` folder
- Images should be placed in `assets/images/` directory

