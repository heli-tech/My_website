//<img width=80%  border=0 src='http://127.0.0.1:9000/uploads/username.png'></a>
sessionStorage.therooms = `<div role='button'   class=div_tablename onclick="loginroom('roomname')">
<div name=span_roomname class=span_tablename>roomname</div>
<div  name=x_roomname class=span_x>exerpt</div>
</div>`;
sessionStorage.theroomsnew = `<div role='button' class=div_tablename_new onclick="loginroom('roomname')">
<div  name=span_roomname  class=span_tablename>roomname</div>
<div  name=x_roomname  class=span_x>exerpt</div>
</div>`;
//<img width=80%  border=0 src='http://127.0.0.1:9000/uploads/username.png'></a>
sessionStorage.thecontent = `<a href=javascript:navig('username')>
    <img width=80%  border=0 src='http://127.0.0.1:9000/images/username.png?t=timestamp'></a>
    <br>
    <table class='framemenu'>
        <tr>
        <td align=center>
        <input type='button' class='leftbutton' onclick=javascript:navig('username') value='username'>
        </td>
        </tr>
    </table>
`;




const queryParams = new URLSearchParams(window.location.search);
var username = queryParams.get('username');
var devserver = queryParams.get('devserver');



var exampleSocket


var socketconnected = 0;
var validated = 0;
var theuser_id = 0;
var cptlines = 0;
var targetlist = 'listmainchat';
var targettext = 'mainchat';
var topbutton = 'buttonmainchat';
var theentrytext = 'thetext';
var chatroom
var chatroom_deleted
var archivedRoomLst = []
var deletedRoomLst = []
var no_archivedRoomLst = []
var is_chatlist_call = true

let chatserver = 'wss://webrtc.meetstream.com:9000/ws';
let baseUrl = "https://webrtc.meetstream.com:9000/"
chatServerConfig()
function chatServerConfig() {
  if (devserver == '1') {
    chatserver = 'ws://127.0.0.1:9000/ws';
    baseUrl = "http://127.0.0.1:9000/"
  }
}

function getRoomLst(key) {
  if (key == 'archived') {
    return archivedRoomLst;
  } else {
    return no_archivedRoomLst;
  }
}

function getBaseUrl(key) {
    return baseUrl;
  }

function getChatRoom() {
    return chatroom;
}
function InitifyRoom() {
    chatroom = ""
}
function getUsername() {
    return username;
}

// Send text to all users through the server
function sendText(mstContent,theunikey,thereplyid, is_priority) {
    // Construct a msg object containing the data the server needs to process the message from the chat client.
    var thetext = mstContent;


    if (chatroom != "") {


        var msg = {
            thetype: "message",
            themsg: thetext,
            theroom: chatroom,
            thepriority: is_priority.toString(),
            theunikey: theunikey.toString(),
            thereplyid:thereplyid
        };
        console.log("---message sending params", msg)
        //alert(activeroom);
        exampleSocket.send(JSON.stringify(msg));
        document.getElementById(theentrytext).value = "";
        document.getElementById(theentrytext).focus();
    } else {
        console.log("---kjkjk")
        writeTextToChat("Not in room !");
    }
}





// function ban(which) {
//     //alert(which);
//     var msg = {
//         thetype: "ban",
//         themsg: which, 
//         theroom: chatroom,          
//     };
//     exampleSocket.send(JSON.stringify(msg));
//     document.getElementById(theentrytext).focus();        

// }	

// function unban(which) {
//     //alert(which);
//     var msg = {
//         thetype: "unban",
//         themsg: which,  
//         theroom: chatroom,          
//     };
//     exampleSocket.send(JSON.stringify(msg));
//     document.getElementById(theentrytext).focus();        

// }

// function startrecord() {
//     which = sessionStorage.streamName;
//     event.preventDefault();
//     alert("startrecord");
//     var msg = {
//         thetype: "startrecord",
//         themsg: which,
//     };
//     exampleSocket.send(JSON.stringify(msg));
//     document.getElementById(theentrytext).focus();

// }

// function stoprecord() {
//     which = sessionStorage.streamName;
//     event.preventDefault();
//     alert("stoprecord");
//     var msg = {
//         thetype: "stoprecord",
//         themsg: which,
//     };
//     exampleSocket.send(JSON.stringify(msg));
//     document.getElementById(theentrytext).focus();

// }

