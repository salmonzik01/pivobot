import * as mongoose from 'mongoose'
import { env } from './../helpers/env'

mongoose.set('strictQuery', true)
export default function runMongo() {
  return mongoose.connect(env.DATABASE_URL)
}