from app import app
from app.socket import socketio

if __name__ == '__main__':
    socketio.run(app, debug=True)