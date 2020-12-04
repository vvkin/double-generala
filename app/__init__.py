from flask import Flask
from flask_socketio import SocketIO

socketio = SocketIO()
games = {}

def create_app(debug=True):
    app = Flask(__name__)
    app.debug = debug
    app.config['SECRET_KEY'] = 'secret_key'

    from .play import play_bp
    app.register_blueprint(play_bp)
    socketio.init_app(app)
    return app


