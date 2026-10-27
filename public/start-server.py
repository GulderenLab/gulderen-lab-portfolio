#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

# Set the port
PORT = 3000

# Set the directory to serve (current directory)
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers to allow cross-origin requests
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def guess_type(self, path):
        # Ensure proper MIME types for images
        mimetype = super().guess_type(path)
        if path.endswith('.png'):
            return 'image/png'
        elif path.endswith('.jpg') or path.endswith('.jpeg'):
            return 'image/jpeg'
        elif path.endswith('.gif'):
            return 'image/gif'
        elif path.endswith('.svg'):
            return 'image/svg+xml'
        return mimetype

    def log_message(self, format, *args):
        # Custom logging to show served files
        print(f"[{self.log_date_time_string()}] {format % args}")

if __name__ == "__main__":
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"🚀 Server starting...")
            print(f"📂 Serving directory: {os.getcwd()}")
            print(f"🌐 Server running at: http://localhost:{PORT}")
            print(f"🖼️  Test image at: http://localhost:{PORT}/data/images/genital_aciller/ga_1.png")
            print(f"🩺 Quiz at: http://localhost:{PORT}/quiz.html?quiz=genital-emergencies-quiz")
            print(f"🏠 Quiz Hub at: http://localhost:{PORT}/quiz-hub.html")
            print(f"\n⏹️  Press Ctrl+C to stop the server")
            print("-" * 80)
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        sys.exit(0)
    except OSError as e:
        if e.errno == 10048:  # Port already in use
            print(f"❌ Port {PORT} is already in use. Please stop the existing server or use a different port.")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)