// Set bot to ready state
Telegram.WebApp.ready();

// Get personalized data from Telegram
let initData = Telegram.WebApp.initData || "";

const username = document.querySelector("header span");
const liters = document.querySelector(".pivo-container .amount");
const beer = document.querySelector(".clicker");

async function get(url, data = {}) {
  const body = JSON.stringify({
    _auth: initData,
    ...data,
  });

  return new Promise((res, rej) => {
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    })
      .then(res)
      .catch(rej);
  });
}

async function post(url, data = {}) {
  const body = JSON.stringify({
    _auth: initData,
    ...data,
  });

  return new Promise((res, rej) => {
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    })
      .then((response) => res(response.json()))
      .catch(rej);
  });
}

let beerTrashhold = 0
function sendClicks() {
  post('/api/drinkBeer', { liters: beerTrashhold });
  beerTrashhold = 0;
}

setInterval(sendClicks, 5000);

beer.addEventListener("click", (e) => {
  beerTrashhold += 1;
  liters.innerHTML = parseInt(liters.innerHTML) + 1;

  beer.classList.remove('onclick'); // reset animation
  void beer.offsetWidth; // trigger reflow
  beer.classList.add('onclick'); // start animation
});

async function main() {
  const userInfo = await post("/api/getUser");

  console.log(userInfo)

  username.innerHTML = userInfo.userId;
  liters.innerHTML = userInfo.litersOfBeer;
}
main();
