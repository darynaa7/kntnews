const User = require('../../../model/dataModels/User')
const Role = require('../../../model/dataModels/Role')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator')
const {secret} = require("../../../../config")

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}
const {v4: uuidv4} = require('uuid');
const moment = require("moment");

class authController {

    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Registration error", errors});
            }

            const {username, password} = req.body;
            const candidate = await User.findOne({where: {username}});
            if (candidate) {
                return res.status(400).json({message: "вже існує користувач з цим логіном"});
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            // const userRole = await Role.findOne({where: {value: "USER"}});
            // const token = generateAccessToken(user.id, user.roles);
            //
            // const newUser = await User.create({
            //     username,
            //     password: hashPassword,
            //     roles: [userRole?.value],
            //     token, // Зберігаємо токен
            //     tokenExpiration: moment().add(1, 'days').valueOf()
            // });
            // const userRole = await Role.findOne({where: {value: "USER"}});
            // const newUser = await User.create({
            //     username,
            //     password: hashPassword
            // });
            const userRole = await Role.findOne({where: {value: "USER"}});
            const newUser = await User.create({
                username,
                password: hashPassword,
                roles: [userRole?.value],
                tokenExpiration: moment().add(1, 'days').valueOf()
            });

            const token = generateAccessToken(newUser.id, newUser.roles);
            newUser.token = token;
            await newUser.save();
            console.log(newUser)
            console.log(newUser.token)

            return res.json({
                token: token,
                user: {
                    login: newUser.username,
                    id: newUser.id
                }
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Registration error'});
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({where: {username}});

            if (!user) {
                return res.status(400).json({message: `не існує ${username}`});
            }

            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({message: `неправильний пароль`});
            }

            const token = generateAccessToken(user.id, user.roles);
            user.token = token;
            user.tokenExpiration = moment().add(1, 'days').valueOf();
            await user.save();

            return res.json({
                token: token,
                user: {
                    login: user.username,
                    id: user.id
                }
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Login error'});
        }
    }

    async users(req, res) {

        try {
            const users = await User.find()
            res.json(users)

        } catch (e) {
            console.log(e)
        }
    }

    async checkAuth(req, res) {
        try {
            const authorizationHeader = req.headers["authorization"];
            console.log(req.headers["authorization"])
            console.log("here ")
            console.log(authorizationHeader)
            if (!authorizationHeader) {
                return res.status(403).json({message: 'User not authorized, no token, no header'});
            }
            console.log("here1 ")

            const token = authorizationHeader;

            if (!token) {
                return res.status(403).json({message: 'User not authorized, NO token'});
            }
            console.log("here2")

            const decodedData = jwt.verify(token, secret);
            req.user = decodedData;
            console.log("user: " + JSON.stringify(req.user));

            const user = await User.findOne({
                where: {id: req.user.id}
            });
            console.log("here3")

            if (!user || !user.token) {
                return res.status(401).json({message: 'User not authorized'});
            }
            console.log("here4")

            if (user.tokenExpiration < Date.now()) {
                return res.status(401).json({message: 'Token expired'});
            }

            console.log(user)
            return res.json(
                {
                    token: token,
                    user: {
                        login: user.username,
                        id: user.id
                    }
                }
            );
        } catch (error) {
            console.error(error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({message: "Invalid token"});
            } else {
                return res.status(500).json({message: "Internal Server Error"});
            }
        }

    }
    async logout(req, res) {
        try {
            const username = req.params.username

            const user = await User.findOne({where: {username}});

            if (!user) {
                return res.status(400).json({message: `There's no user ${username}`});
            }
            const currentTimeInMillis = Date.now();
            await User.update({ tokenExpiration: currentTimeInMillis }, { where: { username } });

            res.status(200).json({ message: 'Token expiration updated successfully' });
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Login error'});
        }
    }


}

module.exports = new authController();