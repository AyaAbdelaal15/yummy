let details = document.getElementById("details");
let search = document.getElementById("search");

$(document).ready(() => {
    searchByName("").then(() => {
        $(".loading-screen").fadeOut(500)
        $("body").css("overflow", "visible")
    })
})
function openSideNav() {
    $(".side-nav-menu").animate({
        left: 0
    }, 500)
    $(".open-close-icon").removeClass("fa-bars");
    $(".open-close-icon").addClass("fa-x");
    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i+5) * 100)
    }
}

function closeSideNav() {
    let navMenu = $(".side-nav-menu .nav-tab").outerWidth()
    $(".side-nav-menu").animate({
        left: -navMenu
    }, 500)
    $(".open-close-icon").removeClass("fa-x");
    $(".open-close-icon").addClass("fa-bars");
    $(".links li").animate({
        top: 300
    }, 500)
}
closeSideNav()

$(".side-nav-menu i.open-close-icon").click(() => {
    if ($(".side-nav-menu").css("left") == "0px") {
        closeSideNav()
    } else {
        openSideNav()
    }
})

async function getMealDetails(meal) {
    details.innerHTML = ""
    search.innerHTML = "";
    $(".loading-screen").fadeIn(300)
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal}`);
    respone = await respone.json();
    displayMealDetails(respone.meals[0])
    $(".loading-screen").fadeOut(300)
}

function displayMealDetails(meal) {
    search.innerHTML = "";
    let ingredients = ``
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    let tags = meal.strTags?.split(",")
    if (!tags)
        {tags = [] }
    let Str_tags = ''
    for (let i = 0; i < tags.length; i++) {
        Str_tags += 
        `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }
    let cartoona =
     `      <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="meal">
                <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>
                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${Str_tags}
                </ul>
                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    details.innerHTML = cartoona
}

function displayMeals(meal) {
    let cartoona = "";
    for (let i = 0; i < meal.length; i++) {
        cartoona += 
        `<div class="col-md-3">
                <div onclick="getMealDetails('${meal[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${meal[i].strMealThumb}" alt="meals">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${meal[i].strMeal}</h3>
                    </div>
                </div>
        </div> `
    }
    details.innerHTML = cartoona
}

async function getCategories() {
    details.innerHTML = ""
    search.innerHTML = "";
    $(".loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    response = await response.json()
    displayCategories(response.categories)
    $(".loading-screen").fadeOut(300)
}

async function getCategoryMeals(category) {
    details.innerHTML = ""
    $(".loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    response = await response.json()
    displayMeals(response.meals.slice(0,20))
    $(".loading-screen").fadeOut(300)
}

function displayCategories(list) {
    let cartoona = "";
    for (let i = 0; i < list.length; i++) {
        cartoona += 
        `<div class="col-md-3">
                <div onclick="getCategoryMeals('${list[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${list[i].strCategoryThumb}" alt="meal">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${list[i].strCategory}</h3>
                        <p>${list[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>
                </div>
        </div>`
    }
    details.innerHTML = cartoona
}

async function getArea() {
    details.innerHTML = ""
    search.innerHTML = "";
    $(".loading-screen").fadeIn(300)
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    respone = await respone.json()
    displayArea(respone.meals)
    $(".loading-screen").fadeOut(300)
}
async function getAreaMeals(area) {
    details.innerHTML = ""
    $(".loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
    $(".loading-screen").fadeOut(300)
}
function displayArea(list) {
    let cartoona = "";
    for (let i = 0; i < list.length; i++) {
        cartoona += 
        `<div class="col-md-3">
                <div onclick="getAreaMeals('${list[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                    <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h3>${list[i].strArea}</h3>
                </div>
        </div>`
    }
    details.innerHTML = cartoona
}

async function getIngredients() {
    details.innerHTML = ""
    search.innerHTML = "";
    $(".loading-screen").fadeIn(300)
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    respone = await respone.json()
    displayIngredients(respone.meals.slice(0, 20))
    $(".loading-screen").fadeOut(300)
}
async function getIngredientsMeals(ingredients) {
    details.innerHTML = ""
    $(".loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
    $(".loading-screen").fadeOut(300)
}
function displayIngredients(list) {
    let cartoona = "";
    for (let i = 0; i < list.length; i++) {
        cartoona += 
        `<div class="col-md-3">
                <div onclick="getIngredientsMeals('${list[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${list[i].strIngredient}</h3>
                        <p>${list[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>`
    }
    details.innerHTML = cartoona
}



function showSearchInputs() {
    search.innerHTML = 
    `<div class="row py-4">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`
    details.innerHTML = ""
}

async function searchByName(name) {
    details.innerHTML = ""
    $(".loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    response = await response.json()
    response.meals? displayMeals(response.meals) : displayMeals([])
    $(".loading-screen").fadeOut(300)
}

async function searchByLetter(firstLetter) {
    details.innerHTML = ""
    $(".loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${firstLetter}`)
    response = await response.json()
    response.meals? displayMeals(response.meals) : displayMeals([])
    $(".loading-screen").fadeOut(300)
}

function showContacts() {
    details.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control" placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="tel" class="form-control" placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control" placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `

    let submitBtn = document.getElementById("submitBtn")
    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInput = true
    })
    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInput = true
    })
    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInput = true
    })
    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInput = true
    })
    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInput = true
    })
    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInput = true
    })
}

let nameInput;
let emailInput;
let phoneInput;
let ageInput ;
let passwordInput;
let repasswordInput ;

function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
    return (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
    return (/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4,6})$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9])$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}


function inputsValidation() {
    if (nameInput) {
        if (nameValidation() == true) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")

        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")

        }
    }
    if (emailInput) {

        if (emailValidation() == true) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")

        }
    }
    if (phoneInput) {
        if (phoneValidation() == true) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

        }
    }
    if (ageInput) {
        if (ageValidation() == true) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")

        }
    }
    if (passwordInput) {
        if (passwordValidation() == true) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

        }
    }
    if (repasswordInput) {
        if (repasswordValidation() == true) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

        }
    }
    if (nameValidation() == true && emailValidation() == true && phoneValidation() == true && ageValidation() == true && passwordValidation() == true && repasswordValidation() == true) 
    {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}