function requestroomlist() {
    //alert("requestroomlist");
    var msg = {
        thetype: "roomlist"
    };
    exampleSocket.send(JSON.stringify(msg));
    document.getElementById("theentrytext").focus();

}



function requestnewchatuserlist() {
    var msg = {
        thetype: "newchatusers",
        theroom: chatroom
    };
    exampleSocket.send(JSON.stringify(msg));
    document.getElementById("theentrytext").focus();

}

function invitetoroom(whichuser, whichroom) {
    var msg = {
        thetype: "invitetoroom",
        themsg: whichuser,
        theroom: whichroom

    };
    exampleSocket.send(JSON.stringify(msg));
    document.getElementById("theentrytext").focus();

}

function requestcamlist(which) {
    event.preventDefault();
    //alert("resuqetsamlist");
    var msg = {
        thetype: "camlist"
    };
    exampleSocket.send(JSON.stringify(msg));
    document.getElementById("theentrytext").focus();

}


function handleKeyUp(event) {
    if (event.key === 'Enter') {
        sendtotext();
    }
}

function send_status(which) {
    //alert("changestatue :"+which);
    if (socketconnected == 1) { 
        var msg = {
            thetype: "status",
            themsg: which
        };
        console.log("--- status", which)
        exampleSocket.send(JSON.stringify(msg));
        document.getElementById("theentrytext").focus();
    }
   
    

}


//
// disconnect() fonction pour disconnecter lusager du serveur
function disconnect() {
    exampleSocket.close();
    socketconnected = 0;
}

function writeTextToChat(thetext) {
    console.log("---here is mesages for all", thetext)
    //f.write(thetext);
    cptlines = cptlines + 1;
    var textformat1 = "<span id=chat1" + cptlines + ">" + thetext + "</span>";
    //alert(textformat);

    if (cptlines > 50) {
        // alert("chat"+String(cptlines-9));
        try {
            document.getElementById("chat1" + String(cptlines - 50)).remove();
        }
        catch (err) {
            document.getElementById(targettext).innerHTML = "";
            cptlines = 1;
        }
    }
    // document.getElementById(targettext).innerHTML = document.getElementById(targettext).innerHTML + textformat1;
    // updateScroll(targettext);
}

// loginroom() fonction pour connecter lusager a une chambre 
function loginroom(whichroom) {
    if (socketconnected == 1) {
        var msg = {
            thetype: "login",
            theroom: whichroom
        };
        chatroom = whichroom
        exampleSocket.send(JSON.stringify(msg));
    } else {
        alert("socket not connected")
    }

}

function get_msg_from_msgid(whichid, iscallbloolean) {
    is_chatlist_call = iscallbloolean
    whichid=whichid.trim();
    if (whichid!=""){
        if (socketconnected==1){
            var msg = {
                thetype: "get_msg_from_msgid",
                themsg: whichid,
            };
            exampleSocket.send(JSON.stringify(msg));
        }  
    }
}

// createroom() 
function createroom(whichroom) {
    event.preventDefault();
    whichroom = whichroom.trim();
    if (whichroom != "") {

        if (socketconnected == 1) {
            var msg = {
                thetype: "create",
                theroom: whichroom
            };
            exampleSocket.send(JSON.stringify(msg));
        }
    }
}

// logoutroom() 
function logoutroom() {
    event.preventDefault();
    let whichroom = chatroom;
    whichroom = whichroom.trim();
    if (whichroom != "") {
        //alert("logout : " + whichroom);
        if (socketconnected == 1) {
            var msg = {
                thetype: "logout",
                theroom: whichroom
            };
            exampleSocket.send(JSON.stringify(msg));
            document.getElementById('mainchat').innerHTML = "";
            document.getElementById('listmainchat').innerHTML = "";
        }
    }
}

// validation() fonction pour valider le username/password devrairt etre fait avec un autre service
function validation() {
    
    event.preventDefault();
    if (socketconnected == 1) {
        var msg = {
            thetype: "validation",
            themsg: username,
        };
        exampleSocket.send(JSON.stringify(msg));

    } else {
        document.getElementById('errormsgtop').innerHTML = ' socket not connected ';
    }

}

// archiveroom() 
function archiveroom(whichroom, whichstate) {
    //whichstate=0 unarchive, 1 archive
    whichroom=whichroom.trim();
    if (whichroom!=""){
        if (socketconnected==1){
            var msg = {
                thetype: "archiveroom",
                themsg: whichstate,
                theroom:  whichroom
            };
            exampleSocket.send(JSON.stringify(msg));
        }  
    }

}

