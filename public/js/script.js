document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("project2 JS imported successfully!");
  },
  false
);

const getGameInfo = gameName => {
    axios
      .get(`https://api.boardgameatlas.com/api/search?name=${gameName}&limit=10&client_id=DDJV2RxbFt`)
      .then(response => {
        console.log(response.data.games);
        const gameDetail = response.data.games;
      document.getElementById('game-name').innerText = `Name: ${gameDetail[0].name}`;
      document.getElementById('game-minplayer').innerText = `Min/Max players: ${gameDetail[0].min_players}/${gameDetail[0].max_players}`;
      document.getElementById('game-minage').innerText = `Min age: ${gameDetail[0].min_age}`;
      document.getElementById('game-playtime').innerText = `Playtime: ${gameDetail[0].min_playtime}/${gameDetail[0].max_playtime} minutes`;
      document.getElementById('game-box').setAttribute('src', gameDetail[0].thumb_url);
      document.getElementById('game-rules').innerText = `Rules: ${gameDetail[0].rules_url}`;
      document.getElementById('game-description').innerText = gameDetail[0].description;

    })
    .catch(err => {
      console.log(err);
      err.response.status === 404 ? alert(`The game ${gameName} doesn't exist.`) : alert('Server error! Sorry.');
    });
};
 
document.getElementById('get-game-btn').addEventListener('click', () => {
  const userInput = document.getElementById('game-name-input').value;
  getGameInfo(userInput);
});


