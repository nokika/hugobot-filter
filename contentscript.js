// Variables used throughout program
var muteChecked = false;
var soundsChecked = false;
var commandsChecked = false;

// Initialize options variables
function restore_options() {
  chrome.storage.sync.get({
    mute: true,
    sounds: true,
    commands: true
  }, function(items) {
    muteChecked = items.mute;
    soundsChecked = items.sounds;
    commandsChecked = items.commands;
  });
}

// TODO: calling this right away, but is this function ever used again?
restore_options();

// Bunch of constants used throughout the program
// TODO: organize these better into arrays or something maybe
// TODO: rename this to something meaningful
chatboxClass = "chat-lines";
chatMessageClass1 = "chat-line";
chatMessageClass2 = "chat-line highlight";
chatMessageClass3 = "chat-line action";
chatMessageClass4 = "chat-line admin";
chatMessageContent = "message";
chatMessageSenderClass = "data-sender";

// Arrays of messages to block
botCommands = ["!brag", "!time", "!8ball", "!sounds"]

// TODO: would a hashmap give better performance for these array?
// similar space requirements? less cpu cycles?
botSounds = [
          // San Andreas Sounds
          "!AssTech", "!DriveThru", "!Fries", "!Home", "!Input",
	  "!LittleMan", "!OGLocRap", "!Porty", "!Shermhead", "!Smoke",
	  "!Watching", "!Genius", "!4Life", "!Smoke2", "!Meth", "!Asshole",
	  "!DemDuckets", "!Mamas", "!Suck", "!SendDuckets", "!MyDuckets",
	  "!DamnTrain", "!NinjaStyle", "!RoadRage", "!CrackMan",

           // Grand Theft Auto V
	   "!TinyPeePee", "!Molester",

	   // Gorillazrockstar
	   "!GLying", "!GShootHerAss", "!GChatOrgy", "!HeatOfTheMoment",
	   "!GorillazOrgy", "!GorillazBooty",

	   // Popular Memes
	   "!DeezNuts", "!Flavored", "!Fuck", "!JohnCena", "!JohnCena2",
	   "!MudJug", "!Narrow", "!ShootHerAss", "!WhatAreThose", "!Lying",
	   "!21", "!Jeff", "!Cry", "!Bruh", "!LeeroyJenkins", "!Lebron",
	   "!Turtles", "!Whistle", "!Uhhh", "!Pussy", "!RKO", "!NotGay",
	   "!JustDoIt", "!MVP", "!Laugh", "!DoItLive", "!OhJYeah",
	   "!GetTheCamera", "!Haters", "!HellNaw", "!Damn", "!Butt",
	   "!Hoodrat", "!DickButt", "!Neck", "!Rap", "!Profanity", "!Pear",
	   "!BBQ", "!Legitness", "!MeatFist", "!Pull", "!Purse", "!Kitty",
	   "!ThisSide", "!WTF", "!Triple", "!Milk", "!Dirty", "!TrainGuy",
	   "!Crack", "!Grass", "!Candy", "!STFUNokika", "!Chip", "!ByTheWay",
	   "!Bitch", "!Respek", "!Dammit", "!Cars", "!CashiePrank",

	   // Personal Sounds
	   "!Pow", "!ILL", "!PussyTown", "!NoTime", "!ScienceBitch", "!Whores",
	   "!NokikasTruck", "!Cocksucker", "!RickRoll", "!Drama", "!Joke",
	   "!DontListen", "!Pikachu", "!Rapist", "!HellYeah", "!FYou",
           "!SuckMyBalls", "!High", "!JoeysWorldTour", "!Quiltie", "!Meep",
	   "!WaySheGoes", "!PhoneSex", "!BigBoobs", "!ItsOnlyGame", "!OMG",
           "!OhThru", "!FuckIlluminati", "!Truth", "!RapThru", "!SayItToMyFace",
	   "!HiAdam", "!Bowling", "!FuckHugo", "!FuckedUp", "!RefuckIlluminati"]

// Stores useful information about a chat message
// Parameters:
//   variable.text - message text
//   variable.sender - name of message sender
//   variable.type - type of message (highlight, action, admin, etc.)
//   TODO: I could parse the message content here (i.e. spin command, sound command...)
//      could use this for better filtering later
function Message(node) {
    // Get message text
    var messageSpan = node.getElementsByClassName(chatMessageContent)[0];
    this.text = messageSpan.innerHTML;

    // Get message Sender
    this.sender = node.getAttribute(chatMessageSenderClass);

    // Get message type
    this.type = node.className
}



// Simple helper function
//   returns true if msg is in the list
//   otherwise false
function isMember(msg, list) {
  for (i = 0; i < list.length; i++) {
    if (msg.toLowerCase().includes(list[i])) {
      return true;
    }
  }

  return false;
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
var filterMessage = function(msgObj) {
    // TODO: match exceptions first (i.e. block user X unless they highlight me)

    // Simple example of allowing message on highlight
    //   if the message is type chat-line highlight then it included the user's username
    if (msgObj.type == chatMessageClass2) {
        return false;
    }

    // if mute is checked block all
    if (muteChecked == true) {
      if (isMember(msgObj.text, botSounds) ||
	  msgObj.sender.toLowerCase() == "hugo__bot" ||
	  isMember(msgObj.text, botCommands)) {
        return true;
      }
    }


    // Should viewer sound commands be blocked?
    if (soundsChecked) {
      if (isMember(msgObj.text, botSounds)) {
        return true;
      }
    }

    // Should viewer commands be blocked?
    if (commandsChecked) {
        if (isMember(msgObj.text, botCommands)) {
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

// Start a hook listening for updates to options from the popup
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("Received a message from updated options.");
    muteChecked = request.mute;
    soundsChecked = request.sounds;
    commandsChecked = request.commands;
  });

// First find chat box once page is loaded, then find messages
chatboxObserver.observe(htmlBody, config);
