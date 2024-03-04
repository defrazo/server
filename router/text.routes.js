const Router = require('express');
const TextModel = require('../models/Data');
const UserModel = require('../models/User');

const router = new Router();

router.post('/save-text', async (req, res) => {

    try {
        const { textareas, userId } = req.body;
        const existingTextData = await TextModel.findOne({ user: userId });

        if (existingTextData) {
            existingTextData.textareas = textareas;
            await existingTextData.save();
        } else {
            const newText = new TextModel({
                textareas: textareas,
                user: userId,
            });
            await newText.save();
        }

        const user = await UserModel.findById(userId);

        if (user) {
            user.textData = existingTextData._id;
            await user.save();
        } else {
            // console.log('User not found');
        }

        await res.status(201).json({ message: 'Данные успешно сохранены' });
    } catch (error) {
        res.status(500).json({ message: 'Произошла ошибка при сохранении данных' });
    }
});

module.exports = router;