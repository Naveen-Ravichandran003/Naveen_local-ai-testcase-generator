import http.server
import socketserver
import os
import webbrowser

PORT = 3001
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS for local testing if needed
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run_server():
    os.chdir(DIRECTORY)
    # Go up one level to serve the project root
    os.chdir('..')
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🚀 BLAST Server started at http://localhost:{PORT}")
        print("Press Ctrl+C to stop.")
        webbrowser.open(f"http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopping server...")
            httpd.shutdown()

if __name__ == "__main__":
    run_server()
