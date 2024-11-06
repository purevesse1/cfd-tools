import axios from 'axios'
import dotenv from 'dotenv'


dotenv.config()

const { API, KEY, ID, PWD } = process.env

async function getUser() {
  try {
    const response = await axios.get(API as string)
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}

getUser()