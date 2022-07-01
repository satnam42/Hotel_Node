const moment = require("moment");
const ObjectId = require("mongodb").ObjectId


const durationHours = (bookingStart, bookingEnd) => {
    // convert the UTC Date objects to Moment.js objeccts
    let startDateLocal = moment(bookingStart)
    let endDateLocal = moment(bookingEnd)
    // calculate the duration of the difference between the two times
    let difference = moment.duration(endDateLocal.diff(startDateLocal))
    // return the difference in decimal format
    return difference.hours() + difference.minutes() / 60
}

const book = async (id, model, context) => {
    const log = context.logger.start("services:bookings:book");
    let res = await db.room.findByIdAndUpdate(
        id,
        {
            $addToSet: {
                bookings: {
                    user: model.userId,
                    // The hour on which the booking starts, calculated from 12:00AM as time = 0
                    startHour: moment(model.bookingStart).format('H.mm'),
                    // The duration of the booking in decimal format
                    duration: durationHours(model.bookingStart, model.bookingEnd),
                    // Spread operator for remaining attributes
                    ...model
                }
            }
        },
        { new: true, runValidators: true, context: 'query' }
    )
    return res
};




exports.book = book;


