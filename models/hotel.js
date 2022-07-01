const mongoose = require('mongoose');
const hotel = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    banner: { type: String, default: "" },
    gallery: [{
        name: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now() }
    }],
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'room' }],
    price: { type: Number, required: true },
    tax: { type: Number, required: true },
    discount: { type: String },
    isOnDiscount: { type: Boolean, default: false },
    rooms: { type: Number, default: 0 },
    bookedRoom: { type: Number, default: 0 },
    // feature: [{
    //     key: { type: String },
    //     value: { type: String }
    // }],
    isParkingAvailable: { type: Boolean, default: false },
    isWifiAvailable: { type: Boolean, default: false },
    isMealAvailable: { type: Boolean, default: false },
    isPetAllow: { type: Boolean, default: false },
    isFreeCancellation: { type: Boolean, default: false },
    paymentMode: {
        type: String,
        default: "offline",
        enum: ["offline", "online"],
    },
    location: {
        type: {
            type: String,  //default: "Point"
        },
        coordinates: [Number],
    },
    overAllRating: { type: Number },
    rating: [
        {
            rating: {
                type: Number,
                // required: [true, 'A rating is required.'],
                min: [1, 'A minimum rating of "1" is required.'],
                max: [5, '"5" is the maximum rating.']
            },
            review: { type: String, default: "", },
            postedOn: { type: Date, default: Date.now },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
            },
            customerName: { type: String }
        }
    ],
}, { timestamps: true })

hotel.index({ location: "2dsphere" });
mongoose.model('hotel', hotel)
module.exports = hotel;