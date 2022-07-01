module.exports = [{

    url: "/roomById/{id}",
    put: {
        summary: "roomById",
        description: "roomById",
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
            },
            {
                in: "body",
                name: "body",
                description: "Model of booking room",
                required: true,
                schema: {
                    $ref: "#/definitions/bookingRoom"
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