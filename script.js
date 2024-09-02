// declare variables and store elements
const sidebarStep = document.querySelectorAll('.indicator-num');
const formStep = document.querySelectorAll('.step');
const form = document.getElementById('form');
const planCards = document.querySelectorAll('.plan-card');
const addsonCards = document.querySelectorAll('.addon-card');
const changePlanBtn = document.getElementById('change-plan');
// empty object to store selected plan, price and duration
let selectedPlan = {};
// function for storing selected add-on plan
const selectedAddsOn = () => {
  // create emplty array to store plan details
  let addOnArr = [];
  // loop add-on card to find selected add-on cards
  addsonCards.forEach((card) => {
    let price = card.querySelector('.subscription-price').textContent;
    let name = card.querySelector('.card-name').textContent;
    let planDur = card.querySelector('.subscription-duration').textContent;
    if (card.classList.contains('selected')) {
      addOnArr.push({
        price,
        name,
        planDur,
      });
    }
  });
  return addOnArr;
};

// plan prices
const monthlyPlanPrices = [9, 12, 15];
const yearlyPlanPrices = [90, 120, 150];
const monthlyAdsOnPrice = [1, 2, 2];
const yearlyAdsOnPrice = [10, 20, 20];

// function to change price and duration of the given card
const setplan = (card, price, duration) => {
  card.forEach((card, i) => {
    card.querySelector('.subscription-price').textContent = `${price[i]}`;
    card.querySelector('.subscription-duration').textContent = `${duration}`;
  });
};

// set default price and duration of cards
setplan(planCards, monthlyPlanPrices, 'mo');
setplan(addsonCards, monthlyAdsOnPrice, 'mo');


const nextBtn = document.getElementById('next-button');
const prevBtn = document.getElementById('prev-button');

// step number
let stepNum = 0;

// declare function for show warning text when plan not selected and next button pressed
const selectPlanError = (text) => {
  document.getElementById('select-plan-error').textContent = text;
};

// handle next step button
nextBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (stepNum === 0) {
    // form validation
    if (!formValidation()) return;
    stepNum++;
    showStep(stepNum);
  } else if (stepNum === 1) {
    if (Object.entries(selectedPlan).length === 0) {
      return selectPlanError('Please select a plan');
    }
    stepNum++;
    showStep(stepNum);
  } else if (stepNum === 2) {
    renderTotal();
    stepNum++;
    showStep(stepNum);
  } else if (stepNum === 3) {
    stepNum++;
    showStep(stepNum);
  } else return;
});

// handle previous step button
prevBtn.addEventListener('click', (e) => {
  e.preventDefault();
  stepNum--;
  return showStep(stepNum);
});

// fuction for handle steps
const showStep = (x) => {
  selectPlanError('');

  // handle sidebar step
  if (x < sidebarStep.length) {
    for (let i = 0; i < sidebarStep.length; i++) {
      sidebarStep[i].classList.remove('active');
    }
    sidebarStep[x].classList.add('active');
  }

  // handle form step
  if (x < formStep.length) {
    if (x === 0) {
      prevBtn.classList.add('hidden');
      prevBtn.setAttribute('disabled', '');
    } else if (x === 4) {
      nextBtn.parentElement.classList.add('hidden');
    } else {
      prevBtn.classList.remove('hidden');
      prevBtn.removeAttribute('disabled');
    }
    x === 3
      ? (nextBtn.textContent = 'Confirm')
      : (nextBtn.textContent = 'Next step');

    for (let i = 0; i < formStep.length; i++) {
      formStep[i].classList.remove('active');
    }
    formStep[x].classList.add('active');
  }
};
showStep(stepNum);

// STEP-1 | PERSONAL INFO [ FORM-VALIDATION ]

const showError = (input, warningText) => {
  input.classList.add('error');
  input.parentElement.querySelector('.warning').textContent = warningText;
};

const hideError = (input) => {
  input.classList.remove('error');
  input.parentElement.querySelector('.warning').textContent = '';
};

// select all form inputs
const formInput = form.querySelectorAll('input');