function set_room_status(whichroom, whichstate) {
    //whichstate=0 undelete, 1 delete, 2 archive
    whichroom=whichroom.trim();
    if (whichroom!=""){
        if (socketconnected==1){
            var msg = {
                thetype: "set_room_status",
                themsg: whichstate,
                theroom:  whichroom

            };
            exampleSocket.send(JSON.stringify(msg));
        }  
    }
}

function requestarchivedroomlist() {
    //alert("requestroomlist");
    var msg = {
        thetype: "achivedroomlist"                   
    };
    exampleSocket.send(JSON.stringify(msg));
    document.getElementById("theentrytext").focus();        

}

// deleteroom() 
function deleteroom(whichroom, whichstate) {
    //whichstate=0 undelete, 1 delete
    whichroom=whichroom.trim();
    if (whichroom!=""){
        if (socketconnected==1){
            var msg = {
                thetype: "deleteroom",
                themsg: whichstate,
                theroom:  whichroom

            };
            exampleSocket.send(JSON.stringify(msg));
            chatroom = ""
            const deleteChatRoomEvent = new CustomEvent("deletechatRoom", { detail: 'deleted chat' });
            window.dispatchEvent(deleteChatRoomEvent)
        }  
    }
}  

// lockroom() 
function lockroom(whichroom, whichstate) {
     //whichstate=0 unlock, 1 lock
    whichroom=whichroom.trim();
    if (whichroom!=""){
        if (socketconnected==1){
            var msg = {
                thetype: "lockroom",
                themsg: whichstate,
                theroom:  whichroom
            };
            exampleSocket.send(JSON.stringify(msg));
        }  
    }
}

function requestdeletedroomlist() {
    var msg = {
        thetype: "deletedroomlist"                   
    };
    exampleSocket.send(JSON.stringify(msg));
    document.getElementById("theentrytext").focus();        

}

function requestuserlist(fromroom) {

    var msg = {
        thetype: "userlist",
        theroom: fromroom               
    };
    exampleSocket.send(JSON.stringify(msg));
    document.getElementById("theentrytext").focus();        

} 


function sendFile(file,theunikey,thereplyid) {
    var msg = {
        thetype: "chatfiles",
        themsg: file,   
        theroom: chatroom,
        theunikey: theunikey.toString(),
        thereplyid:thereplyid
    };
    console.log("---file send param")
    console.log(msg)
    exampleSocket.send(JSON.stringify(msg));
    document.getElementById("theentrytext").focus();
}

function requestformessage(fromroom) {

    var msg = {
        thetype: "requestformessage",
        theroom: fromroom               
    };
    exampleSocket.send(JSON.stringify(msg));
    document.getElementById("theentrytext").focus();        

}



function setmessageread(msg_id) {

    var msg = {
        thetype: "setmessageread",
        themsg: msg_id               
    };
    exampleSocket.send(JSON.stringify(msg));
    document.getElementById("theentrytext").focus();        

}

