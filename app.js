const express = require('express');
const cors  = require('cors');
const ApiError = require("./app/api-error");
const contactsRouter = require("./app/routes/contact.route");
const app = express();
const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const session = require('express-session')
const MongoDB = require("./app/untils/mongodb.util")
const config = require("./app/config");
const AdminJSMongoose = require("@adminjs/mongoose");
const mongoose = require("mongoose");

const PORT = 3001;

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
}

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN)
  }
  return null
}


app.use(cors())
app.use(express.json());

app.get("/",(req, res)=> {
    res.json({message: "Welcome to contact book application."});
});

app.use("/api/contacts", contactsRouter);


async function run() {

    const mongooseDB = await mongoose.connect(config.db.uri,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("database connected"))
    .catch((err) => console.log(err));
    AdminJS.registerAdapter({
        Resource: AdminJSMongoose.Resource,
        Database: AdminJSMongoose.Database
    })
    const admin = new AdminJS({})
    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
        authenticate,
        cookieName: 'adminjs',
        cookiePassword: 'sessionsecret',
    },
    null,
    {
        store: mongooseDB,
        resave: true,
        saveUninitialized: true,
        secret: 'sessionsecret',
        cookie: {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        },
        name: 'adminjs',
    }
    )
    app.use(admin.options.rootPath, adminRouter)
    app.listen(PORT, () => {
        console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
    })
}

run();


module.exports = app;