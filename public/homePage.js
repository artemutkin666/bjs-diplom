'use strict';

// Создаем объект класса LogoutButton
const logoutButton = new LogoutButton();

// Записываем функцию в свойство action
logoutButton.action = function() {
	// Вызываем запрос деавторизации
	ApiConnector.logout((response) => {
		// Проверяем успешность запроса
		if (response.success) {
			// Если запрос выполнился успешно - обновляем страницу
			location.reload();
		}
	});
};


// Выполняем запрос на получение текущего пользователя
ApiConnector.current((response) => {
	console.log('Ответ сервера (current user):', response);

	// Проверяем успешность запроса
	if (response.success) {
		// Если запрос успешный - отображаем данные профиля
		ProfileWidget.showProfile(response.data);
	} else {
		// В случае ошибки выводим в консоль
		console.error('Ошибка получения данных пользователя:', response.error);
	}
});

const ratesBoard = new RatesBoard();

// Функция для получения и отображения курсов валют
function updateExchangeRates() {
	ApiConnector.getStocks((response) => {
		console.log('Ответ сервера (exchange rates):', response);

		if (response.success) {
			// Очищаем таблицу
			ratesBoard.clearTable();
			// Заполняем таблицу новыми данными
			ratesBoard.fillTable(response.data);
		} else {
			console.error('Ошибка получения курсов валют:', response.error);
		}
	});
}

// Вызываем функцию для получения текущих курсов
updateExchangeRates();

// Устанавливаем интервал для обновления курсов каждую минуту
setInterval(updateExchangeRates, 60000); // 60000 ms = 1 minute




const moneyManager = new MoneyManager();


moneyManager.addMoneyCallback = function(data) {
	ApiConnector.addMoney(data, (response) => {
		if (response.success) {
			// Отображаем обновленные данные пользователя
			ProfileWidget.showProfile(response.data);
			// Выводим сообщение об успехе
			this.setMessage(true, 'Баланс успешно пополнен');
		} else {
			// Выводим сообщение об ошибке
			this.setMessage(false, response.error || 'Ошибка при пополнении баланса');
		}
	});
};


moneyManager.conversionMoneyCallback = function(data) {
	ApiConnector.convertMoney(data, (response) => {
		if (response.success) {
			// Отображаем обновленные данные пользователя
			ProfileWidget.showProfile(response.data);
			// Выводим сообщение об успехе
			this.setMessage(true, 'Конвертация выполнена успешно');
		} else {
			// Выводим сообщение об ошибке
			this.setMessage(false, response.error || 'Ошибка при конвертации валюты');
		}
	});
};


moneyManager.sendMoneyCallback = function(data) {
	ApiConnector.transferMoney(data, (response) => {
		if (response.success) {
			// Отображаем обновленные данные пользователя
			ProfileWidget.showProfile(response.data);
			// Выводим сообщение об успехе
			this.setMessage(true, 'Перевод выполнен успешно');
		} else {
			// Выводим сообщение об ошибке
			this.setMessage(false, response.error || 'Ошибка при переводе средств');
		}
	});
};



const favoritesWidget = new FavoritesWidget();


// начальный список избранного
ApiConnector.getFavorites(response => {
	if (response.success) {
		// Очищаем таблицу избранного и рисуем новый список
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response.data);

		// Обновляем список пользователей для переводов
		moneyManager.updateUsersList(response.data);
	} else {
		console.error('Не удалось получить избранное:', response.error);
	}
});


favoritesWidget.addUserCallback = function(data) {
	// Выполняем запрос на добавление пользователя
	ApiConnector.addUserToFavorites(data, (response) => {
		// Проверяем успешность запроса
		if (response.success) {
			// Очищаем текущий список избранного
			favoritesWidget.clearTable();
			// Отрисовываем полученные данные
			favoritesWidget.fillTable(response.data);
			// Заполняем выпадающий список для перевода денег
			favoritesWidget.updateUsersList(response.data);
			// Выводим сообщение об успехе
			this.setMessage(true, 'Пользователь успешно добавлен в избранное');
		} else {
			// Выводим сообщение об ошибке
			this.setMessage(false, response.error || 'Ошибка при добавлении пользователя в избранное');
		}
	});
};


favoritesWidget.removeUserCallback = function(data) {
	// Выполняем запрос на удаление пользователя
	ApiConnector.removeUserFromFavorites(data, (response) => {
		// Проверяем успешность запроса
		if (response.success) {
			// Очищаем текущий список избранного
			favoritesWidget.clearTable();
			// Отрисовываем полученные данные
			favoritesWidget.fillTable(response.data);
			// Заполняем выпадающий список для перевода денег
			favoritesWidget.updateUsersList(response.data);
			// Выводим сообщение об успехе
			this.setMessage(true, 'Пользователь успешно удален из избранного');
		} else {
			// Выводим сообщение об ошибке
			this.setMessage(false, response.error || 'Ошибка при удалении пользователя из избранного');
		}
	});
};
