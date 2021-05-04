require('dotenv/config');

require('./db');

const express = require('express');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// session configuration
const session = require('express-session');
// session store using mongo
const MongoStore = require('connect-mongo')(session);

const mongoose = require('mongoose');

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: {
            sameSite: 'none',
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        },
        saveUninitialized: false,
        resave: true,
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
        }),
    })
);
// end of session configuration

// session configuration
// const session = require('express-session');
// // // session store using mongo
// const MongoStore = require('connect-mongo');

// const mongoose = require('mongoose');

// app.use(
//     session({
//         secret: process.env.SESSION_SECRET,
//         cookie: {
//             sameSite: 'none',
//             httpOnly: true,
//             maxAge: 1000 * 60 * 60 * 24,
//         },
//         saveUninitialized: false,
//         resave: true,
//         store: new MongoStore({
//             mongooseConnection: mongoose.connection,
//             mongoUrl: 'mongodb://localhost/Vet-clinic-project',
//         }),
//     })
// );
// // end of session configuration

// passport configuration
const User = require('./models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// we serialize only the `_id` field of the user to keep the information stored minimum
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// when we need the information for the user, the deserializeUser function is called with the id that we previously serialized to fetch the user from the database
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((dbUser) => {
            done(null, dbUser);
        })
        .catch((err) => {
            done(err);
        });
});

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        (email, password, done) => {
            // login
            User.findOne({ email })
                .then((userFromDB) => {
                    if (!userFromDB) {
                        // there is no user with this username
                        done(null, false, { message: 'Wrong Credentials' });
                    } else if (
                        !bcrypt.compareSync(password, userFromDB.password)
                    ) {
                        // the password is not matching
                        done(null, false, { message: 'Wrong Credentials' });
                    } else {
                        // the userFromDB should now be logged in
                        done(null, userFromDB);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    )
);

app.use(passport.initialize());
// app.use(passport.session());

// Passport JWT config
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
        User.findOne({ id: jwt_payload.sub })
            .then((user) => {
                console.log('userJWTstr', user);
                // if (err) {
                //     return done(err, false);
                // }
                if (user) {
                    console.log('user jwt', user);
                    return done(null, user);
                } else {
                    return done(null, false);
                    // or you could create a new account
                }
            })
            .catch((err) => console.log(err));
    })
);

// end passport

const path = require('path');
app.use(express.static(path.join(__dirname, '/client/build')));

// default value for title local
const projectName = 'Vet-clinic';
const capitalized = (string) =>
    string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}`;

// Routes
// const allRoutes = require('./routes');
// app.use('/api', allRoutes);

const index = require('./routes/index');
app.use('/api', index);

const auth = require('./routes/auth');
app.use('/api/auth', auth);

const pets = require('./routes/pets');
app.use('/api', pets);

const users = require('./routes/users');
app.use('/api', users);

const messages = require('./routes/messages');
app.use('/api', messages);

// Error handling
require('./error-handling')(app);

app.use((req, res) => {
    // If no routes match, send them the React HTML.
    res.sendFile(__dirname + '/client/build/index.html');
});
module.exports = app;
