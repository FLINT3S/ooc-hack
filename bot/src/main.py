# -- coding: windows-1251 --
import os
import json
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
from aiogram.contrib.fsm_storage.memory import MemoryStorage

from aiogram import Bot, Dispatcher, executor, types

API_TOKEN = '5993589215:AAEn7MCPVCP-NMl0exmzej3FIKqGln5-5Hg'

bot = Bot(token=API_TOKEN)
storage = MemoryStorage()
dp = Dispatcher(bot, storage=storage)

class Form(StatesGroup):
    email = State()


@dp.message_handler(commands=["start"])
async def start(message: types.Message):
    user_id = message.from_user["id"]
    await Form.email.set()
    await bot.send_message(user_id, "Привет!\n"
                                    "Чтобы подключить бота для уведомлений, введите свой E-Mail.")


@dp.message_handler(lambda message: message.text != "Филипп", state=Form.email)
async def process_name(message: types.Message, state: FSMContext):
    print(message.text)
    return await message.reply("Не знаю такой пол. Укажи пол кнопкой на клавиатуре")


@dp.message_handler(lambda message: message.text == "Филипп", state=Form.email)
async def process_email(message: types.Message, state: FSMContext):
    async with state.proxy() as data:
        print(data)
        print(message.text)
    return await message.reply("Вы успешно зарегестрированы")

if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
