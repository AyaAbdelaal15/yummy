let details = document.getElementById("details");
let search = document.getElementById("search");

/* ==========================
   Initial Loading
========================== */

$(document).ready(() => {
  searchByName("").finally(() => {
    $(".loading-screen").fadeOut(500);

    $("body").css("overflow", "visible");
  });
});

/* ==================================================
   Navigation
================================================== */

function openSideNav() {
  if (window.innerWidth <= 767) {
    $(".nav-tab").addClass("mobile-nav-open");

    $(".open-close-icon").removeClass("fa-bars").addClass("fa-x");
  } else {
    $(".side-nav-menu").animate(
      {
        left: 0,
      },
      500,
    );

    $(".open-close-icon").removeClass("fa-bars").addClass("fa-x");

    for (let i = 0; i < 5; i++) {
      $(".links li")
        .eq(i)
        .animate(
          {
            top: 0,
          },
          (i + 5) * 100,
        );
    }
  }
}

function closeSideNav() {
  if (window.innerWidth <= 767) {
    $(".nav-tab").removeClass("mobile-nav-open");

    $(".open-close-icon").removeClass("fa-x").addClass("fa-bars");
  } else {
    let navMenuWidth = $(".side-nav-menu .nav-tab").outerWidth();

    $(".side-nav-menu").animate(
      {
        left: -navMenuWidth,
      },
      500,
    );

    $(".open-close-icon").removeClass("fa-x").addClass("fa-bars");

    $(".links li").animate(
      {
        top: 300,
      },
      500,
    );
  }
}

/* ==========================
   Initial Navigation State
========================== */

if (window.innerWidth <= 767) {
  $(".side-nav-menu").css({
    left: 0,
  });

  $(".nav-tab").removeClass("mobile-nav-open");

  $(".open-close-icon").removeClass("fa-x").addClass("fa-bars");
} else {
  closeSideNav();
}

/* ==========================
   Open / Close Button
========================== */

$(".open-close-icon").click(function () {
  if (window.innerWidth <= 767) {
    if ($(".nav-tab").hasClass("mobile-nav-open")) {
      closeSideNav();
    } else {
      openSideNav();
    }
  } else {
    if ($(".side-nav-menu").css("left") === "0px") {
      closeSideNav();
    } else {
      openSideNav();
    }
  }
});

/* ==========================
   Resize
========================== */

$(window).on("resize", function () {
  if (window.innerWidth <= 767) {
    $(".side-nav-menu").css({
      left: 0,
    });

    /*
           Every time we enter mobile,
           menu starts closed.
        */

    $(".nav-tab").removeClass("mobile-nav-open");

    $(".open-close-icon").removeClass("fa-x").addClass("fa-bars");
  } else {
    $(".nav-tab").removeClass("mobile-nav-open");

    let navMenuWidth = $(".side-nav-menu .nav-tab").outerWidth();

    $(".side-nav-menu").css({
      left: -navMenuWidth,
    });

    $(".links li").css({
      top: 300,
    });

    $(".open-close-icon").removeClass("fa-x").addClass("fa-bars");
  }
});

/* ==================================================
   Meal Details
================================================== */

async function getMealDetails(meal) {
  details.innerHTML = "";

  search.innerHTML = "";

  $(".loading-screen").fadeIn(300);

  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch meal details");
    }

    response = await response.json();

    if (response.meals) {
      displayMealDetails(response.meals[0]);
    }
  } catch (error) {
    console.log(error);
  } finally {
    $(".loading-screen").fadeOut(300);
  }
}

/* ==========================
   Display Meal Details
========================== */

