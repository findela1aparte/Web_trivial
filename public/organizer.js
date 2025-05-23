const socket = io();

document.getElementById("nextBtn").addEventListener("click", () => {
  socket.emit("next-question");
});

socket.on("new-question", (data) => {
  document.getElementById("questionCounter").textContent = `Pregunta: ${data.index}/${data.total}`;
  document.getElementById("gameStatus").textContent = "";
});

socket.on("players-update", (players, responders = []) => {
  const list = document.getElementById("playerList");
  list.innerHTML = "";
  players.forEach(p => {
    const li = document.createElement("li");
    const hasResponded = responders.includes(p.id);
    li.textContent = `${p.name} (${p.score} pts) ${hasResponded ? '✅' : ''}`;
    list.appendChild(li);
  });
});

socket.on("game-over", (players) => {
  document.getElementById("nextBtn").disabled = true;
  document.getElementById("gameStatus").textContent = "🎉 Juego Terminado 🎉";

  const list = document.getElementById("playerList");
  list.innerHTML = "";
  players.sort((a, b) => b.score - a.score).forEach((p, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${p.name} - ${p.score} puntos`;
    list.appendChild(li);
  });
});
