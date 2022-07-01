module.exports = [{
    url: "/add",
    post: {
        summary: "add",
        description: "add hotel",
        parameters: [
            {
                in: "header",
                name: "x-access-token",
                description: "token to access api",
                required: true,
                type: "string"
            },
            {
                in: "body",
                name: "body",
                description: "add hotel model",
                required: true,
                schema: {
                    $ref: "#/definitions/hotelCreate"
                }
            }
        ],
        responses: {
            default: {
                description: "Unexpected error",
                schema: {
                    $ref: "#/definitions/Error"
                }
            }
        }
    }
},
{
    url: "/update/{id}",
    put: {
        summary: "update",
        description: "update",
        parameters: [
            {
                in: "header",
                name: "x-access-token",
                description: "token to access api",
                required: true,
                type: "string"
            },
            {
                in: "path",
                type: "string",
                name: "id",
                description: "hotel id",
                required: true
            },
            {
                in: "body",
                name: "body",
                description: "Model of hotel update",
                required: true,
                schema: {
                    $ref: "#/definitions/hotelCreate"
                }
            }
        ],
        responses: {
            default: {
                description: "Unexpected error",
                schema: {
                    $ref: "#/definitions/Error"
                }
            }
        }
    }
},
// {
//     url: "/getSimilarHotel",
//     put: {
//         summary: "getSimilarHotel",
//         description: "getSimilarHotel",
//         parameters: [
//             {
//                 in: "query",
//                 type: "string",
//                 categoryId: "categoryId",
//                 description: "categoryId",
//                 required: true
//             },
//         ],
//         responses: {
//             default: {
//                 description: "Unexpected error",
//                 schema: {
//                     $ref: "#/definitions/Error"
//                 }
//             }
//         }
//     }
// },

{
    url: "/getHotelById/{id}",
    get: {
        summary: "getHotelById",
        description: "getHotelById",
        parameters: [
            // {
            //     in: "header",
            //     name: "x-access-token",
            //     description: "token to access api",
            //     required: true,
            //     type: "string"
            // },
            {
                in: "path",
                type: "string",
                name: "id",
                description: "hotel id",
                required: true
            },],
        responses: {
            default: {
                description: "Unexpected error",
                schema: {
                    $ref: "#/definitions/Error"
                }
            }
        }
    }
},
{
    url: "/getHotels",
    get: {
        summary: "getHotels",
        description: "getHotels",
        parameters: [
            // {
            //     in: "header",
            //     name: "x-access-token",
            //     description: "token to access api",
            //     required: true,
            //     type: "string"
            // },
            // {
            //     in: "path",
            //     type: "string",
            //     name: "id",
            //     description: "hotel id",
            //     required: true
            // },
        ],
        responses: {
            default: {
                description: "Unexpected error",
                schema: {
                    $ref: "#/definitions/Error"
                }
            }
        }
    }
},
{
    url: "/search",
    get: {
        summary: "search",
        description: "search hotel by name ",
        parameters: [
            {
                in: "header",
                name: "x-access-token",
                description: "token to access api",
                required: true,
                type: "string"
            },
            {
                in: "query",
                type: "string",
                name: "name",
                description: "hotel name",
                required: true
            },],
        responses: {
            default: {
                description: "Unexpected error",
                schema: {
                    $ref: "#/definitions/Error"
                }
            }
        }
    }
},
{
    url: "/byFilter",
    get: {
        summary: "byFilter",
        description: "hotel by Filter ",
        parameters: [
            // {
            //     in: "header",
            //     name: "x-access-token",
            //     description: "token to access api",
            //     required: true,
            //     type: "string"
            // },
            {
                in: "query",
                type: "number",
                name: "rating",
                description: "rating",
            },
            {
                in: "query",
                type: "number",
                name: "priceFrom",
                description: "priceFrom",
            },
            {
                in: "query",
                type: "number",
                name: "priceTo",
                description: "priceTo",
            },
            {
                in: "query",
                type: "string",
                name: "paymentMode",
                description: "set it online or offline",
            },
            {
                in: "query",
                type: "boolean",
                name: "isFreeCancellation",
                description: "set it true or false",
            },
            {
                in: "query",
                type: "boolean",
                name: "isMealAvailable",
                description: "set it true or false",
            },
            {
                in: "query",
                type: "boolean",
                name: "isParkingAvailable",
                description: "set it true or false",
            },
            {
                in: "query",
                type: "boolean",
                name: "isPetAllow",
                description: "set it true or false",
            },
            {
                in: "query",
                type: "number",
                name: "lat",
                description: "lat",
            },
            {
                in: "query",
                type: "number",
                name: "long",
                description: "long",
            },
            {
                in: "query",
                type: "number",
                name: "distance",
                description: "write distance in km like  1",
            },

        ],
        responses: {
            default: {
                description: "Unexpected error",
                schema: {
                    $ref: "#/definitions/Error"
                }
            }
        }
    }
},
{
    url: "/imageUpload/{hotelId}/{type}",
    put: {
        summary: "upload images",
        description: "upload images",
        parameters: [
            {
                in: "header",
                name: "x-access-token",
                description: "token to access api",
                required: true,
                type: "string"
            },
            {
                in: "formData",
                name: "image",
                type: "file",
                description: "The file to upload.",
                required: true,
            },
            {
                in: "path",
                type: "string",
                name: "hotelId",
                description: "hotel id",
                required: true
            },
            {
                in: "path",
                type: "string",
                name: "type",
                description: "type is banner or gallery",
                required: true
            }
        ],
        responses: {
            default: {
                description: "Unexpected error",
                schema: {
                    $ref: "#/definitions/Error"
                }
            }
        }
    }
},
// {
//     url: "/makeFavOrUnfav",
//     post: {
//         summary: "makeFavOrUnfav",
//         description: "makeFavOrUnfav",
//         parameters: [{
//             in: "body",
//             name: "body",
//             description: "model of makeFavOrUnfav",
//             required: true,
//             schema: {
//                 $ref: "#/definitions/favOrUnFav"
//             }
//         }],
//         responses: {
//             default: {
//                 description: "Unexpected error",
//                 schema: {
//                     $ref: "#/definitions/Error"
//                 }
//             }
//         }
//     }
// },
// {
//     url: "/favList/{id}",
//     get: {
//         summary: "fav hotel List",
//         description: "fav hotel List",
//         parameters: [
//             // {
//             //     in: "header",
//             //     name: "x-access-token",
//             //     description: "token to access api",
//             //     required: true,
//             //     type: "string"
//             // },
//             {
//                 in: "path",
//                 type: "string",
//                 name: "id",
//                 description: "user id",
//                 required: true
//             },],
//         responses: {
//             default: {
//                 description: "Unexpected error",
//                 schema: {
//                     $ref: "#/definitions/Error"
//                 }
//             }
//         }
//     }
// },
// {
//     url: "/byStoreId/{id}",
//     get: {
//         summary: "hotel List",
//         description: "hotel List",
//         parameters: [
//             // {
//             //     in: "header",
//             //     name: "x-access-token",
//             //     description: "token to access api",
//             //     required: true,
//             //     type: "string"
//             // },
//             {
//                 in: "path",
//                 type: "string",
//                 name: "id",
//                 description: "store id",
//                 required: true
//             },],
//         responses: {
//             default: {
//                 description: "Unexpected error",
//                 schema: {
//                     $ref: "#/definitions/Error"
//                 }
//             }
//         }
//     }
// },
{
    url: "/ratingReview",
    post: {
        summary: "add rating and Review",
        description: "add rating and Review",
        parameters: [
            {
                in: "header",
                name: "x-access-token",
                description: "token to access api",
                required: true,
                type: "string"
            },
            {
                in: "body",
                name: "body",
                description: "add ratingReview model",
                required: true,
                schema: {
                    $ref: "#/definitions/ratingReview"
                }
            }
        ],
        responses: {
            default: {
                description: "Unexpected error",
                schema: {
                    $ref: "#/definitions/Error"
                }
            }
        }
    }
},
];