// function for form validation
const formValidation = () => {
  formInput.forEach((input) => {
    // username
    if (input.name === 'userName') {
      return input.value.length === 0
        ? showError(input, 'Enter your name')
        : hideError(input);
    }
    // email
    if (input.name === 'email') {
      const emailRegExp = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
      return input.value.length === 0
        ? showError(input, 'Enter email')
        : !emailRegExp.test(input.value)
        ? showError(input, 'Enter valid email')
        : hideError(input);
    }
    // phone number
    if (input.name === 'phone') {
      return input.value.length === 0
        ? showError(input, 'Enter your phone number')
        : hideError(input);
    }
  });
  return form.checkValidity();
};

// STEP-2 | SELECT PLAN & TOGGLE BUTTON
const toggle = document.getElementById('toggle');
const yearlyBenefit = document.querySelectorAll('.yearly-benefit');
const month = document.getElementById('monthly');
const year = document.getElementById('yearly');
toggle.addEventListener('click', (e) => {
  selectPlanError('');
  const toggle = e.target.parentElement;
  planCards.forEach((card) => card.classList.remove('selected'));
  selectedPlan = {};

  toggle.classList.toggle('active');
  if (toggle.classList.contains('active')) {
    yearlyBenefit.forEach((item) => item.classList.add('show'));
    setplan(planCards, yearlyPlanPrices, 'yr');
    setplan(addsonCards, yearlyAdsOnPrice, 'yr');
    year.classList.add('selected-plan');
    month.classList.remove('selected-plan');
  } else {
    setplan(planCards, monthlyPlanPrices, 'mo');
    setplan(addsonCards, monthlyAdsOnPrice, 'mo');
    yearlyBenefit.forEach((item) => item.classList.remove('show'));
    month.classList.add('selected-plan');
    year.classList.remove('selected-plan');
  }
});

// Select plan card
planCards.forEach((card) => {
  card.addEventListener('click', (e) => {
    selectPlanError('');
    let target = e.currentTarget;
    planCards.forEach((card) => card.classList.remove('selected'));
    target.classList.add('selected');
    let planName = target.querySelector('.card-name').textContent;
    let planPrice = target.querySelector('.subscription-price').textContent;
    let planDur = target.querySelector('.subscription-duration').textContent;
    return (selectedPlan = { planName, planPrice, planDur });
  });
});

// STEP3 | ADD-ON
addsonCards.forEach((card) => {
  card.addEventListener('click', (e) => {
    let target = e.currentTarget;
    let checkbox = target.querySelector('.checkbox');
    target.classList.toggle('selected');
    if (target.classList.contains('selected')) {
      return (checkbox.checked = true);
    } else {
      return (checkbox.checked = false);
    }
  });
});

// STEP-4 | FINISHING UP
const renderTotal = () => {
  let totalAmount = 0;
  const planDuration = selectedPlan.planDur === 'mo' ? 'Monthly' : 'Yearly';
  const plan = document.getElementById('selected-plan');
  const addsOnList = document.getElementById('selected-addon');
  const total = document.getElementById('total');

  total.innerHTML = '';
  addsOnList.innerHTML = '';
  plan.innerHTML = '';

  let planName = document.createElement('p');
  planName.textContent = selectedPlan.planName;

  let dur = document.createElement('p');
  dur.textContent = `(${planDuration})`;

  let planPrice = document.createElement('p');
  planPrice.textContent = `$${selectedPlan.planPrice}/${selectedPlan.planDur}`;
  plan.appendChild(planName);
  plan.appendChild(dur);
  plan.appendChild(planPrice);

  totalAmount += parseInt(selectedPlan.planPrice);

  selectedAddsOn().forEach((item) => {
    let listItem = document.createElement('li');
    let addOnName = document.createElement('p');
    addOnName.textContent = item.name;
    let addOnprice = document.createElement('p');
    addOnprice.textContent = `+$${item.price}/${item.planDur}`;

    listItem.appendChild(addOnName);
    listItem.appendChild(addOnprice);
    addsOnList.appendChild(listItem);

    totalAmount += parseInt(item.price);
  });

  total.innerHTML = `<span>Total(
    per ${planDuration.slice(0, -2).toLocaleLowerCase()}) </span> 
      <span> $${totalAmount}/${selectedPlan.planDur}</span>`;
};

changePlanBtn.addEventListener('click', () => {
  stepNum = 0;
  showStep(stepNum);
});