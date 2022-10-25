'use strict';
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const labelBalance = document.querySelector('.balance_value');
const labelSumIn = document.querySelector('.summary_value--in');
const labelSumOut = document.querySelector('.summary_value--out');
const labelSumInterest = document.querySelector('.summary_value--interest');
const labelWelcome = document.querySelector('.welcome');

const inputLoginUsername = document.querySelector('.login_input--user');
const inputLoginPin = document.querySelector('.login_input--pin');
const btnLogin = document.querySelector('.login_btn');
const btnTransfer = document.querySelector('.form_btn--transfer');
const btnLoan = document.querySelector('.form_btn--loan');
const inputTransferTo = document.querySelector('.form_input--to');
const inputTransferAmount = document.querySelector('.form_input--amount');
const btnClose = document.querySelector('.form_btn--close');
const inputCloseUsername = document.querySelector('.form_input--user');
const inputClosePin = document.querySelector('form_input--pin');
const inputLoanAmount = document.querySelector('.form_input--loan-amount');

// Functions

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements_row">
        <div class="movements_type movements_type--${type}">${i + 1
      } ${type}</div>
        <div class="movements_value">${mov}$</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};

createUsernames(accounts);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}$`;
}

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}$`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}$`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}$`;
}

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {

    // Display UI and Message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;

    inputLoginUsername.value = inputLoginPin.value = '';
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  // alert("working");
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  if (amount > 0 && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
    console.log("Transfer Valid!");

    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
})

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

    // Add movement
    currentAccount.movements.push(amount);

    // update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {

    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    console.log(index);

    //Delete element
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
})