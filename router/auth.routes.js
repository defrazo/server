const Router = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Types } = require('mongoose');
const { check, validationResult } = require('express-validator');
const config = require('config');
const User = require('../models/User');
const Textarea = require('../models/Data');
const authMiddleware = require('../middleware/auth.middleware');

const router = new Router();

router.post(
    '/registration',
    [
        check('email', 'Некорректный e-mail').isEmail(),
        check('password', 'Пароль должен быть длиннее 3 и короче 12 символов').isLength({ min: 3, max: 12 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map(error => error.msg);
                return res.status(400).json({ message: errorMessages });
            }

            const { email, password } = req.body;
            const candidate = await User.findOne({ email });

            if (candidate) {
                return res.status(400).json({ message: `Пользователь ${email} уже существует` });
            }

            const hashPassword = await bcrypt.hash(password, 8);
            const user = new User({ email, password: hashPassword });
            await user.save();
            return res.status(201).json({ message: 'Пользователь успешно создан' });
        } catch (e) {
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
);

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const isPassValid = bcrypt.compareSync(password, user.password);

        if (!isPassValid) {
            return res.status(400).json({ message: 'Неправильный пароль' });
        }

        const token = jwt.sign({ id: user.id }, config.get('secretKey'), { expiresIn: '1h' });

        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (e) {
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.get('/auth', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id });
        const textData = await Textarea.find({ user: user._id });
        const token = jwt.sign({ id: user.id }, config.get('secretKey'), { expiresIn: '1h' });

        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                textData: textData ? textData.map(data => data.textareas) : [],
            }
        });
    } catch (e) {
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

module.exports = router;