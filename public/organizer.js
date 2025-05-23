const socket = io();

document.getElementById("nextBtn").addEventListener("click", () => {
  socket.emit("next-question");
});

socket.on("players-update", (players) => {
  const list = document.getElementById("playerList");
  list.innerHTML = "";
  players.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.name} (${p.score} puntos)`;
    list.appendChild(li);
  });
});

socket.on("game-over", (players) => {
  document.getElementById("nextBtn").disabled = true;
});