function displayMealDetails(meal) {
  search.innerHTML = "";

  let ingredients = "";

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `

                <li class="alert alert-info m-2 p-1">

                    ${meal[`strMeasure${i}`] || ""}

                    ${meal[`strIngredient${i}`]}

                </li>

            `;
    }
  }

  let tags = meal.strTags?.split(",") || [];

  let Str_tags = "";

  for (let i = 0; i < tags.length; i++) {
    Str_tags += `

            <li class="alert alert-danger m-2 p-1">

                ${tags[i]}

            </li>

        `;
  }

  let sourceButton = "";

  if (meal.strSource) {
    sourceButton = `

            <a
                target="_blank"
                href="${meal.strSource}"
                class="btn btn-success"
            >
                Source
            </a>

        `;
  }

  let youtubeButton = "";

  if (meal.strYoutube) {
    youtubeButton = `

            <a
                target="_blank"
                href="${meal.strYoutube}"
                class="btn btn-danger"
            >
                Youtube
            </a>

        `;
  }

  let cartoona = `

        <div class="col-md-4">

            <img
                class="w-100 rounded-3"
                src="${meal.strMealThumb}"
                alt="meal"
            >

            <h2>
                ${meal.strMeal}
            </h2>

        </div>


        <div class="col-md-8">

            <h2>
                Instructions
            </h2>

            <p>
                ${meal.strInstructions}
            </p>


            <h3>

                <span class="fw-bolder">
                    Area :
                </span>

                ${meal.strArea}

            </h3>


            <h3>

                <span class="fw-bolder">
                    Category :
                </span>

                ${meal.strCategory}

            </h3>


            <h3>
                Recipes :
            </h3>


            <ul class="list-unstyled d-flex g-3 flex-wrap">

                ${ingredients}

            </ul>


            <h3>
                Tags :
            </h3>


            <ul class="list-unstyled d-flex g-3 flex-wrap">

                ${Str_tags}

            </ul>


            ${sourceButton}

            ${youtubeButton}

        </div>

    `;

  details.innerHTML = cartoona;
}

/* ==================================================
   Display Meals
================================================== */

function displayMeals(meal) {
  let cartoona = "";

  for (let i = 0; i < meal.length; i++) {
    cartoona += `

            <div class="col-md-3">

                <div
                    onclick="getMealDetails('${meal[i].idMeal}')"
                    class="meal position-relative overflow-hidden rounded-2 cursor-pointer"
                >

                    <img
                        class="w-100"
                        src="${meal[i].strMealThumb}"
                        alt="meal"
                    >


                    <div class="meal-layer">

                        <h3>
                            ${meal[i].strMeal}
                        </h3>

                    </div>

                </div>

            </div>

        `;
  }

  details.innerHTML = cartoona;
}

/* ==================================================
   Categories
================================================== */

async function getCategories() {
  details.innerHTML = "";

  search.innerHTML = "";

  $(".loading-screen").fadeIn(300);

  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/categories.php`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    response = await response.json();

    displayCategories(response.categories);
  } catch (error) {
    console.log(error);
  } finally {
    $(".loading-screen").fadeOut(300);
  }
}

/* ==========================
   Category Meals
========================== */

async function getCategoryMeals(category) {
  details.innerHTML = "";

  $(".loading-screen").fadeIn(300);

  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch category meals");
    }

    response = await response.json();

    if (response.meals) {
      displayMeals(response.meals.slice(0, 20));
    } else {
      displayMeals([]);
    }
  } catch (error) {
    console.log(error);

    displayMeals([]);
  } finally {
    $(".loading-screen").fadeOut(300);
  }
}

/* ==========================
   Display Categories
========================== */

function displayCategories(list) {
  let cartoona = "";

  for (let i = 0; i < list.length; i++) {
    let description = list[i].strCategoryDescription
      ? list[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")
      : "";

    cartoona += `

            <div class="col-md-3">

                <div
                    onclick="getCategoryMeals('${list[i].strCategory}')"
                    class="meal position-relative overflow-hidden rounded-2 cursor-pointer"
                >

                    <img
                        class="w-100"
                        src="${list[i].strCategoryThumb}"
                        alt="category"
                    >


                    <div class="meal-layer">

                        <div>

                            <h3>
                                ${list[i].strCategory}
                            </h3>

                            <p>
                                ${description}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        `;
  }

  details.innerHTML = cartoona;
}

/* ==================================================
   Area
================================================== */

async function getArea() {
  details.innerHTML = "";

  search.innerHTML = "";

  $(".loading-screen").fadeIn(300);

  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?a=list`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch areas");
    }

    response = await response.json();

    displayArea(response.meals);
  } catch (error) {
    console.log(error);
  } finally {
    $(".loading-screen").fadeOut(300);
  }
}

/* ==========================
   Area Meals
========================== */

async function getAreaMeals(area) {
  details.innerHTML = "";

  $(".loading-screen").fadeIn(300);

  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(area)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch area meals");
    }

    response = await response.json();

    console.log("Area:", area);
    console.log("Meals:", response.meals);

    if (response.meals) {
      displayMeals(response.meals.slice(0, 20));
    } else {
      details.innerHTML = `

                <div class="col-12 text-center">

                    <h2>
                        No meals found
                    </h2>

                </div>

            `;
    }
  } catch (error) {
    console.log(error);

    details.innerHTML = `

            <div class="col-12 text-center">

                <h2>
                    Something went wrong
                </h2>

            </div>

        `;
  } finally {
    $(".loading-screen").fadeOut(300);
  }
}

