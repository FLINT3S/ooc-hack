[![Client](https://github.com/FLINT3S/ooc-hack/actions/workflows/client-cd.yml/badge.svg)](https://github.com/FLINT3S/ooc-hack/actions/workflows/client-cd.yml)
[![Notifications](https://github.com/FLINT3S/ooc-hack/actions/workflows/notifications.yml/badge.svg)](https://github.com/FLINT3S/ooc-hack/actions/workflows/notifications.yml)
[![Server](https://github.com/FLINT3S/ooc-hack/actions/workflows/server-ci.yml/badge.svg)](https://github.com/FLINT3S/ooc-hack/actions/workflows/server-ci.yml)

## https://ooc.flint3s.ru - ссылка на веб-приложение
### Данные для входа:
```text
Логин: admin@admin.ru
Пароль: 12345
```

### https://t.me/GinAssistBot - ссылка на телеграм-бота для оповещений

### Технологии, используемые в проекте: каждый раздел вынесен в отдельный микросервис
* ##### fastapi + strapi (Server)
* ##### Vue3 + naiveUI + Typescript (Client)
* #### aiogram + strapi (Notifications)

Для запуска всех микросервисов требуется указать переменные окружения и запустить docker-compose:
```text
docker-compose up
```

Для CI/CD - GitHub Actions, Docker и Portainer 

### Решение позволяет:
- Возможность назначать совещания по решениям
- Гибкая настройка свойств принятых решений
- Жизненный цикл задач
- Удобное взаимодействие с реестром объектов и решений
- Напоминания о встречах и сроках и уведомления об изменениях по решениям
- Гибко настраиваемые карточки объектов
- Приложение файлов к задачам и объектам
- Создание и ведение решений внутри объектов

<hr>
Решение было реализовано в рамках хакатона Optimize & Organize Challenge командой flint3s
