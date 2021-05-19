const { Schema, model } = require('mongoose');

const messageSchema = new Schema(
    {
        userMessage: String,
        imageUrl: String,
        sender: { type: Schema.Types.ObjectId, ref: 'User' },
        address: {
            street: String,
            city: String,
            zipCode: String,
        },
        appointment: Date,
        homeService: Boolean,
        isNewMessage: Boolean,
    },
    {
        timestamps: true,
    }
);
const Message = model('Message', messageSchema);

module.exports = Message;
