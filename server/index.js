import { Server } from 'socket.io'
import express from 'express'
import http from 'http'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
})

app.get('/', (req, res) => {
	res.send('<h1>hello world</h1>')
})

server.listen(1234, () => {
	console.log('listening on 1234')
})

const players = []

io.on('connection', (socket) => {
	console.log('new connection')

	socket.on('register', (nickname, callback) => {
		const validNickname =
			nickname.length > 3 &&
			players.find((soc) => soc.nickname === nickname) === undefined

		if (validNickname) {
			socket.nickname = nickname
			players.push(socket)
			console.log(`New Player: ${nickname}, successfully registed!`)
			console.log(`There are now ${players.length} players in total.`)
			callback(true)
		} else {
			console.log(`Error failed registration with Nickname: ${nickname}`)
			callback(false)
		}
	})

	socket.on('disconnect', () => {
		const i = players.indexOf(socket)
		if (i !== -1) {
			players.splice(i, 1)
			console.log(`Player ${socket.nickname}, has disconnected!`)
			console.log(`There are now ${players.length} players in total.`)
		}
	})

	socket.on('join', (room) => {
		socket.join(room)
		console.log(`Player: ${socket.nickname}, has joined room: ${room}`)
	})

	socket.on('update-in', (letterPos, wordPos) => {
		console.log(
			`Player: ${socket.nickname}, Letter Position is: ${letterPos}, Word Position is: ${wordPos}`
		)
		socket.broadcast
			.to(getRoom(socket))
			.emit('update-out', socket.nickname, letterPos, wordPos)
	})
})

function getRoom(socket) {
	let room
	socket.rooms.forEach((_room) => {
		if (_room !== socket.id) room = _room
	})
	return room
}
