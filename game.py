from app import socketio, create_app

app = create_app(debug=True)

if __name__ == '__main__':
    socketio.run(app)
