import { Server } from 'socket.io'
import express from 'express'
import http from 'http'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST']
	}

})

app.get('/', (req, res) => {
	res.send('<h1>hello world</h1>')
})

server.listen(1234, () => {
	console.log('listening on 1234')
})

io.on('connection', (socket) => {
	console.log('new connection')

	socket.on('join', (nickname, roomId) => {
		socket.nickname = nickname
		socket.join(roomId)
		console.log(`socket: ${socket.id} has joined room: ${roomId}`)
	})

	socket.on('update-in', (letterPos, wordPos) => {
		console.log(`User: ${socket.nickname}, Letter Posistion is: ${letterPos}, Word Posistion is: ${wordPos}`);
		socket.broadcast.emit('update-out', letterPos, wordPos)
	})
})
