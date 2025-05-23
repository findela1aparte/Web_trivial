const socket = io();
let playerName = "";

document.getElementById("joinBtn").addEventListener("click", () => {
  playerName = document.getElementById("nameInput").value.trim();
  if (playerName) {
    socket.emit("join", playerName);
    document.getElementById("nameInput").style.display = "none";
    document.getElementById("joinBtn").style.display = "none";
  }
});

socket.on("new-question", (question) => {
  document.getElementById("questionArea").style.display = "block";
  document.getElementById("questionText").textContent = question.question;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  question.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => {
      const isCorrect = option === question.answer;
      socket.emit("answer", isCorrect);
      Array.from(optionsContainer.children).forEach(b => b.disabled = true);
    };
    optionsContainer.appendChild(btn);
  });
});

socket.on("game-over", (players) => {
  document.body.innerHTML = "<h2>Juego terminado</h2>";
  const sorted = players.sort((a, b) => b.score - a.score);
  sorted.forEach((p, i) => {
    const div = document.createElement("div");
    div.textContent = `${i + 1}. ${p.name} - ${p.score} puntos`;
    document.body.appendChild(div);
  });
});
