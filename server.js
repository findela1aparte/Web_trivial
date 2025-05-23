// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

let players = {};
let currentQuestionIndex = 0;
let questions = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions.json'), 'utf8'));

// Servimos archivos estáticos
app.use(express.static('public'));

io.on('connection', socket => {
  console.log('Jugador conectado:', socket.id);

  socket.on('join', name => {
    players[socket.id] = { name, score: 0 };
    io.emit('players-update', Object.values(players));
  });

  socket.on('answer', correct => {
    if (correct) players[socket.id].score++;
  });

  socket.on('next-question', () => {
    if (currentQuestionIndex < questions.length) {
      io.emit('new-question', questions[currentQuestionIndex]);
      currentQuestionIndex++;
    } else {
      io.emit('game-over', Object.values(players));
    }
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('players-update', Object.values(players));
  });
});

server.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

let currentResponders = new Set();

socket.on('answer', correct => {
  if (!currentResponders.has(socket.id)) {
    if (correct) players[socket.id].score++;
    currentResponders.add(socket.id);
    io.emit('players-update', Object.values(players), Array.from(currentResponders));
  }
});

socket.on('next-question', () => {
  if (currentQuestionIndex < questions.length) {
    currentResponders = new Set();
    io.emit('new-question', {
      question: questions[currentQuestionIndex],
      index: currentQuestionIndex + 1,
      total: questions.length,
    });
    currentQuestionIndex++;
  } else {
    io.emit('game-over', Object.values(players));
  }
});