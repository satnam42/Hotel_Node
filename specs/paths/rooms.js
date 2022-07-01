module.exports = [{
    url: "/add",
    post: {
        summary: "add",
        description: "add room",
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
                description: "add room model",
                required: true,
                schema: {
                    $ref: "#/definitions/roomCreate"
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
                description: "room id",
                required: true
            },
            {
                in: "body",
                name: "body",
                description: "Model of room update",
                required: true,
                schema: {
                    $ref: "#/definitions/roomCreate"
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
    url: "/getRoomById/{id}",
    get: {
        summary: "getRoomById",
        description: "getRoomById",
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
                description: "room id",
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
    url: "/getRooms",
    get: {
        summary: "getRooms",
        description: "getRooms",
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
        description: "search",
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
                name: "guests",
                description: "hotel name",
                // required: true
            },
            {
                in: "query",
                type: "date",
                name: "checkIn",
                description: "checkIn",
                // required: true
            },
            {
                in: "query",
                type: "date",
                name: "checkOut",
                description: "checkOut",
                // required: true
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
    url: "/imageUpload/{id}",
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
                name: "roomId",
                description: "room id",
                required: true
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


];