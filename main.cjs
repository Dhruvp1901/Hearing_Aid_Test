const { app, BrowserWindow } = require('electron');
const path = require('path');

//** this function creates new electron window */
function createWindow() {
  // Create a new BrowserWindow instance
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // Use 'false' for security reasons (or 'true' if needed)
      contextIsolation: true,
      preload: [path.join(__dirname, 'index.js'), path.join(__dirname, 'audio.js')]// Optional: Create preload script if needed
    }
  });

  // Load the HTML file (your app's entry point)
  win.loadFile('front-page.html'); // Replace with the correct file if your entry point is different
}


//** function for bootstrapping a window */
app.whenReady().then(() => {
  createWindow();

  // Quit the app when all windows are closed (on macOS, apps don't quit until the user quits them)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

//** function for quitting application */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
