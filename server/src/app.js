require("dotenv").config();

const express = require('express');
const app = express();

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcryptjs");
const cors = require("cors");

// Passport local
passport.use(new LocalStrategy(
    async (username, password, done) => {
        const { prisma } = await import("./lib/prisma.mjs");
        try {
            const user = await prisma.users.findUnique({
                where: { username }
            });

            if (!user) return done(null, false, { message: "Incorrect username" });

            const ok = await bcrypt.compare(password, user.hashedPassword);
            if (!ok) return done(null, false, { message: "Incorrect password" });

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Passport Jwt
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    algorithms: ['HS256']
};

passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
        try {
            const { prisma } = await import("./lib/prisma.mjs");

            const user = await prisma.users.findUnique({
                where: { id: payload.sub }
            });

            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    })
);

// Passport init
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/api", require("./routes"));

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});