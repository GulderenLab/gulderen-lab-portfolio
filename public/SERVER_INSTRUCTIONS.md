# 🩺 RadyolojiHub - Server Instructions

## Problem: Images Not Loading

The images in your quiz are not loading because **no web server is running** to serve the static files. Web browsers cannot directly open local HTML files that load images and data from relative paths.

## ✅ Solution: Start a Local Web Server

You have several options to start a web server:

### Option 1: Use the Batch File (Easiest)
```cmd
# Double-click this file or run in Command Prompt:
start-server.bat
```

### Option 2: Python HTTP Server (Recommended)
```bash
# In PowerShell or Command Prompt:
python start-server.py
```

### Option 3: Node.js Server
```bash
# In PowerShell or Command Prompt:
node start-server.js
```

### Option 4: Simple Python Command
```bash
# Basic Python HTTP server:
python -m http.server 3000
```

## 🌐 Access Your Application

Once the server is running, open your browser and go to:

- **Quiz Hub**: http://localhost:3000/quiz-hub.html
- **Genital Aciller Quiz**: http://localhost:3000/quiz.html?quiz=genital-emergencies-quiz
- **Test Image**: http://localhost:3000/data/images/genital_aciller/ga_1.png
- **Debug Tools**:
  - Image Test: http://localhost:3000/test-image-loading.html
  - Quiz Test: http://localhost:3000/test-genital-quiz-direct.html

## 🖼️ Image Loading Verification

The image `ga_1.png` should now load correctly because:

1. ✅ **File exists**: `data/images/genital_aciller/ga_1.png` (285KB)
2. ✅ **JSON fixed**: Missing comma in `genital_aciller.json` was fixed
3. ✅ **Quiz config**: Properly configured in `quiz.js`
4. ✅ **Server**: Will serve images with correct MIME types

## 🛠️ Troubleshooting

### Port 3000 Already in Use?
If you get a "port already in use" error, either:
1. Stop the existing server (Ctrl+C)
2. Change the PORT variable in the server files
3. Use a different port: `python -m http.server 8080`

### Still Not Working?
1. Check that you're in the correct directory (`C:\gulderenlab\public`)
2. Verify the image file exists: `dir data\images\genital_aciller\ga_1.png`
3. Check browser console for errors (F12)
4. Try the debug pages listed above

## 📁 File Structure
```
C:\gulderenlab\public\
├── quiz.html                      # Main quiz page
├── quiz-hub.html                  # Quiz selection page
├── quiz.js                        # Quiz functionality
├── data/
│   ├── quizzes/
│   │   └── genital_aciller.json   # Quiz data (✅ Fixed)
│   └── images/
│       └── genital_aciller/
│           └── ga_1.png           # Quiz image (✅ Exists)
├── start-server.py                # Python server
├── start-server.js                # Node.js server
├── start-server.bat               # Windows batch file
└── test-*.html                    # Debug tools
```

## 🚀 Quick Start

1. **Open PowerShell** in `C:\gulderenlab\public`
2. **Run**: `python start-server.py` or `./start-server.bat`
3. **Open browser**: http://localhost:3000/quiz-hub.html
4. **Click**: "Genital Aciller Radyoloji" quiz
5. **Verify**: Image loads on Question #3

That's it! Your quiz with images should now work perfectly. 🎉