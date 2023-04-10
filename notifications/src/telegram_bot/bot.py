# -- coding: windows-1251 --
import asyncio
import threading
import os

from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram import Bot, Dispatcher, executor, types


from strapi_client import StrapiClient

strapi_url = os.environ['STRAPI_URL']
login = os.environ['STRAPI_LOGIN']
password = os.environ['STRAPI_PASSWORD']
API_TOKEN = os.environ['API_TOKEN']

bot = Bot(token=API_TOKEN)

storage = MemoryStorage()
dp = Dispatcher(bot, storage=storage)
users = []

class Form(StatesGroup):
    email = State()


async def get_users():
    strapi = StrapiClient(strapi_url)
    await strapi.authorize(login, password)
    try:
        data = await strapi.get_entries("clients", filters={}, populate='*')
        data = data["data"]
        if data:
            return data
        return None
    except Exception:
        return "Wrong collection or field"


async def update_user_telegramId(user_id, telegramId):
    strapi = StrapiClient(strapi_url)
    await strapi.authorize(login, password)
    await strapi.update_entry("clients", user_id, data={"telegramId": telegramId})


class RunThread(threading.Thread):
    def __init__(self, func, args, kwargs):
        self.func = func
        self.args = args
        self.kwargs = kwargs
        self.result = None
        super().__init__()

    def run(self):
        self.result = asyncio.run(self.func(*self.args, **self.kwargs))


async def update_users():
    global users
    users = await get_users()
    return users


@dp.message_handler(commands=["start"])
async def start(message: types.Message):
    user_id = message.from_user["id"]
    await Form.email.set()
    await bot.send_message(user_id, "Привет!\n"
                                    "Чтобы войти в систему, введите свой E-Mail.")


@dp.message_handler(state=Form.email)
async def process_name(message: types.Message, state: FSMContext):
    users = await update_users()
    for user in users:
        if user["attributes"]["email"] == message.text:
            async with state.proxy() as data:
                data['email'] = message.text
            await state.finish()
            await update_user_telegramId(user["id"], message.from_user["id"])
            answer = "Вы успешно вошли в систему под именем " + user["attributes"]["name"]\
                     + ' ' + user["attributes"]["surname"]
            return await message.reply(answer)
    return await message.reply("Введите актуальную почту.")


async def on_startup():
    asyncio.create_task(asyncio.to_thread(await update_users()))

if __name__ == '__main__':
    executor.start_polling(dispatcher=dp, skip_updates=True)
