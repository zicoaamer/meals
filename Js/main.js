//Global Variables 
let allData = document.getElementById("allData");

//Loading page function
$(document).ready(() => {
    $(".loadingPage").fadeOut(500);
    displayMealsOnHomePage();
});
$(".leftSide .hiddenItems .goToHome").click(()=>{
    displayMealsOnHomePage();
    closeSideBar();
    $(".search").addClass("hide");
    $(".contact").addClass("hide");
});
$(".drawer .logo img").click(()=>{
    displayMealsOnHomePage();
    closeSideBar();
    $(".search").addClass("hide");
    $(".contact").addClass("hide");
});
//--------------------------------------------------------------------------------
function closeSideBar(){
    $(".leftSide").animate({"left": "-300px"} , 500);
    $(".leftSide .drawer .menuIcon i").removeClass("fa-xmark");
    $(".leftSide .drawer .menuIcon i").addClass("open-close-icon fa-align-justify");
    $(".leftSide .hiddenItems .list-unstyled li").animate({top:150});
}
//Menu Click Function 
$(".leftSide .drawer .menuIcon").click(function(){
    let leftPosition = $(".leftSide").css("left");
    if (leftPosition == "-300px") {
        $(".leftSide").animate({"left": "0px"} , 500);
        $(".leftSide .drawer .menuIcon i").removeClass("open-close-icon fa-align-justify");
        $(".leftSide .drawer .menuIcon i").addClass("fa-xmark");
        for (let i = 0; i < 6; i++) {
            $(".leftSide .hiddenItems .list-unstyled li").eq(i).animate({
                "top": "0px"
            }, (i + 5) * 100);
        }
    } else {
        closeSideBar()
    }
});
//--------------------------------------------------------------------------------
//Show all meals
function displayMeals(meals) {
    let mealsContainer = ``;

    if (meals) {
        for (let i = 0; i < meals.length; i++) {
            mealsContainer += `
            <div class="col-md-3">
                <div onclick="getMealDetails('${meals[i].idMeal}')" class="boxImage clickable position-relative rounded-2">
                    <img class="w-100" src="${meals[i].strMealThumb}" alt="${meals[i].strMeal}">
                    <div class="boxContent">
                        <p class="ps-3">${meals[i].strMeal}</p>
                    </div>
                </div>
            </div>
            `;
        }
    } else {
        mealsContainer = "<p>No meals found.</p>";
    }

    allData.innerHTML = mealsContainer;
}

//display Meals In Home Page 
async function displayMealsOnHomePage() {
    allData.innerHTML = "";
    let apiLink = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
    apiLink = await apiLink.json();
    displayMeals(apiLink.meals);

}
//--------------------------------------------------------------------------------
//Show Details For Every Meal
async function getMealDetails(id) {
    allData.innerHTML = "";
    $(".loadingPage").fadeIn(300);

    let apiLink = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    apiLink = await apiLink.json();

    displayMealDetails(apiLink.meals[0]);
    $(".loadingPage").fadeOut(300);

}

function displayMealDetails(meal) {
    $(".search").addClass("hide");
    $(".contact").addClass("hide");
    let ingredients = ``
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
        }
    }
    let tags = meal.strTags?.split(",")
    if (!tags) tags = [];

    let tagz = '';
    for (let i = 0; i < tags.length; i++) {
        tagz += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
    }
    let container = `
            <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
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
                    ${tagz}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`;

    allData.innerHTML = container;
}

//--------------------------------------------------------------------------------
//Display Catgeories and then display meals for every category
$(".leftSide .hiddenItems .goToCat").click(()=>{
    getStrCategory();
    closeSideBar();
    $(".search").addClass("hide");
    $(".contact").addClass("hide");
});
async function getStrCategory() {
    allData.innerHTML = "";
   $(".loadingPage").fadeIn(300);

    let apiLink = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    apiLink = await apiLink.json();

    displayCategories(apiLink.categories);
   $(".loadingPage").fadeOut(300);

}
function displayCategories(cats) {
    let catContainer = "";

    for (let i = 0; i < cats.length; i++) {
        catContainer +=`
        <div class="col-md-3">
            <div onclick="getCategoryMeals('${cats[i].strCategory}')" class="boxImage clickable position-relative rounded-2">
                <img class="w-100" src="${cats[i].strCategoryThumb}" alt="${cats[i].strCategory}">
                <div class="boxContent d-flex flex-column justify-content-center px-3 text-center">
                    <p class="fs-6">${cats[i].strCategory}</p>
                    <p class="fs-6 fw-light">${cats[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
            </div>
        </div>`;

    }
    allData.innerHTML = catContainer;
}
async function getCategoryMeals(category) {
    allData.innerHTML = "";
   $(".loadingPage").fadeIn(300);

    let apiLink = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    apiLink = await apiLink.json();

    displayMeals(apiLink.meals.slice(0, 20));
   $(".loadingPage").fadeOut(300);

}

