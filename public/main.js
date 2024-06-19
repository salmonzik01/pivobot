// Set bot to ready state
Telegram.WebApp.ready();

// Get personalized data from Telegram
let initData = Telegram.WebApp.initData || "";

const username = document.querySelector(".username");
const liters = document.querySelector(".liters");
const beer = document.querySelector(".beer img");

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
  // liters.innerHTML = parseInt(liters.innerHTML) + 1;

  // if (liters.innerHTML > 5) {
  //   const data = JSON.stringify({
  //     _auth: initData,
  //     liters: liters.innerHTML,
  //   });

  //   fetch("/api/drinkBeer", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     body: data,
  //   }).then(() => Telegram.WebApp.close());
  // }
});

async function main() {
  const userInfo = await post("/api/getUser");

  console.log(userInfo)

  username.innerHTML = userInfo.userId;
  liters.innerHTML = userInfo.litersOfBeer;
}
main();
