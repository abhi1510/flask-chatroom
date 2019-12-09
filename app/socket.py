from time import localtime, strftime

from app import socketio
from flask_socketio import send, emit, join_room, leave_room

ROOMS = ['lounge', 'news', 'games', 'coding']

@socketio.on('message')
def message(data):
    send({
        'msg': data['msg'],
        'username': data['username'],
        'time_stamp': strftime('%b-%d %I:%M%p', localtime())
    }, room=data['room'])

@socketio.on('join')
def join(data):
    join_room(data['room'])
    send({
        'msg': data['username'] + 'has joined the ' + data['room']
    }, room=data['room'])


@socketio.on('leave')
def leave(data):
    leave_room(data['room'])
    send({
        'msg': data['username'] + 'has left the ' + data['room']
    }, room=data['room'])

