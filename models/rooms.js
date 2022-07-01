const mongoose = require("mongoose");
const moment = require("moment");
const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    bookingStart: Date,
    bookingEnd: Date,
    startHour: Number,
    duration: Number,
    purpose: { type: String, },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'room' }
})

// Validation to ensure a room cannot be double-booked
bookingSchema.path('bookingStart').validate(function (value) {
    // Extract the Room Id from the query object
    let roomId = this.roomId

    // Convert booking Date objects into a number value
    let newBookingStart = value.getTime()
    let newBookingEnd = this.bookingEnd.getTime()

    // Function to check for booking clash
    let clashesWithExisting = (existingBookingStart, existingBookingEnd, newBookingStart, newBookingEnd) => {
        if (newBookingStart >= existingBookingStart && newBookingStart < existingBookingEnd ||
            existingBookingStart >= newBookingStart && existingBookingStart < newBookingEnd) {

            throw new Error(
                `Booking could not be saved. There is a clash with an existing booking from ${moment(existingBookingStart).format('HH:mm')} to ${moment(existingBookingEnd).format('HH:mm on LL')}`
            )
        }
        return false
    }

    // Locate the room document containing the bookings
    return db.room.findById(roomId)
        .then(room => {
            // Loop through each existing booking and return false if there is a clash
            return room.bookings.every(booking => {

                // Convert existing booking Date objects into number values
                let existingBookingStart = new Date(booking.bookingStart).getTime()
                let existingBookingEnd = new Date(booking.bookingEnd).getTime()

                // Check whether there is a clash between the new booking and the existing booking
                return !clashesWithExisting(
                    existingBookingStart,
                    existingBookingEnd,
                    newBookingStart,
                    newBookingEnd
                )
            })
        })
}, `{REASON}`)


const room = mongoose.Schema({
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'hotel', required: true },
    number: {
        type: String,
        required: [true, 'Room number is required']
    },
    gallery: [{
        name: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now() }
    }],
    price: {
        type: Number,
        required: [true, 'Please specify price per night']
    },
    maxGuests: {
        type: Number,
        required: [true, 'Please specify maximum number of guests allowed']
    },
    bookings: [bookingSchema]

})

mongoose.model("room", room);
module.exports = room;