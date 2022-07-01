module.exports = [
    {
        name: "hotelCreate",
        properties: {
            description: {
                type: "string"
            },
            name: {
                type: "string"
            },
            price: {
                type: "number"
            },
            rooms: {
                type: "number"
            },
            tax: {
                type: "number"
            },

            isParkingAvailable: {
                type: "boolean",
                default: false
            },
            isWifiAvailable: {
                type: "boolean",
                default: false
            },
            isMealAvailable: {
                type: "boolean",
                default: false
            },
            isPetAllow: {
                type: "boolean",
                default: false
            },
            isFreeCancellation: {
                type: "boolean",
                default: false
            },
            discount: {
                type: "string"
            },
            paymentMode: {
                default: "offline",
                enum: ["offline", "online"],
            },
            // categoryId: {
            //     type: "string"
            // },
            // brand: {
            //     type: "string"
            // },
            isOnDiscount: {
                type: "boolean",
                default: false
            },
            // deviceToken: {
            //     type: "string"
            // },
            // feature: {
            //     // properties: {
            //     type: 'array',
            //     items: {
            //         properties: {
            //             key: { type: 'string' },
            //             value: { type: 'string' }
            //         },
            //     }
            //     // }
            // },
            location: {
                // properties: {
                properties: {
                    type: 'array',
                    // items: {
                    coordinates: { type: 'number' }
                    // },
                }
                // }
            }
        },
    }
];