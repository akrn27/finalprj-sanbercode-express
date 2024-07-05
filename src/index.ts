import express from 'express';
import routes from './routes';
import bodyParser from 'body-parser';
import db from './config/database';
import 'dotenv/config'
// require('dotenv').config()

const app = express();
const PORT = 3000;

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

db();

app.use('/api', routes);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at port ${PORT}`)
})