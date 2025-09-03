'use strict';

// Создаем объект класса UserForm
const userForm = new UserForm();

// Обработчик для формы авторизации
userForm.loginFormCallback = function(data) {
    ApiConnector.login(data, (response) => {
        console.log('Ответ сервера при авторизации:', response);
        
        if (response.success) {
            // В случае успеха - обновляем страницу
            location.reload();
        } else {
            // В случае ошибки - показываем сообщение
            userForm.setLoginErrorMessage(response.error || 'Ошибка авторизации');
        }
    });
};

// Обработчик для формы регистрации
userForm.registerFormCallback = function(data) {
    ApiConnector.register(data, (response) => {
        console.log('Ответ сервера при регистрации:', response);
        
        if (response.success) {
            // В случае успеха - обновляем страницу
            location.reload();
        } else {
            // В случае ошибки - показываем сообщение
            userForm.setRegisterErrorMessage(response.error || 'Ошибка регистрации');
        }
    });
};
