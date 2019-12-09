document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect('http://' + document.domain + ':' + location.port);

    let room = 'Lounge';
    joinRoom('Lounge')

    socket.on('message', data => {
        if (data.username) {
            const msg_row = document.createElement('div');
            if(data.username === username) {
                msg_row.classList.add('msg-row','sent');
            } else {
                msg_row.classList.add('msg-row','received');
            }

            const msg_text = document.createElement('div');
            msg_text.classList.add('msg-text');
            msg_text.innerHTML = `<div class="user">${data.username}</div>${data.msg}`;

            const msg_time = document.createElement('div');
            msg_time.classList.add('msg-time');

            msg_row.appendChild(msg_text);
            msg_row.appendChild(msg_time);
            document.querySelector('.message-section').append(msg_row);
        } else {
            printSysMsg(data.msg)
        }
    });

    document.getElementById('send_message').onclick = () => {
        socket.send({
            'username': username,
            'msg': document.querySelector('#user_message').value,
            'room': room
        });
        document.querySelector('#user_message').value = '';
    }

    document.querySelector('#user_message').addEventListener('keyup', event => {
        event.preventDefault();
        if (event.keyCode == 13) {
            document.querySelector('#send_message').click();
        }
    })

    document.querySelectorAll('.room').forEach(div => {
        div.onclick = () => {
            let newRoom = div.firstElementChild.innerHTML;
            if (newRoom == room)
                printSysMsg(`You are already in ${room} room.`);
            else {
                leaveRoom(room);
                joinRoom(newRoom);
                room = newRoom;
            }
        }
    });

    function leaveRoom(room) {
        socket.emit('leave', { 'username': username, 'room': room });
    }

    function joinRoom(room) {
        socket.emit('join', { 'username': username, 'room': room });
        document.querySelector('.message-section').innerHTML = '';
        document.querySelector('#user_message').focus();
        document.querySelector('#room_name').textContent = `${room} Chat Room`;
    }

    function printSysMsg(msg) {
        const p = document.createElement('p');
        p.innerHTML = msg;
        document.querySelector('.message-section').append(p);
    }
})