/* ==========================
   Display Area
========================== */

function displayArea(list) {
  let cartoona = "";

  for (let i = 0; i < list.length; i++) {
    cartoona += `

            <div class="col-md-3">

                <div
                    onclick="getAreaMeals('${list[i].strArea}')"
                    class="rounded-2 text-center cursor-pointer"
                >

                    <i class="fa-solid fa-house-laptop fa-4x"></i>

                    <h3>
                        ${list[i].strArea}
                    </h3>

                </div>

            </div>

        `;
  }

  details.innerHTML = cartoona;
}

/* ==================================================
   Ingredients
================================================== */

async function getIngredients() {
  details.innerHTML = "";

  search.innerHTML = "";

  $(".loading-screen").fadeIn(300);

  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?i=list`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch ingredients");
    }

    response = await response.json();

    displayIngredients(response.meals.slice(0, 20));
  } catch (error) {
    console.log(error);
  } finally {
    $(".loading-screen").fadeOut(300);
  }
}

/* ==========================
   Ingredient Meals
========================== */

async function getIngredientsMeals(ingredient) {
  details.innerHTML = "";

  $(".loading-screen").fadeIn(300);

  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch ingredient meals");
    }

    response = await response.json();

    if (response.meals) {
      displayMeals(response.meals.slice(0, 20));
    } else {
      displayMeals([]);
    }
  } catch (error) {
    console.log(error);

    displayMeals([]);
  } finally {
    $(".loading-screen").fadeOut(300);
  }
}

/* ==========================
   Display Ingredients
========================== */

function displayIngredients(list) {
  let cartoona = "";

  for (let i = 0; i < list.length; i++) {
    let description = list[i].strDescription
      ? list[i].strDescription.split(" ").slice(0, 20).join(" ")
      : "";

    cartoona += `

            <div class="col-md-3">

                <div
                    onclick="getIngredientsMeals('${list[i].strIngredient}')"
                    class="rounded-2 text-center cursor-pointer"
                >

                    <i class="fa-solid fa-drumstick-bite fa-4x"></i>

                    <h3>
                        ${list[i].strIngredient}
                    </h3>

                    <p>
                        ${description}
                    </p>

                </div>

            </div>

        `;
  }

  details.innerHTML = cartoona;
}

/* ==================================================
   Search
================================================== */

function showSearchInputs() {
  search.innerHTML = `

        <div class="row py-4 ">

            <div class="col-md-6 mb-4">

                <input
                    onkeyup="searchByName(this.value)"
                    class="form-control bg-transparent text-white"
                    type="text"
                    placeholder="Search By Name"
                >

            </div>


            <div class="col-md-6">

                <input
                    onkeyup="searchByLetter(this.value)"
                    maxlength="1"
                    class="form-control bg-transparent text-white"
                    type="text"
                    placeholder="Search By First Letter"
                >

            </div>

        </div>

    `;

  details.innerHTML = "";
}

/* ==========================
   Search By Name
========================== */

async function searchByName(name) {
  details.innerHTML = "";

  $(".loading-screen").fadeIn(300);

  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(name)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to search meals");
    }

    response = await response.json();

    if (response.meals) {
      displayMeals(response.meals);
    } else {
      displayMeals([]);
    }
  } catch (error) {
    console.log(error);

    displayMeals([]);
  } finally {
    $(".loading-screen").fadeOut(300);
  }
}

/* ==========================
   Search By First Letter
========================== */

async function searchByLetter(firstLetter) {
  details.innerHTML = "";

  $(".loading-screen").fadeIn(300);

  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${encodeURIComponent(firstLetter)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to search meals");
    }

    response = await response.json();

    if (response.meals) {
      displayMeals(response.meals);
    } else {
      displayMeals([]);
    }
  } catch (error) {
    console.log(error);

    displayMeals([]);
  } finally {
    $(".loading-screen").fadeOut(300);
  }
}

/* ==================================================
   Contact Us
================================================== */

function showContacts() {
  details.innerHTML = `

        <div class="contact min-vh-100 d-flex
                    justify-content-center align-items-center">

            <div class="container w-75 text-center">

                <div class="row g-4">


                    <!-- Name -->

                    <div class="col-md-6">

                        <input
                            id="nameInput"
                            onkeyup="inputsValidation()"
                            type="text"
                            class="form-control"
                            placeholder="Enter Your Name"
                        >

                        <div
                            id="nameAlert"
                            class="alert alert-danger w-100 mt-2 d-none"
                        >
                            Special characters and numbers not allowed
                        </div>

                    </div>


                    <!-- Email -->

                    <div class="col-md-6">

                        <input
                            id="emailInput"
                            onkeyup="inputsValidation()"
                            type="email"
                            class="form-control"
                            placeholder="Enter Your Email"
                        >

                        <div
                            id="emailAlert"
                            class="alert alert-danger w-100 mt-2 d-none"
                        >
                            Email not valid *exemple@yyy.zzz
                        </div>

                    </div>


                    <!-- Phone -->

                    <div class="col-md-6">

                        <input
                            id="phoneInput"
                            onkeyup="inputsValidation()"
                            type="tel"
                            class="form-control"
                            placeholder="Enter Your Phone"
                        >

                        <div
                            id="phoneAlert"
                            class="alert alert-danger w-100 mt-2 d-none"
                        >
                            Enter valid Phone Number
                        </div>

                    </div>


                    <!-- Age -->

                    <div class="col-md-6">

                        <input
                            id="ageInput"
                            onkeyup="inputsValidation()"
                            type="number"
                            class="form-control"
                            placeholder="Enter Your Age"
                        >

                        <div
                            id="ageAlert"
                            class="alert alert-danger w-100 mt-2 d-none"
                        >
                            Enter valid age
                        </div>

                    </div>


                    <!-- Password -->

                    <div class="col-md-6">

                        <input
                            id="passwordInput"
                            onkeyup="inputsValidation()"
                            type="password"
                            class="form-control"
                            placeholder="Enter Your Password"
                        >

                        <div
                            id="passwordAlert"
                            class="alert alert-danger w-100 mt-2 d-none"
                        >
                            Enter valid password
                            *Minimum eight characters,
                            at least one letter and one number:*
                        </div>

                    </div>


                    <!-- Repassword -->

                    <div class="col-md-6">

                        <input
                            id="repasswordInput"
                            onkeyup="inputsValidation()"
                            type="password"
                            class="form-control"
                            placeholder="Repassword"
                        >

                        <div
                            id="repasswordAlert"
                            class="alert alert-danger w-100 mt-2 d-none"
                        >
                            Enter valid repassword
                        </div>

                    </div>

                </div>


                <button
                    id="submitBtn"
                    disabled
                    class="btn btn-outline-danger px-2 mt-3"
                >
                    Submit
                </button>

            </div>

        </div>

    `;

  document.getElementById("nameInput").addEventListener("focus", () => {
    nameInput = true;
  });

  document.getElementById("emailInput").addEventListener("focus", () => {
    emailInput = true;
  });

  document.getElementById("phoneInput").addEventListener("focus", () => {
    phoneInput = true;
  });

  document.getElementById("ageInput").addEventListener("focus", () => {
    ageInput = true;
  });

  document.getElementById("passwordInput").addEventListener("focus", () => {
    passwordInput = true;
  });

  document.getElementById("repasswordInput").addEventListener("focus", () => {
    repasswordInput = true;
  });
}

/* ==================================================
   Validation
================================================== */

let nameInput;
let emailInput;
let phoneInput;
let ageInput;
let passwordInput;
let repasswordInput;

function nameValidation() {
  return /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);
}

function emailValidation() {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    document.getElementById("emailInput").value,
  );
}

function phoneValidation() {
  return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4,6})$/.test(
    document.getElementById("phoneInput").value,
  );
}

function ageValidation() {
  return /^(0?[1-9]|[1-9][0-9])$/.test(
    document.getElementById("ageInput").value,
  );
}

function passwordValidation() {
  return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(
    document.getElementById("passwordInput").value,
  );
}

function repasswordValidation() {
  return (
    document.getElementById("repasswordInput").value ===
    document.getElementById("passwordInput").value
  );
}

function inputsValidation() {
  if (nameInput) {
    if (nameValidation()) {
      document
        .getElementById("nameAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("nameAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (emailInput) {
    if (emailValidation()) {
      document
        .getElementById("emailAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("emailAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (phoneInput) {
    if (phoneValidation()) {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (ageInput) {
    if (ageValidation()) {
      document
        .getElementById("ageAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("ageAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (passwordInput) {
    if (passwordValidation()) {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (repasswordInput) {
    if (repasswordValidation()) {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  let submitBtn = document.getElementById("submitBtn");

  if (!submitBtn) {
    return;
  }

  if (
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}
