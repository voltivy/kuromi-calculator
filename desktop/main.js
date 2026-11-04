const { app, BrowserWindow } = require('electron');

// Makes the page transparent and lets you drag the calculator by its body.
// Buttons, toggles and the screen stay clickable/swipeable.
const CSS = `
html,body{background:transparent!important;overflow:hidden!important;height:auto!important}
body{display:flex!important;align-items:flex-start!important;justify-content:center!important;
     padding:12px 30px 70px!important;min-height:0!important}
.calc{margin:0!important;-webkit-app-region:drag}
.screen,.screen *,.k,.toggle,button,input,a{-webkit-app-region:no-drag}
`;

function createWindow() {
  const win = new BrowserWindow({
    width: 460,
    height: 900,
    useContentSize: true,
    frame: false,          // no title bar / minimize / maximize / close buttons
    transparent: true,     // only the calculator itself is visible
    backgroundColor: '#00000000',
    hasShadow: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    show: false,
    title: 'Pixel Calculator',
    webPreferences: { autoplayPolicy: 'no-user-gesture-required' }
  });

  win.loadFile('index.html');

  win.webContents.on('did-finish-load', async () => {
    await win.webContents.insertCSS(CSS);
    // Shrink the window to fit the calculator exactly
    const r = await win.webContents.executeJavaScript(
      `(() => { const b = document.querySelector('.calc').getBoundingClientRect();
                return { w: b.width, h: b.height }; })()`
    );
    win.setContentSize(Math.ceil(r.w) + 60, Math.ceil(r.h) + 82);
    win.center();
    win.show();
  });

  // Keyboard shortcuts since there are no window buttons:
  //   Esc = close, Ctrl+M = minimize
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'Escape') { win.close(); event.preventDefault(); }
    if (input.control && input.key.toLowerCase() === 'm') { win.minimize(); event.preventDefault(); }
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