// connect() fonction pour connecter au serveur	
function connect_to_server() {
    let theconnectstr = chatserver
    event.preventDefault();

    if (socketconnected == 0) {
        // writeTextToChat("Connecting to server ...<br>");
        console.log("@Connecting to server ...")
        exampleSocket = new WebSocket(theconnectstr);
    } else {
        exampleSocket.close();
        socketconnected = 0;
        exampleSocket = new WebSocket(theconnectstr);
    }

    exampleSocket.onopen = function (event) {
        //alert("on open reeceived");
        console.log("@Connected to server ...")
        // writeTextToChat("Connected to server<br>");
        socketconnected = 1;
        validated = 0;
        // writeTextToChat("Validating : " + username + "<br>");
        validation();

        // document.getElementById('errormsgtop').innerHTML = ' Connected to chat server ';
        afterserverconected();


    };

    exampleSocket.onclose = function (event) {
        //alert("socket closed !");
        if (socketconnected == 1) {
            var text = "<font size=5 color=red>Socket closed !</font>";
            // document.getElementById('mainchat').innerHTML = document.getElementById('mainchat').innerHTML + text;
            // updateScroll('mainchat');
            alert("Currently Socket closed !")
            socketconnected = 0;
            validated = 0;
            // document.getElementById('errormsgtop').innerHTML = ' Chat Server DisConnected ';
        }
    };

    exampleSocket.onmessage = function (event) {
        var text = "";
        //alert(event.data);
        var msg = JSON.parse(event.data);
     
        var theroom = msg.theroom;
        var d = new Date();
        var timeStr = d.toLocaleTimeString();
        //alert("on message:"+msg.themsg);
        //alert("on message:"+msg.thetype);        

        switch (msg.thetype) {
            case "banned":

            case "status":

                console.log("--- sttus update")

            case "login":
                //alert("login");
                chatroom = msg.theroom // la chambre active 
                let roomObj = {theid:"", themsg:"", theroom:"", thetimestp:"", theytype:"login", theusername:"", archived:"", isdeleted:"", islocked:""}
                let roomParseArr = msg.theroom.split(",") 
                roomObj["theid"] = msg.theid;
                roomObj["themsg"] = msg.themsg;
                roomObj["theroom"] = roomParseArr[0];
                chatroom = roomParseArr[0];
                roomObj["thetimestp"] = msg.thetimestp;
                roomObj["theytype"] = msg.theytype;
                roomObj["theusername"] = msg.theusername;
                let selected_room = archivedRoomLst.filter((item) => item.roomname === chatroom)
                if (selected_room.length) {
                    roomObj["archived"] = true;
                } else {
                    roomObj["archived"] = false;
                }
                // roomObj["archived"] = roomParseArr[1];
                // roomObj["isdeleted"] = roomParseArr[2];
                // roomObj["islocked"] = roomParseArr[3];
                console.log("---login room.......................")
                const chatRoomEvent = new CustomEvent("setchatRoom", { detail: roomObj });
                window.dispatchEvent(chatRoomEvent)

                

                // document.getElementById('buttoninvitechat').disabled = false;
                break;

            case "validation":

                //    msg.Theusername 
                //    msg.Theid  
                //       alert("validation :"+msg.theusername)
                //      alert("validation :"+msg.theid)
                validated = 1;
                theuser_id =  msg.theid;
                break;

            

            case "pull_userlist":
                var theroom = "";
                theroom=msg.theroom;
                //alert("pull_userlist : "+theroom);
                requestuserlist(theroom);
                break;

            case "requestformessage":
                
                var theroom = "";
                // theroom=msg.theroom;
                //alert("pull_userlist : "+theroom);
                break;

            case "newchatusers":


                // alert("newchatusers received :"+msg.themsg);

                var newchatuserslistreceived = msg.themsg;
                var newchatuserlist = newchatuserslistreceived.split(",");
                var theroom = msg.theroom;
                var tempname
                var tempuserstatus
                var tempuserconnstats
                var tempuseruserdesc
                var userlist = []
                var tempext = "Please select a user to invite :<br>";


                thecolor = "black";
                ul = ""
                for (i = 0; i < newchatuserlist.length - 1; i = i + 4) {
                    tempname = newchatuserlist[i];
                    tempuserstatus = newchatuserlist[i + 1];
                    tempuserconnstats = newchatuserlist[i + 2];
                    tempuseruserdesc = newchatuserlist[i + 3];
                    let userObj = {name:tempname, status:tempuserstatus, contactstatus:tempuserconnstats, description:tempuseruserdesc}
                    if (tempuserstatus == 0) {
                        userlist.push(userObj)
                    }                   

                    tempext = tempext + "<button onclick=setinvite('" + tempname + "');>";
                    tempext = tempext + tempname + " status : " + tempuserstatus + " connected : " + tempuserconnstats + " Description : " + tempuseruserdesc;
                    tempext = tempext + "</button><br>";



                }
                tempext = tempext + "<hr>";

                const newChatList = new CustomEvent("newChatUserList", { detail: userlist });
                window.dispatchEvent(newChatList)

                // document.getElementById('maininvite').innerHTML = tempext;
                break;

            case "deletedroomlist":
                var roomlistreceived = msg.themsg;
                var roomlist = roomlistreceived.split("][");

                var temptext = "";
                var tempname
                var tempexerpt
                var tempisnew
                var tempisowner
                var archived
                var isdeleted
                var islocked

                thecolor = "black";
                ul = "";
                deletedRoomLst = []
                for (var i = 0; i < roomlist.length - 1; i = i + 3) {

                    tempname = roomlist[i];
                    tempexerpt = roomlist[i + 1];
                    // isdeleted = roomlist[i + 3];
                    // islocked = roomlist[i + 4];
                    // archived = roomlist[i + 5];
                    tempexerpt = tempexerpt.trim();
                    if (tempexerpt == "") {
                        tempexerpt = "___";
                    }
                    var is_new = false
                    tempisnew = roomlist[i + 1];
                    tempisowner = roomlist[i + 2];

                    if (tempisnew == '0') {
                        temptext = sessionStorage.therooms;
                    } else {
                        temptext = sessionStorage.theroomsnew;
                        is_new = true
                    }

                    if (tempisowner == '0') {
                        isowner = false
                    } else {
                        isowner = true
                    }

                    let objectroom = {roomname:tempname, is_new:is_new, isowner:isowner }


                    let my_new_string = temptext.replaceAll('roomname', tempname);

                    my_new_string = my_new_string.replaceAll('exerpt', tempexerpt);

                    ul += my_new_string;
                    //i=roomlist.length; 
                    deletedRoomLst.push(objectroom)
                }

                const DeletedRoomList = new CustomEvent("DeletedRoomList", { detail: deletedRoomLst });
                window.dispatchEvent(DeletedRoomList)
                
                
                
            
            break;

            case "archivedroomlist":

                var roomlistreceived = msg.themsg;
                //alert("archived : " +roomlistreceived);
                var roomlist = roomlistreceived.split("][");

 
                var tempname
                var tempisnew
                var tempisowner

                var thearchivedroomlist = document.getElementById("archivedroomlist");
                var li;
                thecolor = "black";
                ul = "";
                archivedRoomLst = []
                for (var i = 0; i < roomlist.length - 1; i = i + 3) {

  
                    var is_new = false

                    tempname = roomlist[i];                    
                    tempisnew = roomlist[i + 1];
                    tempisowner = roomlist[i + 2];

                    if (tempisnew == '0') {
                        is_new = false
                    } else {
                        is_new = true
                    }

                    if (tempisowner == '0') {
                        isowner = false
                    } else {
                        isowner = true
                    }
                    li = document.createElement("li");
                    li.innerHTML="<a href=''>"+tempname+"</a>";
                    thearchivedroomlist.appendChild(li);

                    // let objectroom = {roomname:tempname, is_new:is_new, isowner:isowner }
                    // archivedRoomLst.push(objectroom)
                }

                const ArchivedRoomList = new CustomEvent("ArchivedRoomList", { detail: archivedRoomLst });
                window.dispatchEvent(ArchivedRoomList)

                if (chatroom) {
                    setTimeout(() => {
                        loginroom(chatroom)
                      }, 1500);
                }
            
            break;


            case "roomlist":
                
                var roomlistreceived = msg.themsg;
                
                var roomlist = roomlistreceived.split("][");

                var theroom = msg.theroom;
                var temptext = "";
                var tempname;
                var tempexerpt;
                var tempisnew;
                var tempisowner;

                var theroomlist = document.getElementById("roomlist");
                var li;

                thecolor = "black";
                ul = "";
                var roomArr = []
                for (var i = 0; i < roomlist.length - 1; i = i + 3) {

                    

                    var is_new = false
                    var isowner = false

                    tempname = roomlist[i];
                    tempisnew = roomlist[i + 1];
                    tempisowner = roomlist[i + 2];
    
                    if (tempisnew == '0') {
                        is_new = false
                    } else {
                        is_new = true
                    }
                    if (tempisowner == '0') {
                        isowner = false
                    } else {
                        isowner = true
                    }
                    li = document.createElement("li");
        

                    li.innerHTML="<a href=''>"+tempname+"</a>";
      // overhere1
                    theroomlist.appendChild(li);

                    // let objectroom = {roomname:tempname, is_new:is_new, isowner:isowner }
                    // roomArr.push(objectroom)                       

                }



                break;


            case "camlist":
                var camlistreceived = msg.themsg;
                var camlist = camlistreceived.split(",");
                var timestamp = new Date().getTime();
                var tempname
                // alert("camlist :"+camlist);
                thecolor = "black";
                ul = ""
                for (i = 0; i < camlist.length - 1; i = i + 1) {
                    temptext = sessionStorage.thecontent
                    tempname = camlist[i]
                    // alert(tempname);
                    // alert(temptext);
                    let my_new_string = temptext.replaceAll('username', tempname);
                    my_new_string = my_new_string.replaceAll('timestamp', timestamp);
                    //alert(my_new_string);
                    ul += my_new_string;

                }

                document.getElementById('listofcams').innerHTML = ul;

                break;

            case "error1": //usename already used
                break;
            case "usercounty": // number of users min room
                break;
            case "bannedlist":
                break;

            case "pull_message":
                var theroom = "";
                theroom=msg.theroom;
                const NewMessageEve = new CustomEvent("NewMessageEve", { detail: msg });
                window.dispatchEvent(NewMessageEve)
                requestformessage(theroom);
                break;

            
            case "message":
                
                if (chatroom == msg.theroom) {
                    let messageLst = []
                    console.log("---mess")
                    console.log(msg)
                    setmessageread(msg.theid)
                    messageLst.push(msg)
                    const ChatMessagesEve = new CustomEvent("ChatMessages", { detail: messageLst });
                    window.dispatchEvent(ChatMessagesEve)
                    setTimeout(() => {
                        updateScroll('chat-view-list')
                    }, 1000);
                    break;
                }
                break

            case "msg_from_msgid":
                console.log("-msg_from_msgid--")
                const ReplyMessagesEve = new CustomEvent("ReplyMessages", { detail: {msg:msg, is_chat_list:is_chatlist_call} });
                window.dispatchEvent(ReplyMessagesEve)
                break;

            case "userlist":
                //alert("userlist received :"+msg.themsg);
                var cptuser = 0;
                var thecolor = "black";
                var thelistreceived = msg.themsg;
                var userlist = thelistreceived.split(",");
                var ul = "";
                var chatUsers = []
                userlist.pop();
                for (let i = 0; i < userlist.length; i += 3) {
                    const user = {
                        username: userlist[i],
                        status: parseInt(userlist[i + 1], 10),
                        connstatus: parseInt(userlist[i + 2], 10)
                    };
                    if (userlist[i] !== username) {
                        chatUsers.push(user)
                    }
                }

                const chatUserList = new CustomEvent("ChatUserList", { detail: chatUsers });
                window.dispatchEvent(chatUserList)

                // document.getElementById(targetlist).innerHTML = ul;
                // document.getElementById(topbutton).innerHTML = "<font  ><b>&num;" + msg.theroom + " : " + cptuser + "</font></b>";
                // // set the video side 
                // document.getElementById("video_label_roomid").innerHTML = msg.theroom;
                // roomNameBox = msg.theroom;
                // //alert("roomnamebox: "+roomNameBox);
                // join_publish_button.disabled = false;
                // stop_publish_button.disabled = true;

                break;
        }

        if (text.length > 0) {
            console.log("--- chat text on message:", text)
            writeTextToChat(text);
            //      $("#"+topbutton).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);

        }
    };
}; // fonction connect

