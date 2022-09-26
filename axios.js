const api = axios.create({
  baseURL: "https://api.thecatapi.com/v1/",
});

api.defaults.headers.common["X-API-KEY"] =
  "8e02ea38-5ac9-4971-8096-46eadd52f003";

const errorSpan = document.getElementById("error");
const notHaveFavoriteError = document.getElementById("favoriteError");
const section = document.getElementById("favoriteCat");

async function loadRandomCat() {
  const { data, status } = await api.get("images/search?limit=5");
  console.time(data);
  if (status != 200) {
    errorSpan.innerHTML = "hubo un error: <br>" + res.status;
  } else {
    const buttonsNode = document.querySelectorAll(".favoriteButton");
    const buttons = Array.from(buttonsNode);

    for (let i = 0; i < buttons.length; i++) {
      const element = buttons[i];
      element.onclick = () => makeFavorite(data[i].id);
    }

    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      let imgSelect = document.getElementById(`img${i + 1}`);
      imgSelect.src = element.url;
    }
  }
}

function domDynamic(object) {
  object.map((element) => {
    if (!document.getElementById(element.id)) {
      const article = document.createElement("article");
      const img = document.createElement("img");
      const btn = document.createElement("button");
      const btnText = document.createTextNode("Delete Cat :(");
      article.id = element.id;
      article.className = "FavoritePhotos img-container";
      btn.className = "deleteFavorite";
      btn.appendChild(btnText);
      img.src = element.image.url;
      img.width = 250;
      img.height = 250;
      article.appendChild(img);
      article.appendChild(btn);
      section.appendChild(article);
    }
  });
}

async function UpdateFavoriteCat() {
  const { data, status } = await api.get("favourites");
  const photosArray = Array.from(document.querySelectorAll(".FavoritePhotos"));
  if (status != 200) {
    errorSpan.innerHTML = "hubo un error: " + status;
  } else if (photosArray.length > 0) {
    if (data.length === photosArray.length) {
      domDynamic(data);
    } else {
      section.innerHTML = "";
      domDynamic(data);
    }
  } else {
    domDynamic(data);
  }

  const buttonsNode = document.querySelectorAll(".deleteFavorite");
  const buttons = Array.from(buttonsNode);
  buttons.map((element) => {
    element.onclick = () => deleteFavorite(data[buttons.indexOf(element)].id);
  });
}

async function makeFavorite(id) {
  const { data, status } = await api.post("favourites", {
    image_id: id,
  });
  console.log(data);
  UpdateFavoriteCat();
}

async function deleteFavorite(id) {
  const { data, status } = await api.delete(`favourites/${id}`);
  if (status != 200) {
    console.log(data.message);
    errorSpan.innerHTML = `You have an error ${data.message}`;
  } else {
    console.log("The Cat was delete");
    UpdateFavoriteCat();
  }
}

async function uploadCatImage() {
  const form = document.getElementById("uploadingForm");
  const formData = new FormData(form);
  console.log(formData);
  const { data, status } = api.post("images/upload", { body: formData });
  if (status != 200) {
    errorSpan.innerHTML = `You have an error ${data}`;
  } else {
    console.log("subimos la imagen");
  }
  console.log(data);
  console.log(status);
}

loadRandomCat();
