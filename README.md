<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# CRM Tasks and Comments API

**Стек:** Node.js, NestJS, TypeORM, PostgreSQL, TypeScript  
**Дополнительно:** Swagger, JWT access/refresh, validation


## Функциональность

### Auth
- Регистрация/логин по JWT
- Access token + Refresh token
- Refresh token хранится в БД в виде **hash** (безопаснее, чем хранить токен в открытом виде)

### Users (CRUD)
- POST /users - создание пользователя
- GET /users - список пользователей
- GET /users/:id - пользователь по id
- PATCH /users/:id - обновить
- DELETE /users/:id - удалить

### Tasks (CRUD)
- POST /tasks - создать задачу (**только роль USER**)
- GET /tasks - список задач (новые первыми)
- GET /tasks/:id - задача по id
- PATCH /tasks/:id - обновить (только владелец)
- DELETE /tasks/:id - удалить (только владелец)

### Comments (CRUD)
- POST /comments - создать комментарий (**только роль AUTHOR**)
- GET /comments?task_id=xxx - список комментариев к задаче (новые первыми)
- GET /comments/:id - комментарий по id
- PATCH /comments/:id - обновить (**только владелец**)
- DELETE /comments/:id - удалить (**только владелец**)

## Бизнес-правила (как реализованы)

1) **Редактировать/удалять комментарий может только его пользователь**  
   Реализовано проверкой ownership: `comment.userId === req.user.sub`, иначе 403.

2) **Задачи возвращаются отсортированными по дате (новые первыми)**  
   `ORDER BY created_at DESC` в TasksService.

3) **Связь: у задачи много комментариев, у комментария одна задача**  
   TypeORM: `Task (1) -> (M) Comment`, `Comment -> Task (M:1)`.

4) **Только USER может создать задачу**  
   RolesGuard + `@Roles('USER')` на POST /tasks.

5) **Только AUTHOR может создать комментарий**  
   RolesGuard + `@Roles('AUTHOR')` на POST /comments.

6) **Текст комментария обязателен (1-1000)**  
   DTO + `class-validator`.


## Дополнительно

- Поле `Users.task_id` не добавлялось, т.к. связь “пользователь - задачи” корректно выражается через `Tasks.user_id`.
- Поле `Tasks.comment` не добавлялось, т.к. комментарии вынесены в отдельную сущность `Comment` и связаны с задачами отношением 1-to-many.


## Запуск проекта

### 1) Установить зависимости
```bash
npm install
```
### 2) Создать .env

Создать файл .env в корне проекта:
```
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=crm
DB_USER=crm
DB_PASS=crm

JWT_ACCESS_SECRET=super_access_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=super_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
```

### 3) Запустить PostgreSQL через Docker
```
docker compose up -d
```

### 4) Запустить приложение
```
npm run start:dev

```
**Swagger:**

- http://localhost:3000/swagger



### Быстрый сценарий проверки

**1. Регистрация:**

POST /auth/register
```
{ "password": "12345", "role": "USER" }
```

**2. Логин:**

POST /auth/login
```
{ "id": "<USER_ID>", "password": "12345" }
```

**3. В Swagger нажать Authorize и вставить:**
- Bearer < accessToken >

**4.Создать задачу:**
POST /tasks
```
{ "description": "Test task" }
```

**5. Создать AUTHOR и комментарий:**

- зарегистрировать AUTHOR

- залогиниться AUTHOR

- POST /comments с taskId и text

### Структура проекта

Проект организован по feature-first (модули по доменам):

- auth/ — auth + jwt strategy

- users/ — users CRUD

- tasks/ — tasks CRUD

- comments/ — comments CRUD

- common/ — guards/decorators

- config/ — TypeORM config

## Stay in touch

- Author - Salemkan Aknur


