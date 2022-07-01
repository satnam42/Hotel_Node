module.exports = [
    {
        name: "bookingRoom",
        properties: {
            userId: {
                type: "string"
            },
            bookingStart: {
                type: "date"
            },
            bookingEnd: {
                type: "date"
            },
            purpose: {
                type: "string"
            },
            roomId: {
                type: "string"
            },
        }
    }
];