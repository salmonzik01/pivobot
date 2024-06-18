// Set bot to ready state
Telegram.WebApp.ready();

// Get personalized data from Telegram
let initData = Telegram.WebApp.initData || "";

const liters = document.querySelector(".liters");

const beer = document.querySelector(".beer img");

beer.addEventListener("click", (e) => {
  liters.innerHTML = parseInt(liters.innerHTML) + 1;

  if (liters.innerHTML > 5) {
    const data = JSON.stringify({
      _auth: initData,
      liters: liters.innerHTML,
    });

    console.log(data);

    fetch("/api/drinkBeer", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: data,
    }).then(() => Telegram.WebApp.close());
  }
});