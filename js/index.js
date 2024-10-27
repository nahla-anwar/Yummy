//* HTML elements
const mainContent = document.querySelector(".main ");
const searchContent = document.querySelector(".search ");
let nameInput;
let emailInput;
let phoneInput;
let ageInput;
let passwordInput;
let repasswordInput;
let submitBtn;

//* App variables
const nameRegex = /^[a-zA-Z ]+$/;
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
const ageRegex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
getMeals();

//* Functions
async function getMeals() {
  showLoading();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=`
  );
  let data = await response.json();
  displayMeals(data.meals);
  hideLoading();
}

function displayMeals(data) {
  let mealsHTML = "";
  for (let i = 0; i < data.length; i++) {
    mealsHTML += `
        <div class="col-md-3">
          <div onclick="getDetailsById('${data[i].idMeal}')" class="inner meal position-relative rounded-2 overflow-hidden">
            <img src=${data[i].strMealThumb} class="w-100 d-block" alt="" />
            <div
              class="overlay position-absolute d-flex justify-content-center align-items-center text-center"
            >
              <h3>${data[i].strMeal}</h3>
            </div>
          </div>
        </div>
  `;

    mainContent.innerHTML = mealsHTML;
  }
}

function displaySearch() {
  searchContent.innerHTML = `
        <div class="col-md-6 searchName mb-3">
          <input
            oninput="searchByName(this.value)"
            type="search"
            class="form-control bg-transparent"
            placeholder="Search By Name"
          />
        </div>
        <div class="col-md-6 searchLetter mb-3">
          <input
            oninput="searchByLetter(this.value)"
            type="search"
            class="form-control bg-transparent"
            placeholder="Search By First Letter"
            maxlength="1"
          />
        </div>
  `;

  mainContent.innerHTML = "";
}

async function searchByName(name) {
  close();
  showLoading();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  let data = await response.json();
  if (data.meals) {
    displayMeals(data.meals);
  } else {
    displayMeals([]);
  }
  hideLoading();
}

async function searchByLetter(letter) {
  close();
  showLoading();
  if (letter === "") {
    letter = "a";
  }
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  let data = await response.json();
  if (data.meals) {
    displayMeals(data.meals);
  } else {
    displayMeals([]);
  }
  hideLoading();
}

async function getCategories() {
  showLoading();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let data = await response.json();
  displayCategories(data);
  hideLoading();
}

function displayCategories(data) {
  searchContent.innerHTML = "";
  const allCategories = data.categories;
  let categoriesHTML = "";
  for (let i = 0; i < allCategories.length; i++) {
    categoriesHTML += `
        <div class="col-md-3">
          <div onclick="getMealByCategory('${allCategories[i].strCategory}')"
            class="inner category position-relative rounded-2 overflow-hidden"
          >
            <img src=${
              allCategories[i].strCategoryThumb
            } class="w-100 d-block" alt="" />
            <div
              class="overlay position-absolute d-flex justify-content-center align-items-center flex-column text-center overflow-hidden"
            >
              <h3>${allCategories[i].strCategory}</h3>
              <p>${allCategories[i].strCategoryDescription
                .split(" ")
                .splice(0, 20)
                .join(" ")}</p>
            </div>
          </div>
        </div>
  `;

    mainContent.innerHTML = categoriesHTML;
  }
}

async function getAreas() {
  showLoading();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let data = await response.json();
  displayAreas(data);
  hideLoading();
}

function displayAreas(data) {
  searchContent.innerHTML = "";
  const allAreas = data.meals;
  let areasHTML = "";
  for (let i = 0; i < allAreas.length; i++) {
    areasHTML += `
        <div class="col-md-3">
          <div onclick="getMealByArea('${allAreas[i].strArea}')" class="inner area text-center text-white">
            <i class="fa-solid fa-house-laptop fa-4x"></i>
            <h3>${allAreas[i].strArea}</h3>
          </div>
        </div>
  `;

    mainContent.innerHTML = areasHTML;
  }
}

async function getIngredients() {
  showLoading();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let data = await response.json();
  displayIngredients(data);
  hideLoading();
}

function displayIngredients(data) {
  searchContent.innerHTML = "";
  const allIngredients = data.meals.splice(0, 24);
  let ingredientsHTML = "";
  for (let i = 0; i < allIngredients.length; i++) {
    ingredientsHTML += `
        <div class="col-md-3">
          <div onclick="getMealByIngredients('${
            allIngredients[i].strIngredient
          }')" class="inner ingredients text-center text-white">
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            <h3>${allIngredients[i].strIngredient}</h3>
            <p>${allIngredients[i].strDescription
              .split(" ")
              .splice(0, 20)
              .join(" ")}</p>
          </div>
        </div>
  `;

    mainContent.innerHTML = ingredientsHTML;
  }
}

async function getMealByCategory(category) {
  close();
  showLoading();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  let data = await response.json();
  displayMeals(data.meals.splice(0, 20));
  hideLoading();
}

async function getMealByArea(area) {
  close();
  showLoading();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  let data = await response.json();
  displayMeals(data.meals.splice(0, 20));
  hideLoading();
}

async function getMealByIngredients(ingredients) {
  close();
  showLoading();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
  );
  let data = await response.json();
  displayMeals(data.meals.splice(0, 20));
  console.log(data);
  hideLoading();
}

async function getDetailsById(id) {
  showLoading();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  let data = await response.json();
  displayDetailedMeal(data);
  hideLoading();
}

function displayDetailedMeal(data) {
  close();

  const mealDetails = data.meals[0];
  searchContent.innerHTML = "";

  let recipes = "";
  for (let i = 1; i <= 20; i++) {
    if (mealDetails[`strIngredient${i}`]) {
      recipes += `<li class="alert alert-info px-2 py-1">${
        mealDetails[`strMeasure${i}`]
      } ${mealDetails[`strIngredient${i}`]}</li>`;
    }
  }

  let tags = mealDetails.strTags?.split(",");
  if (!tags) {
    tags = [];
  }
  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `<li class="alert alert-danger px-2 py-1">${tags[i]}</li>`;
  }

  let mealHTML = `
        <div class="col-md-4">
          <div class="meal-pic text-white">
            <img
              src=${mealDetails.strMealThumb}
              class="w-100 rounded-2"
              alt="meal image"
            />
            <h2>${mealDetails.strMeal}</h2>
          </div>
        </div>
        <div class="col-md-8">
          <div class="meal-details text-white">
            <h2>Instructions</h2>
            <p>
              ${mealDetails.strInstructions}
            </p>
            <h3><span class="fw-bolder">Area : </span>${mealDetails.strArea}</h3>
            <h3><span class="fw-bolder">Category : </span>${mealDetails.strCategory}</h3>
            <h3>Recipes :</h3>
            <ul class="list-unstyled d-flex flex-wrap gap-3 mt-3">
              ${recipes}
            </ul>
            <h3>Tags :</h3>
            <ul class="list-unstyled d-flex flex-wrap gap-3 mt-3">
              ${tagsStr}
            </ul>
            <a href=${mealDetails.strSource} class="btn btn-success">Source</a>
            <a href=${mealDetails.strYoutube} class="btn btn-danger">Youtube</a>
          </div>
        </div>
  `;

  mainContent.innerHTML = mealHTML;
}

function displayContact() {
  searchContent.innerHTML = "";
  mainContent.innerHTML = `
        <section
          class="contact min-vh-100 d-flex justify-content-center align-items-center"
        >
          <div class="container w-75 text-center">
            <div class="row g-4 mb-3">
              <div class="col-md-6">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter Your Name"
                  id="name"
                  oninput="validateAll()"
                />
                <div class="alert alert-danger mt-2 d-none">Special characters and numbers not allowed</div>
              </div>
              <div class="col-md-6">
                <input
                  type="email"
                  class="form-control"
                  placeholder="Enter Your Email"
                  id="email"
                  oninput="validateAll()"
                />
                <div class="alert alert-danger mt-2 d-none">Email not valid *exemple@yyy.zzz</div>
              </div>
              <div class="col-md-6">
                <input
                  type="tel"
                  class="form-control"
                  placeholder="Enter Your Phone"
                  id="phone"
                  oninput="validateAll()"
                />
                <div class="alert alert-danger mt-2 d-none">Enter valid Phone Number</div>
              </div>
              <div class="col-md-6">
                <input
                  type="number"
                  class="form-control"
                  placeholder="Enter Your Age"
                  id="age"
                  oninput="validateAll()"
                />
                <div class="alert alert-danger mt-2 d-none">Enter valid age</div>
              </div>
              <div class="col-md-6">
                <input
                  type="password"
                  class="form-control"
                  placeholder="Enter Your Password"
                  id="password"
                  oninput="validateAll()"
                />
                <div class="alert alert-danger mt-2 d-none">Enter valid password *Minimum eight characters, at least one letter and one number:*</div>
              </div>
              <div class="col-md-6">
                <input
                  type="password"
                  class="form-control"
                  placeholder="Repassword"
                  id="repassword"
                  oninput="validateAll()"
                />
                <div class="alert alert-danger mt-2 d-none">Enter valid repassword</div>
              </div>
            </div>
            <button class="btn btn-outline-danger disabled" id="submit">Submit</button>
          </div>
        </section>
  `;

  nameInput = document.getElementById("name");
  emailInput = document.getElementById("email");
  phoneInput = document.getElementById("phone");
  ageInput = document.getElementById("age");
  passwordInput = document.getElementById("password");
  repasswordInput = document.getElementById("repassword");
  submitBtn = document.getElementById("submit");

  nameInput.addEventListener("focus", function () {
    nameIsfocused = true;
  });
  emailInput.addEventListener("focus", function () {
    emailIsfocused = true;
  });
  phoneInput.addEventListener("focus", function () {
    phoneIsfocused = true;
  });
  ageInput.addEventListener("focus", function () {
    ageIsfocused = true;
  });
  passwordInput.addEventListener("focus", function () {
    passwordIsfocused = true;
  });
  repasswordInput.addEventListener("focus", function () {
    repasswordIsfocused = true;
  });
}

let nameIsfocused = false;
let emailIsfocused = false;
let phoneIsfocused = false;
let ageIsfocused = false;
let passwordIsfocused = false;
let repasswordIsfocused = false;

function validateName() {
  if (nameIsfocused) {
    if (nameRegex.test(nameInput.value)) {
      nameInput.nextElementSibling.classList.add("d-none");
      return true;
    } else {
      nameInput.nextElementSibling.classList.remove("d-none");
      return false;
    }
  }
}

function validateEmail() {
  if (emailIsfocused) {
    if (emailRegex.test(emailInput.value)) {
      emailInput.nextElementSibling.classList.add("d-none");
      return true;
    } else {
      emailInput.nextElementSibling.classList.remove("d-none");
      return false;
    }
  }
}

function validatePhone() {
  if (phoneIsfocused) {
    if (phoneRegex.test(phoneInput.value)) {
      phoneInput.nextElementSibling.classList.add("d-none");
      return true;
    } else {
      phoneInput.nextElementSibling.classList.remove("d-none");
      return false;
    }
  }
}

function validateAge() {
  if (ageIsfocused) {
    if (ageRegex.test(ageInput.value)) {
      ageInput.nextElementSibling.classList.add("d-none");
      return true;
    } else {
      ageInput.nextElementSibling.classList.remove("d-none");
      return false;
    }
  }
}

function validatePassword() {
  if (passwordIsfocused) {
    if (passwordRegex.test(passwordInput.value)) {
      passwordInput.nextElementSibling.classList.add("d-none");
      return true;
    } else {
      passwordInput.nextElementSibling.classList.remove("d-none");
      return false;
    }
  }
}

function validateRepassword() {
  if (repasswordIsfocused) {
    if (passwordInput.value === repasswordInput.value) {
      repasswordInput.nextElementSibling.classList.add("d-none");
      return true;
    } else {
      repasswordInput.nextElementSibling.classList.remove("d-none");
      return false;
    }
  }
}

function validateAll() {
  if (
    validateName() &&
    validateEmail() &&
    validatePhone() &&
    validateAge() &&
    validatePassword() &&
    validateRepassword()
  ) {
    submitBtn.classList.remove("disabled");
  } else {
    submitBtn.classList.add("disabled");
  }
}

//* Events
$("#search").on("click", function () {
  displaySearch();
  close();
});

$("#categories").on("click", function () {
  getCategories();
  close();
});

$("#area").on("click", function () {
  getAreas();
  close();
});

$("#ingredients").on("click", function () {
  getIngredients();
  close();
});

$("#contact").on("click", function () {
  displayContact();
  close();
});

// * sidebar
function close() {
  $(".sidebar").animate({ left: `-${hiddenBarWidth}px` }, 500);
  $(".open-and-close").removeClass("fa-xmark").addClass("fa-bars");
  sideIsOpen = false;
  $(".side-links li").animate({ top: "400px" }, 500);
}

const hiddenBarWidth = $(".side-hidden").outerWidth();
close();

$(".open-and-close").on("click", function () {
  if (sideIsOpen === true) {
    close();
  } else {
    $(".sidebar").animate({ left: "0px" }, 500);
    $(".open-and-close").removeClass("fa-bars").addClass("fa-xmark");
    sideIsOpen = true;
    let duration = 500;
    for (let i = 1; i <= 5; i++) {
      $(`.side-links li:nth-child(${i})`).animate(
        { top: "0px" },
        (duration += 100)
      );
    }
  }
});

// * loading
function showLoading() {
  $(".loading").fadeIn(0, function () {
    $("body").css({ overflow: "hidden" });
  });
}

function hideLoading() {
  jQuery(function () {
    $(".loading").fadeOut(2000, function () {
      $("body").css({ overflow: "auto" });
    });
  });
}
