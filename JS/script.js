"use strict";

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "GBP",
  locale: "en-GB",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const accounts = [account1, account2, account3, account4];

const loginForm = document.querySelector(".login");
const userInput = document.querySelector(".user");
const pinInput = document.querySelector(".pin");
const testAccs = document.querySelector(".test-accs");
const testAccsContainer = document.querySelector(".accs-container");
const appContainer = document.querySelector(".app");
const loginButton = document.querySelector(".login-button");
const loginError = document.querySelector(".login-error");
const logoutButton = document.querySelector(".logout-button");
const logoutTimer = document.querySelector(".logout-timer span");
const movementsContainer = document.querySelector(".movements");
const balanceValue = document.querySelector(".balance .value");
const balanceDate = document.querySelector(".balance .date");
const summaryDeposits = document.querySelector(".summary-deposits");
const summaryWithdrawals = document.querySelector(".summary-withdrawals");
const summaryInterest = document.querySelector(".summary-interest");
const welcome = document.querySelector(".welcome");
const transferButton = document.querySelector(".transfer-button");
const transferUser = document.querySelector(".transfer-user");
const transferAmount = document.querySelector(".transfer-amount");
const loanButton = document.querySelector(".loan-button");
const loanAmount = document.querySelector(".loan-amount");
const closeButton = document.querySelector(".close-button");
const closeUser = document.querySelector(".close-user");
const closePin = document.querySelector(".close-pin");
const sortButton = document.querySelector(".summary button");

// Adding / Formatting account info --------------------------------
const createDepWD = function (acc) {
  acc.deposits = acc.movements.filter((mov) => mov > 0);
  acc.withdrawals = acc.movements.filter((mov) => mov < 0);
  acc.withdrawals.length === 0 ? (acc.withdrawals[0] = 0) : acc.withdrawals;
  acc.deposits.length === 0 ? (acc.deposits[0] = 0) : acc.deposits;
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur);
  balanceValue.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const formatDate = function (date, locale) {
  const daysPassed = Math.round(
    Math.abs((new Date() - new Date(date)) / (1000 * 60 * 60 * 60 * 24))
  );
  if (daysPassed === 0) {
    return "Today";
  } else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale = "en-US", currency = "USD") {
  const options = {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };
  return (value = new Intl.NumberFormat(locale, options).format(value));
};

// ----------------------------------------------------
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

// Login ----------------------------------------------
let currentAccount, timer;
const login = function (e) {
  e.preventDefault();

  currentAccount = accounts.find((acc) => acc.username === userInput.value);
  if (
    userInput.value === currentAccount?.username &&
    +pinInput.value === currentAccount?.pin
  ) {
    showElement(appContainer);
    hideElement(testAccs);
    loginForm.style.display = "none";
    logoutButton.style.display = "block";
    userInput.value = pinInput.value = "";
    pinInput.blur();
    welcome.textContent = `Welcome Back, ${currentAccount.owner.split(" ")[0]}`;
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
    updateUI(currentAccount);
    loginError.style.opacity = "0";
  } else {
    loginError.style.opacity = "1";
  }
};
loginButton.addEventListener("click", login);

userInput.addEventListener("click", function () {
  loginError.style.opacity = "0";
});
pinInput.addEventListener("click", function () {
  loginError.style.opacity = "0";
});

// LogOut ---------------------------------------------
const logout = function () {
  welcome.textContent = "Log in to get started";
  hideElement(appContainer);
  ShowAccs(accounts);
  loginForm.style.display = "flex";
  logoutButton.style.display = "none";
};
logoutButton.addEventListener("click", logout);

const startLogoutTimer = function () {
  let time = 5 * 60;
  const tick = () => {
    const min = Math.trunc(time / 60);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    logoutTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      logout();
    }
    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// Displaying UI and Messages -------------------------
const showElement = function (element) {
  element.style.position = "static";
  element.style.top = "0";
  element.style.opacity = "1";
};
const hideElement = function (element) {
  element.style.position = "absolute";
  element.style.top = "-3000px";
  element.style.opacity = "0";
};

const displayBalanceDate = function () {
  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  balanceDate.textContent = `As of ${new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(new Date())}`;
};

const ShowAccs = function (accounts) {
  testAccsContainer.innerHTML = "";

  accounts.forEach(function (acc) {
    const html = `
      <div class="acc">
      <p>${acc.owner}</p>
      <p>Username: ${acc.username}</p>
      <p>Password: ${acc.pin}</p>
      </div>
      `;
    testAccsContainer.insertAdjacentHTML("beforeend", html);
  });
  showElement(testAccs);
};
ShowAccs(accounts);

const displayMovements = function (acc, sort = false) {
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movementsContainer.innerHTML = "";

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = formatDate(
      new Date(acc.movementsDates[acc.movements.indexOf(mov)]),
      acc.locale
    );
    const num = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movement-row">
        <div class="type-date">
          <div class="type type-${type}">${type}</div>
          <div class="date">${date}</div>
        </div>
        <div class="value">${num}</div>
      </div>
    `;
    movementsContainer.insertAdjacentHTML("afterbegin", html);
  });
};

const displaySummary = function (acc) {
  createDepWD(acc);
  summaryDeposits.textContent = formatCur(
    acc.deposits.reduce((acc, cur) => acc + cur),
    acc.locale,
    acc.currency
  );

  summaryWithdrawals.textContent = formatCur(
    Math.abs(acc.withdrawals.reduce((acc, cur) => acc + cur)),
    acc.locale,
    acc.currency
  );
  const interest = acc.deposits
    .map((deposit) => deposit * (acc.interestRate / 100))
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int);
  summaryInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const updateUI = function (acc) {
  displaySummary(acc);
  displayMovements(acc, sorted);
  calcDisplayBalance(acc);
  displayBalanceDate();
};

// Operations -----------------------------------------
const transfer = function (e) {
  e.preventDefault();

  const amount = +transferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === transferUser.value
  );

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username
  ) {
    receiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    clearInterval(timer);
    timer = startLogoutTimer();
  }

  transferUser.value = transferAmount.value = "";
  transferAmount.blur();
};
transferButton.addEventListener("click", transfer);

const loan = function (e) {
  e.preventDefault();

  const amount = +loanAmount.value;
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 500);
  }
  loanAmount.value = "";
};
loanButton.addEventListener("click", loan);

const closeAccount = function (e) {
  e.preventDefault();

  if (
    closeUser.value === currentAccount.username &&
    +closePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    appContainer.style.opacity = "0";
    logout();
    globalThis.scrollTo({ top: 0, behavior: "smooth" });
  }
  closeUser.value = closePin.value = "";
};
closeButton.addEventListener("click", closeAccount);

let sorted = false;
sortButton.addEventListener("click", function () {
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
