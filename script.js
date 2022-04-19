'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-03-10T17:01:17.194Z',
    '2022-03-11T23:36:17.929Z',
    '2022-04-16T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const btnOpen = document.querySelector('.form__btn--open');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const inputFirstName = document.querySelector('.form__input--firstname');
const inputLastName = document.querySelector('.form__input--lastname');
const inputSetPin = document.querySelector('.form__input--setpin');
const inputSetDeposit = document.querySelector('.form__input--setdeposit');
const companyLogo = document.querySelector('.logo');
const modelContainer = document.querySelector('.model-container');
const modelClose = document.querySelector('.close-btn');
const modelText = document.querySelector('.model-text');

// *********** FUNCTIONS ***********

// Display Dates
const formatMovmentDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed === 2) return '2 Days Ago';
  if (daysPassed === 3) return '3 Days Ago';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = days[date.getDay()];
    // const month = months[date.getMonth()];
    // const year = date.getFullYear();
    // const date1 = date.getDate();
    // return `${day} ${month} ${date1}, ${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

// Format Currency
const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Display Movements
const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(account.movementsDates[i]);
    const displayDate = formatMovmentDate(date, account.locale);

    const formattedMov = formatCur(mov, account.locale, account.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Print Balance
const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// Display Summery
const calcDisplaySummery = account => {
  // INCOMES
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  // console.log(incomes);
  labelSumIn.textContent = formatCur(incomes, account.locale, account.currency);

  // OUTCOMES
  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  // console.log(outcomes);
  labelSumOut.textContent = formatCur(
    Math.abs(outcomes),
    account.locale,
    account.currency
  );

  // INTEREST
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  // console.log(interest);
  labelSumInterest.textContent = formatCur(
    interest,
    account.locale,
    account.currency
  );
};

const getInitials = acc => {
  acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(word => word[0])
    .join('');
};

// Create User Names
const createUserNames = accounts => {
  accounts.forEach(account => {
    getInitials(account);
  });
};
createUserNames(accounts);

// Create Single User Name
const createUserName = acc => {
  const oldUsers = [];
  accounts.forEach(account => {
    oldUsers.push(account.username);
  });

  getInitials(acc);

  let flag = oldUsers.some(user => user === acc.username);
  if (flag) {
    acc.username += Math.floor(Math.random() * 100) + 1;
  }
};

// Update UI
const updateUI = acc => {
  // Display Movements
  displayMovements(acc);
  // Display Balance
  calcDisplayBalance(acc);
  // Display Summery
  calcDisplaySummery(acc);
};

// Logout Timer
const startLogoutTimer = () => {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
      loginFlag = !loginFlag;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 mins
  let time = 300;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

// EVENT HANDELERS
let currentAccount, timer;

// FAKE ALWYAS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// setTimeout(() => {
//   containerApp.style.opacity = 1;
// }, 1000);

let loginFlag = false;
// Initial Login
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  loginFlag = true;
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 1;

    // Create Current Date and Time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };
    // const locale = navigator.language;
    // console.log(locale)
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // const now = new Date();
    // const day = days[now.getDay()];
    // const month = months[now.getMonth()];
    // const year = now.getFullYear();
    // const date = now.getDate();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const mins = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day} ${month} ${date}, ${year}, ${hour}:${mins}`;

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
  // Clear Input Fields
  // inputLoginUsername.value = '';
  // inputLoginPin.value = '';
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
});

// Transfer Funds
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(receiverAcc);
  const amount = +inputTransferAmount.value;
  // console.log(amount);

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing The Transfer
    receiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);
  }

  // Add Transfer Date
  currentAccount.movementsDates.push(new Date().toISOString());
  receiverAcc.movementsDates.push(new Date().toISOString());
  // Update UI
  updateUI(currentAccount);

  // Reset Timer
  clearInterval(timer);
  timer = startLogoutTimer();
});

// Request Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add Movement
    setTimeout(() => {
      currentAccount.movements.push(amount);

      // Add Loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset Timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

// Close Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (accounts.length > 1) {
    loginFlag = false;

    if (
      inputCloseUsername.value === currentAccount.username &&
      +inputClosePin.value === currentAccount.pin
    ) {
      const index = accounts.findIndex(
        acc => acc.username === currentAccount.username
      );
      // Delete Account
      accounts.splice(index, 1);

      // Hide UI
      containerApp.style.opacity = '0';
      labelWelcome.textContent = 'Log in to get started';
      inputCloseUsername.value = inputClosePin.value = '';
    }
  }
});

// Open New Account
btnOpen.addEventListener('click', function (e) {
  e.preventDefault();
  const firstName = inputFirstName.value;
  const lastName = inputLastName.value;
  const pin = inputSetPin.value;
  const depostAmount = +inputSetDeposit.value;
  accounts.push({
    owner: `${firstName[0].toUpperCase() + firstName.slice(1)} ${
      lastName[0].toUpperCase() + lastName.slice(1)
    }`,
    movements: [depostAmount],
    interestRate: 0.5,
    pin: +`${pin}`,

    movementsDates: [new Date().toISOString()],
    currency: 'USD',
    locale: 'en-US', // de-DE
  });

  createUserName(accounts[accounts.length - 1]);
  inputFirstName.value =
    inputLastName.value =
    inputSetPin.value =
    inputSetDeposit.value =
      '';
  inputSetDeposit.blur();

  // Add Transfer Date
  currentAccount.movementsDates.push(new Date());

  // Reset Timer
  clearInterval(timer);
  timer = startLogoutTimer();
});

// Sort Display
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// Show All Accounts Modal
companyLogo.addEventListener('click', () => {
  modelContainer.classList.add('show-model');
  document.body.style.overflow = 'hidden';
  companyLogo.style.transform = 'scale(1.1)';
  containerApp.style.opacity = '1';
  let html = '';
  accounts.forEach((account, i) => {
    html += `
      <ul class="model-info">
                <h3>Account ${i + 1}</h3>
                <li>${account.owner}</li>
                <li>USERNAME: ${account.username}</li>
                <li>PIN: ${account.pin}</li>
                </ul>
                `;
  });
  modelText.innerHTML = html;
});

// Close Show All Accounts Modal
modelClose.addEventListener('click', () => {
  modelContainer.classList.remove('show-model');
  document.body.style.overflow = 'visible';
  companyLogo.style.transform = 'scale(1)';
  if (!loginFlag) {
    containerApp.style.opacity = '0';
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const months = [
  'January',
  'Febuary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const now = new Date();
const day = days[now.getDay()];
const month = months[now.getMonth()];
const date = now.getDate();
const year = now.getFullYear();
const hour = now.getHours();
const mins = now.getMinutes();
const secs = now.getSeconds();