//--------------------------------------------------------------------------------
//Area Section
$(".leftSide .hiddenItems .goToArea").click(()=>{
    getArea();
    closeSideBar();
    $(".search").addClass("hide");
    $(".contact").addClass("hide");
});
async function getArea() {
    allData.innerHTML = ""
   $(".loadingPage").fadeIn(300)

    let apiLink = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    apiLink = await apiLink.json()
    console.log(apiLink.meals);

    displayArea(apiLink.meals)
   $(".loadingPage").fadeOut(300)

}
async function getAreaMeals(area) {
    allData.innerHTML = ""
   $(".loadingPage").fadeIn(300)

    let apiLink = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    apiLink = await apiLink.json()


    displayMeals(apiLink.meals.slice(0, 20))
   $(".loadingPage").fadeOut(300)

}
function displayArea(area) {
    let container = "";
    $(".search").addClass("hide");
    for (let i = 0; i < area.length; i++) {
        container += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${area[i].strArea}')" class="clickable rounded-2 text-center">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${area[i].strArea}</h3>
                </div>
        </div>
        `
    }

    allData.innerHTML = container;
}
//--------------------------------------------------------------------------------
//Display All Ingredients
$(".leftSide .hiddenItems .goTOIng").click(()=>{
    getIngredients();
    closeSideBar();
    $(".search").addClass("hide");
    $(".contact").addClass("hide");

});
function displayIngredients(ings) {
    let container = "";

    $(".search").addClass("hide");
    $(".contact").addClass("hide");

    for (let i = 0; i < ings.length; i++) {
        container += `
            <div class="col-md-3">
                    <div onclick="getIngredientsMeals('${ings[i].strIngredient}')" class="clickable rounded-2 text-center">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${ings[i].strIngredient}</h3>
                        <p>${ings[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>
            </div>
        `;
    }

    allData.innerHTML = container;
}
async function getIngredients() {
    allData.innerHTML = "";
   $(".loadingPage").fadeIn(300);

    let apiLink = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    apiLink = await apiLink.json();

    displayIngredients(apiLink.meals.slice(0, 20));
   $(".loadingPage").fadeOut(300);

}
async function getIngredientsMeals(ingredients) {
    allData.innerHTML = "";
   $(".loadingPage").fadeIn(300);

    let apiLink = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
    apiLink = await apiLink.json();

    displayMeals(apiLink.meals.slice(0, 20));
    $(".loadingPage").fadeOut(300);

}
//--------------------------------------------------------------------------------
//Search Page
$(".leftSide .hiddenItems .goToSearch").click(()=>{
    allData.innerHTML = "";
    closeSideBar();
    $(".search").removeClass("hide");
    $(".contact").addClass("hide");
});
async function searchLetter(letter){
    allData.innerHTML = "";
    $(".loadingPage").fadeIn(250);
    
    letter == "" ? letter = "a" : "";
    let srchLetter = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    srchLetter = await srchLetter.json();

    displayMeals(srchLetter.meals);

    $(".loadingPage").fadeOut(250);
}
async function searchName(name) {
    $(".loadingPage").fadeIn(250);
    allData.innerHTML = "";
    let srchName = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    srchName = await srchName.json();
    displayMeals(srchName.meaks);
    $(".loadingPage").fadeOut(250);

}
//------------------------------------------------------------------------------
//Contact Us
$(".leftSide .hiddenItems .goToContact").click(()=>{
    allData.innerHTML = "";
    closeSideBar();
    $(".search").addClass("hide");
    $(".contact").removeClass("hide");
});

//Validation 
function inputsValidation() {
    // Get input values
    const nameInput = document.getElementById("nameId").value;
    const emailInput = document.getElementById("emailId").value;
    const numberInput = document.getElementById("numberId").value;
    const ageInput = document.getElementById("ageId").value;
    const passInput = document.getElementById("passId").value;
    const repassInput = document.getElementById("repassId").value;
    const submitButton = document.querySelector(".btn-danger");

    // Regex for validation
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^\S+@\S+\.\S+$/; 
    const numberRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    // Validate name
    if (nameInput !== "" && !nameRegex.test(nameInput)) {
        document.getElementById("nameWarn").classList.remove("d-none");
    } else {
        document.getElementById("nameWarn").classList.add("d-none");
    }

    // Validate email
    if (emailInput !== "" && !emailRegex.test(emailInput)) {
        document.getElementById("emailWarn").classList.remove("d-none");
    } else {
        document.getElementById("emailWarn").classList.add("d-none");
    }

    // Validate phone number
    if (numberInput !== "" && !numberRegex.test(numberInput)) {
        document.getElementById("numberWarn").classList.remove("d-none");
    } else {
        document.getElementById("numberWarn").classList.add("d-none");
    }

    // Validate age
    if (ageInput !== "" && (isNaN(ageInput) || ageInput < 1 || ageInput > 150)) {
        document.getElementById("ageWarn").classList.remove("d-none");
    } else {
        document.getElementById("ageWarn").classList.add("d-none");
    }

    // Validate password
    if (passInput !== "" && !passRegex.test(passInput)) {
        document.getElementById("passWarn").classList.remove("d-none");
    } else {
        document.getElementById("passWarn").classList.add("d-none");
    }

    // Validate repassword
    if (repassInput !== "" && repassInput !== passInput) {
        document.getElementById("rePassWarn").classList.remove("d-none");
    } else {
        document.getElementById("rePassWarn").classList.add("d-none");
    }

    // Enable the submit button if all validations passed
    if (
        nameRegex.test(nameInput) &&
        emailRegex.test(emailInput) &&
        numberRegex.test(numberInput) &&
        !isNaN(ageInput) &&
        ageInput >= 1 &&
        ageInput <= 150 &&
        passRegex.test(passInput) &&
        repassInput === passInput
    ) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}
function passingData(){
    $(".dataIsCorrect").removeClass("hide");
}