// Bunch of constants used throughout the program
// TODO: organize these better into arrays or something maybe
chatboxClass = "chat-lines";
chatMessageClass1 = "chat-line";
chatMessageClass2 = "chat-line highlight";
chatMessageClass3 = "chat-line action";
chatMessageClass4 = "chat-line admin";
chatMessageContent = "message";
chatMessageSenderClass = "data-sender";

botCommands = ["!spin", "!heist"]

// Stores useful information about a chat message
// Parameters:
//   variable.text - message text
//   variable.sender - name of message sender
//   variable.type - type of message (highlight, action, admin, etc.)
function Message (node) {
    // Get message text
    var messageSpan = node.getElementsByClassName(chatMessageContent)[0];
    this.text = messageSpan.innerHTML;

    // Get message Sender
    this.sender = node.getAttribute(chatMessageSenderClass);

    // Get message type
    this.type = node.className
}




/*****************************************************************************
**                                                                          **
** Only changes to this function are necessary to filter different messages **
**                                                                          **
******************************************************************************
*/

// See if message matches any filters
//   Return True if message should be deleted
//   Return false if message has no match
var filterMessage = function (msgObj) {
    // TODO: match exceptions first (i.e. block user X unless they highlight me)

    // Simple example of allowing message on highlight
    //   if the message is type chat-line highlight then it included the user's username
    if (msgObj.type == chatMessageClass2) {
        return false;
    }

    // TODO: match for more specific commands and messages
    if (msgObj.sender.toLowerCase() == "hugo__bot") {
        return true;
    }

    // Example loop through bot commands
    for (i = 0; i < botCommands.length; i++) {
        if (msgObj.text.toLowerCase().includes(botCommands[i])) {
	    // short circuit
	    return true;
	}
    }


    // Default return false, no matched filter
    return false;
};
/*****************************************************************
**                                                              **
** Rest of program unnecessary to change for filtering messages **
**                                                              **
******************************************************************
*/




// MutationObserver Function that hooks on all added chat message elements
function MessageFilter() {
    return new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (addedNode) {

                // Check if the addedNode is one of the chatMessage Classes
		//  TODO: just check wild card match ^chat-line*
		//  Make this better with an array of sorts?
                if ((addedNode.className == chatMessageClass1 ||
	             addedNode.className == chatMessageClass2 ||
	             addedNode.className == chatMessageClass3 ||
		     addedNode.className == chatMessageClass4 )) {

                    // Builds a message object with useful info from addedNode
                    var msgObj = new Message(addedNode);

		    // Pass the message object to the filter for matching
                    if (filterMessage(msgObj)) {
		        addedNode.parentNode.removeChild(addedNode);
                        console.log("Matched and deleted message.");
	            }
	        } else {
                    // Not a chat message, do nothing for now (probably will stay empty so unneeded)
	            return;
	        }
            });
        });
    });
}

// MutationObserver config parameters
var config = {attributes: false, childList: true, characterData: false};

// prepare a Message Filter object
var messageFilter = MessageFilter();

// Get the body to search for the chatbox
var htmlBody = document.getElementsByTagName("body")[0];

// MutationObserver Function that hooks changes to the body
var chatboxObserver = new MutationObserver(function (mutations, observer) {
    mutations.forEach(function (mutation) {

	// Get the chatbox element
        var chatbox = document.getElementsByClassName(chatboxClass);

	// If 0 the chatbox has not loaded yet
        if (chatbox.length > 0) {
	    // First element is chatbox
            var target = chatbox[0];

	    // Hook changes to chatbox (newly added messages)
            messageFilter.observe(target, config);

            // Print debugging and disconnect hook on body (only need updates from message filter)
            console.log("Attached to Chat Element.");
            observer.disconnect();
        }
    })
});

// start the hooks
chatboxObserver.observe(htmlBody, config);