// =======================================================  start of chat 


function setinvite(whichusername) {

    invitetoroom(whichusername, chatroom);
    // document.getElementById('maininvite').innerHTML = "";
    // showmainchat();


}

// function showmainchat(){
//     document.getElementById("mainchat").style.display = "block";


//     document.getElementById("maininvite").style.display = "none"; 

// }

function afterserverconected(which) {
    // writeTextToChat("Requesting roomlist <br>");
    requestroomlist();
    requestarchivedroomlist()
    requestdeletedroomlist()
    //            writeTextToChat("Requesting newchatuserlist<br>");

}

// function beforerequestusers(){



// 	if (document.getElementById("maininvite").style.display=="none"){
// 		// alert("beforerequestusers")
//     document.getElementById("mainchat").style.display = "none";


//     document.getElementById("maininvite").style.display = "block";   

//     requestnewchatuserlist(chatroom);		
// 	}
// 	else
// 	{

// 	document.getElementById("mainchat").style.display = "block";
// 	document.getElementById("maininvite").style.display = "none";  
// 	}
// }

function sendtotext(which) {
    sendText(which);
}


function updateScroll(whichone){
	var element = document.getElementById(whichone);
	element.scrollTop = 0;
}

// function SendLink2(){

// 	var tuseremail= sessionStorage.useremail;
// 	var ttheroom= chatroom;
// 	var ttheagent= username;	

// 	theurl="send_email.php?theroom="+ttheroom+"&useremail="+tuseremail+"&theagent="+ttheagent;
// 	//alert(theurl);
// 	$.get(theurl, function(data, status){
// 	//alert("Data: " + data + "\nStatus: " + status);
// 	});
// }

// function takepic(whichstream) {
// 	alert("Taking pic user1");
// }	

