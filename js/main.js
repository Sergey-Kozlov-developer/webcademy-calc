// data
const budget = [];

// DOM
const form = document.querySelector("#form");
const type = document.querySelector("#type");
const title = document.querySelector("#title");
const value = document.querySelector("#value");
const incomeList = document.querySelector("#incomes-list");
const expensesList = document.querySelector("#expenses-list");
const budgetEl = document.querySelector("#budget");
const totalIncomEl = document.querySelector("#total-income");
const totalExpenseEl = document.querySelector("#total-expense");
const percentWrapper = document.querySelector("#expense-percents-wrapper");
const monthEl = document.querySelector("#month");
const yearEl = document.querySelector("#year");

// Functions

// форматирование суммы
const priceFormatter = new Intl.NumberFormat("ru-RU", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

function insertTestData() {
	const testData = [
		{ type: "inc", title: "Фриланс", value: 1500 },
		{ type: "inc", title: "Зарплата", value: 2000 },
		{ type: "inc", title: "Бизнес", value: 2000 },
		{ type: "inc", title: "Рента", value: 1000 },
		{ type: "exp", title: "Продукты", value: 300 },
		{ type: "exp", title: "Кафе", value: 200 },
		{ type: "exp", title: "Транспорт", value: 200 },
		{ type: "exp", title: "Квартира", value: 500 },
	];
	// get random index from 0 to 7 (testData.lenght - 1)
	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

	const randomIndex = getRandomInt(testData.length);
	testData[randomIndex];
	const randomData = testData[randomIndex];
	type.value = randomData.type;
	title.value = randomData.title;
	value.value = randomData.value;
	// testData[7];
}
// function clear
function clearForm() {
	form.reset();
}

// подсчет бюджета
function calcBudget() {
	// считаем общий доход
	const totalIncome = budget.reduce(function (total, element) {
		if (element.type === "inc") {
			return total + element.value;
		} else {
			return total;
		}
	}, 0);
	// считаем общий расход
	const totalExpense = budget.reduce(function (total, element) {
		if (element.type === "exp") {
			return total + element.value;
		} else {
			return total;
		}
	}, 0);
	// общий бюджет
	const totalBudget = totalIncome - totalExpense;
	// % расходов
	let expensePercent = 0;
	if (totalIncome) {
		expensePercent = Math.round((totalExpense * 100) / totalIncome);
	}

	budgetEl.innerHTML = priceFormatter.format(totalBudget);
	totalIncomEl.innerHTML = "+ " + priceFormatter.format(totalIncome);
	totalExpenseEl.innerHTML = "- " + priceFormatter.format(totalExpense);

	if (expensePercent) {
		const html = `<div class="badge">${expensePercent}%</div>`;
		percentWrapper.innerHTML = html;
	} else {
		percentWrapper.innerHTML = "";
	}
}
// отображение даты
function displayMoth() {
	const now = new Date();
	const year = now.getFullYear();

	const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
		month: "long",
	});
	const month = timeFormatter.format(now);

	monthEl.innerHTML = month;
	yearEl.innerHTML = year;
}

// actions добавление записи
displayMoth();
insertTestData();
form.addEventListener("submit", function (e) {
	e.preventDefault();

	// расчет id
	let id = 1;
	if (budget.length > 0) {
		// последний элемент в массиве
		const lastElement = budget[budget.length - 1];
		// id последнего элемента
		const lastElID = lastElement.id;
		// id последнего элемента
		id = lastElID + 1;
	}

	// проверка формы на заполненность form__input--err
	if (title.value.trim() === "") {
		title.classList.add("form__input--err");
		return;
	} else {
		title.classList.remove("form__input--err");
	}
	// проверка формы на заполненность form__input--err в сумме
	if (value.value.trim() === "" || +value.value <= 0) {
		value.classList.add("form__input--err");
		return;
	} else {
		value.classList.remove("form__input--err");
	}

	// формируем запись
	const record = {
		id: id,
		type: type.value,
		title: title.value.trim(),
		value: +value.value,
	};

	// добавляем запись в данные

	budget.push(record);

	// отображаем доход на странице
	if (record.type === "inc") {
		const html = `
		<li data-id='${record.id}' class="budget-list__item item item--income">
                        <div class="item__title">${record.title}</div>
                        <div class="item__right">
                            <div class="item__amount">+ ${priceFormatter.format(
								record.value
							)}</div>
                            <button class="item__remove">
                                <img
                                    src="./img/circle-green.svg"
                                    alt="delete"
                                />
                            </button>
                        </div>
                    </li>
		`;

		incomeList.insertAdjacentHTML("afterbegin", html);
	}
	// отображаем расход на странице
	if (record.type === "exp") {
		const html = `
		<li data-id='${record.id}' class="budget-list__item item item--expense">
		<div class="item__title">${record.title}</div>
		<div class="item__right">
			<div class="item__amount">- ${priceFormatter.format(record.value)}</div>
			<button class="item__remove">
				<img src="./img/circle-red.svg" alt="delete" />
			</button>
		</div>
	</li>
		`;
		expensesList.insertAdjacentHTML("afterbegin", html);
	}

	// посчитать бюджет
	calcBudget();

	clearForm();
	insertTestData();
});

// удаление записи
document.body.addEventListener("click", function (event) {
	// кнопка удалить
	if (event.target.closest(["button.item__remove"])) {
		const recordElements = event.target.closest("li.budget-list__item");
		const id = +recordElements.dataset.id;

		const index = budget.findIndex(function (element) {
			if (id === element.id) {
				return true;
			}
		});

		budget.splice(index, 1);
		// remove from page
		recordElements.remove();
	}
	// budget
	calcBudget();
});
