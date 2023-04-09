FROM python:3.10.8-alpine3.16

WORKDIR /code

RUN apk add --virtual build-deps gcc musl-dev

COPY ./requirements.txt /code/requirements.txt

RUN pip install -r /code/requirements.txt


COPY . /code/notifications

EXPOSE 3002

#CMD ["python", "/code/notifications/src/telegram_bot/bot.py"]
#CMD ["uvicorn", "notifications.src.main:app", "--host", "0.0.0.0", "--port", "3002", "--reload"]

CMD notifications/tg_bot_and_fastapi.sh
