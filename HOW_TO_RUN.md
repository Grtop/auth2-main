# установите зависимости
`npm i` в директориях server и src соответственно
# развернуть докер компоуз

```
docker compose \
--file ./server/docker-compose.yml \
--project-name "mydatabase" \
up \
-d
```
# Запуск базы в ручную
установить и запустить `pgAdmin`
в настройках указать имя `mydatabase` пароль `1` host - localhost 
далее из файла docker-compouse.yml
# Запуск проекта
cd server `npm run start`
cd src  `npm run start`

