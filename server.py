import http.server
import socketserver
import os

PORT = 3000
DIRECTORY = "Frontend"

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Serve from the Frontend directory
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def send_response_only(self, code, message=None):
        super().send_response_only(code, message)
        # Disable browser caching completely
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')

if __name__ == '__main__':
    # Ensure TCPServer allows reusing the address (prevents "Address already in use" errors)
    socketserver.TCPServer.allow_reuse_address = True
    
    # Change working directory to the project root to ensure clean paths
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), NoCacheHTTPRequestHandler) as httpd:
        print(f"============================================================")
        print(f"🚀 PronounceRight Frontend Server running at http://localhost:{PORT}")
        print(f"🔒 Browser Caching is DISABLED (fixes all script updates instantly)")
        print(f"============================================================")
        httpd.serve_forever()
