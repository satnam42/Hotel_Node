var socketio = require('socket.io');
var events = require('events');
var moment = require('moment');
var _ = require('lodash');
var eventEmitter = new events.EventEmitter();
const service = require('../services/notifications')

const connect = async (io, logger) => {
    // const sockets = async (http, logger) => {
    const log = logger.start(`sockets:socketEvents:connect`);
    // io = socketio.listen(http);
    var ioChat = io
    var userStack = {};
    var oldChats, sendUserStack;
    var userSocket = {};

    ioChat.on('connection', async (socket) => {
        log.info("socketio chat connected.");
        let userId = socket.userId
        if (socket.userId == undefined || socket.userId == "") {
            socket.emit('oops', {
                event: 'token is not valid',
                data: 'token is not valid'
            });
        }

        //function to get user name
        // socket.emit('set-user-data', (userId) => {
        // })
        // socket.on('set-user-data', (userId) => {
        //     if (!userId) {
        //         log.info('userId is required', userId)
        //         // socket.emit('oops', {
        //         //     status:"NOK",
        //         //     event: 'set-user-data',
        //         //     data: 'set-user-data is required'
        //         // });
        //         socket.emit('oops', {
        //             // status:"NOK",
        //             event: 'set-user-data',
        //             data: 'set-user-data is required'
        //         });
        //     } else {
        // socket.on('connect_failed', function () {
        //     console.log("Sorry, there seems to be an issue with the connection!");
        // })

        // socket.on("connect_error", (err) => {
        //     console.log(err.message); // prints the message associated with the error
        // });
        // }); /

        log.info(userId + "  logged In");
        //storing variable.
        // socket.userId = userId;
        userSocket[socket.userId] = socket.id;
        log.info("userSocket", userSocket)
        //getting all users list
        eventEmitter.emit('get-all-users');
        // sending all users list. and setting if online or offline.
        sendUserStack = function () {
            for (i in userSocket) {
                for (j in userStack) {
                    if (j == i) {
                        userStack[j] = "Online";
                    }
                }
            }
            //for popping connection message.
            ioChat.emit('onlineStack', userStack);
        } //end of sendUserStack function.
        // }
        // }); //end of set-user-data event.

        //setting room.
        socket.on('set-room', async function (room) {
            log.info('set-room called', { room })
            //leaving room. 
            socket.leave(socket.room);
            try {
                //getting room data.
                // eventEmitter.emit('get-room-data', room);
                let conversation = await getRoomAndSetRoom(room)
                //setting room and join.
                if (conversation) {
                    socket.room = conversation.id;
                    log.info("roomId : " + socket.room);
                    socket.join(socket.room);
                    ioChat.to(userSocket[socket.userId]).emit('set-room', socket.room);
                }
            } catch (e) {
                log.info('set-room Err', e.message)
                socket.emit('oops',
                    {
                        event: 'set-room',
                        data: e.message
                    });
            }


        }); //end of set-room event.

        //showing msg on typing.
        socket.on('typing', function () {
            socket.to(socket.room).broadcast.emit('typing', " typing...");
        });

        // ioChat.to(socket.room).emit('chat-msg', {
        //     msgFrom: socket.userId,
        //     msg: data.msg,
        //     date: msgDate
        // });
        //for showing chats.

        socket.on('chat-msg', async function (data) {
            log.info('chat-msg called', { data })
            try {
                if (data.gift) {
                    await saveChat({
                        msgFrom: socket.userId,
                        msg: data.msg,
                        giftId: data.gift.id,
                        msgTo: data.msgTo,
                        room: socket.room,
                        date: data.date
                    })
                } else {
                    await saveChat({
                        msgFrom: socket.userId,
                        msg: data.msg,
                        msgTo: data.msgTo,
                        room: socket.room,
                        date: data.date
                    })
                }

                const user = await db.user.findById(socket.userId)
                if (user && user.deviceToken != "" && user.deviceToken != undefined) {
                    let response
                    if (data.gift) {
                        response = service.pushNotification(user.deviceToken, user.firstName, "gift", data.gift)

                    } else {
                        response = service.pushNotification(user.deviceToken, user.firstName, "messaging", data.msg)
                    }
                    log.info('pushNotification', { response })
                }
                let msgDate = moment.utc(data.date).format()
                ioChat.to(socket.room).emit('chat-msg', {
                    msgFrom: socket.userId,
                    msg: data.msg,
                    gift: data.gift,
                    date: msgDate
                });
            } catch (e) {
                log.info('chat-msg Err', e.message)
                socket.emit('oops',
                    {
                        event: 'chat-msg',
                        data: e.message
                    });
                return;
            }


            // for (user in userStack) {

            //     if (user == socket.userId) {
            //         delete userStack[user]
            //     }

            // }

            // let addUser = socket.userId

            // const updateStack = { [addUser]: 'Online', ...userStack }

            // userStack = updateStack;

            // ioChat.emit('onlineStack', userStack);

        });

        // =====================================call events start====================================
        socket.on('set-channel', async function (cannelName) {
            log.info('join-cannel', { cannelName })

            if (!cannelName || cannelName == "" || cannelName == undefined) {
                socket.emit('oops',
                    {
                        event: 'set-channel',
                        data: "cannelName is required"
                    });
            } else {
                //leaving room. 
                socket.leave(socket.room);
                socket.room = cannelName
                socket.join(socket.room);
            }

            // ioChat.to(userSocket[socket.userId]).emit('set-room', socket.room);
            //     }
            //     } catch (e) {
            //     log.info('set-room Err', e.message)
            //     
            // }


        }); //end of set-cannel event.

        socket.on('call-end', async function (data) {
            log.info('call-end called', { data })
            try {
                ioChat.to(socket.room).emit('call-end', {});
                socket.leave(socket.room);
            } catch (e) {
                log.info('call-end Err', e.message)
                socket.emit('oops',
                    {
                        event: 'call-end',
                        data: e.message
                    });
                return;
            }



            // for (user in userStack) {

            //     if (user == socket.userId) {
            //         delete userStack[user]
            //     }

            // }

            // let addUser = socket.userId

            // const updateStack = { [addUser]: 'Online', ...userStack }

            // userStack = updateStack;

            // ioChat.emit('onlineStack', userStack);

        });

        // =====================================call events end====================================//


        // =====================================call receive start====================================//

        socket.on('call-receive', async function (data) {
            log.info('call-receive called', { data })
            try {
                data.callerId
                data.receiverId
                ioChat.to(socket.room).emit('call-receive', {});
                socket.leave(socket.room);
            } catch (e) {
                log.info('call-receive Err', e.message)
                socket.emit('oops',
                    {
                        event: 'call-end',
                        data: e.message
                    });
                return;
            }
        })

        // =====================================call receive start====================================//

        //for popping disconnection message.
        socket.on('disconnect', function () {
            log.info(socket.userId + "  logged out");
            socket.broadcast.emit('broadcast', { description: socket.userId + ' Logged out' });
            log.info("chat disconnected.");
            _.unset(userSocket, socket.userId);
            // userStack[socket.userId] = "Offline";
            // ioChat.emit('onlineStack', userStack);
        }); //end of disconnect event.
    }); //end of io.on(connection).
    //end of socket.io code for chat feature.

    //database operations are kept outside of socket.io code.

    getRoomAndSetRoom = async (room) => {
        log.info("getRoomAndSetRoom:", room)
        var today = Date.now();
        if (room && room.conversationFrom == "" && room.conversationTo == "") {
            log.info("set-room parameter is required");
            throw new Error('set-room parameter is required')
        }
        if (room.conversationFrom == room.conversationTo) {
            log.info("set-room parameter is required");
            throw new Error('set-room parameter not be same ')
        }

        let conversation = await db.conversation.findOne({ $or: [{ user1: room.conversationFrom, user2: room.conversationTo }, { user1: room.conversationTo, user2: room.conversationFrom }] })
        if (!conversation) {
            const conversation = await new db.conversation({
                user1: room.conversationFrom,
                user2: room.conversationTo,
                lastActive: today,
                createdOn: today
            }).save()
            log.info("conversation saved ");
            return conversation
            // setRoom(conversation._id)
        } else {
            conversation.lastActive = today
            await conversation.save()
            return conversation
            // setRoom(conversation._id)
        }


    }


    saveChat = async (data) => {
        log.info("saveChat:", data)
        if (!data) {
            throw new Error('message body is Required')
        }
        if (!data.msg) {
            throw new Error('msg is Required')
        }
        if (!data.room) {
            throw new Error('room id is Required')
        }
        if (!data.msgTo) {
            throw new Error('msgTo  is Required')
        }
        const message = await new db.message({
            sender: data.msgFrom,
            receiver: data.msgTo,
            gift: data.giftId,
            content: data.msg,
            read: data.read || true,
            conversation: data.room
        }).save()

        if (data.gift !== "" || data.gift != undefined) {

            //=================== sender coin detail =====================
            let coin = await db.coin.findOne({ user: data.msgFrom })

        }

        log.info("message saved .");
        return message

    }


    //saving chats to database.
    // eventEmitter.on('save-chat', async (data) => {
    //    log.info("save-chat:", data)
    //     // var today = Date.now();
    //     try {
    //         if (data == undefined || data == null || data == "") {
    //            log.info("message body not received ");
    //         }

    //         const message = await new db.message({
    //             sender: data.msgFrom,
    //             receiver: data.msgTo,
    //             content: data.msg,
    //             read: data.read || true,
    //             conversation: data.room
    //         }).save()

    //         if (message) {
    //            log.info("message saved .");
    //         }

    //     } catch (error) {
    //        log.info("message Error : " + error);
    //     }
    // });

    //end of saving chat.

    //listening for get-all-users event. creating list of all users.

    eventEmitter.on('get-all-users', function () {
        db.user.find({})
            .select('name')
            .exec(function (err, result) {
                if (err) {
                    log.info("Error : " + err);
                } else {
                    userStack = {}
                    //console.log(result);
                    for (var i = 0; i < result.length; i++) {
                        userStack[result[i].id] = "Offline";
                    }
                    //console.log("stack "+Object.keys(userStack));
                    sendUserStack();
                }
            });
    }); //end of get-all-users event.

    //listening get-room-data event.

};

exports.connect = connect;
// exports.sockets = sockets;