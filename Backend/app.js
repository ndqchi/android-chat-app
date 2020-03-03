const SocketServer = require('websocket').server;
const http = require('http');
const express = require('express');
const app = express();
const mongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017"
const server = http.Server(app);

app.use(express.json());

mongoClient.connect(url, (err, db) => {
	if (err) console.log("Error while connecting mongo client");
	else {
		const chatAppDB = db.db('chatAppDB');
		const usersCollection = chatAppDB.collection('users');

		app.post('/signup', (req, res) => {
			const newUser = {
				username: req.body.username,
				email: req.body.email,
				password: req.body.password
			}

			const query = { email: newUser.email }

			usersCollection.findOne(query, (err, result) => {
				if (result == null) {
					usersCollection.insertOne(newUser, (err, result) => {
						res.status(200).send();
					})
				} else {
					res.status(400).send();
				}
			})
		})

		app.post('/login', (req, res) => {
			const query = {
				email: req.body.email,
				password: req.body.password
			}

			usersCollection.findOne(query, (err, result) => {
				if (result != null) {
					const objToSend = {
						username: result.username,
						email: result.email
					}

					res.status(200).send(JSON.stringify(objToSend));
				} else {
					res.status(404).send()
				}
			}) 
		})
	}
})



wsServer = new SocketServer({httpServer:server});

const connections = [];

wsServer.on('request', (req) => {
	const connection = req.accept();
	console.log('new connection')
	connections.push(connection);

	connection.on('message', (mes) => {
		connections.forEach(element => {
			if (element != connection)
				element.sendUTF(mes.utf8Data);
		})
	})

	connection.on('close', (resCode, des) => {
		console.log('connection closed');
		connections.splice(connections.indexOf(connection),1)
	})
})

server.listen(3000, () => {
	console.log("Listening on port 3000...")

})