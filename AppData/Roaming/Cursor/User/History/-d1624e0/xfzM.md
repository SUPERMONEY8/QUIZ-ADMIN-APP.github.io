# Employee Shift Assignment - Office Add-in

## Setup Instructions

### 1. Install Node.js (if not already installed)
- Download from: https://nodejs.org/
- Install the LTS version

### 2. Start the Local Web Server

Open a terminal/command prompt in this directory and run:

```bash
npm install
npm start
```

The server will start at `http://localhost:3000`

### 3. Sideload the Add-in into Excel

1. Open Excel
2. Go to **Insert** → **Add-ins** → **My Add-ins**
3. Click **Upload My Add-in**
4. Browse to: `C:\Users\LENOVO\Desktop\خفارة\manifest.xml`
5. Click **Upload**

The add-in should now appear and be ready to use!

### Alternative: Using Python (if Node.js is not available)

If you don't have Node.js, you can use Python's built-in server:

```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```

Then update `manifest.xml` to use `http://localhost:3000` (which is already set).

## Files Structure

- `manifest.xml` - Add-in metadata and configuration
- `taskpane.html` - User interface
- `taskpane.js` - Main application logic
- `taskpane.css` - Styling
- `config.js` - Sheet configuration
- `server.js` - Local web server (for development)

## Troubleshooting

- **Add-in won't load**: Make sure the server is running at `http://localhost:3000`
- **Path issues**: The manifest.xml uses `http://localhost:3000` - make sure the server is running
- **File not found errors**: Ensure all files are in the same directory as `server.js`
