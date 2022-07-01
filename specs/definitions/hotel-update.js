module.exports = [
    {
        name: "hotelUpdate",
        properties: {
            description: {
                type: "string"
            },
            name: {
                type: "string"
            },
            masterPrice: {
                type: "number"
            },
            isOnDiscount: {
                type: "boolean",
                default: false
            },
            storeId: {
                type: "string"
            },
            discount: {
                type: "string"
            },
            // deviceToken: {
            //     type: "string"
            // },
            // size: {
            //     // properties: {
            //     type: 'array',
            //     items: {
            //         properties: {
            //             value: { type: 'string' },
            //             price: { type: 'number' }
            //         },
            //     }
            //     // }
            // },
            // colors: {
            //     // properties: {
            //     type: 'array',
            //     items: {
            //         properties: {
            //             name: { type: 'string' },
            //             price: { type: 'number' }
            //         },
            //     }
            //     // }
            // },
            feature: {
                // properties: {
                type: 'array',
                items: {
                    properties: {
                        key: { type: 'string' },
                        value: { type: 'string' }
                    },
                }
                // }
            }
        },
    }
];