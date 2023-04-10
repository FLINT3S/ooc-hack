FROM python:3.10.8-alpine3.16

WORKDIR /code

RUN apk add --virtual build-deps gcc musl-dev

COPY ./requirements.txt /code/requirements.txt

RUN pip install -r /code/requirements.txt


COPY . /code/notifications

EXPOSE 3002

RUN ["chmod", "+x", "notifications/tg_bot_and_fastapi.sh"]
ENTRYPOINT notifications/tg_bot_and_fastapi.sh
