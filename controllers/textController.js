const Textarea = require('../models/Data');

const TextareaController = {
    saveTextareaContent: async (req, res) => {
        const { textareas, userId } = req.body;

        try {
            const textarea = new Textarea({ content: textareas, user: userId });
            await textarea.save();
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Ошибка сервера' });
        }
    },
};

module.exports = new TextareaController();