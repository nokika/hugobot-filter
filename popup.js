// Save all options to database and send updated values to content script
function save_options() {
  // Get the inputs from the popup
  var muteChecked = document.getElementById("mute").checked;
  var soundsChecked = document.getElementById("sounds").checked;
  var commandsChecked = document.getElementById("commands").checked;

  // Update storage
  chrome.storage.sync.set({
      mute: muteChecked,
      sounds: soundsChecked,
      commands: commandsChecked
    }, function() {
        // Callback function after storage is updated

        // Send updated data to content script to update filtering
        chrome.tabs.query({
	    url: ["https://www.twitch.tv/hugo_one"],
	    currentWindow: true
	  }, function(tabs) {
	    var tabid = -1;

	    // Only want to send message to hugo's tab
            for (i = 0; i < tabs.length; i++) {
               if (tabs[i].url == "https://www.twitch.tv/hugo_one") {
                 tabid = tabs[i].id;
		 break;
	       }
	    }

	    // if user updates settings while stream isn't open do nothing
	    if (tabid != -1) {
	      // update the running content script with new options
	      chrome.tabs.sendMessage(tabid, {
	        mute: muteChecked,
	        sounds: soundsChecked,
		commands: commandsChecked
	      });

	    }
	  });

	// Notify user of saved changes with a short display message
	var notification = document.getElementById("notification");
	notification.textContent = "Saved";
	setTimeout(function() {
	    notification.textContent = '';
	}, 750);
    });
}

// Fetech and restore all values from the database
function restore_options() {
  chrome.storage.sync.get({
      mute: true,
      sounds: true,
      commands: true
  }, function(items) {
      document.getElementById("mute").checked = items.mute;
      document.getElementById("sounds").checked = items.sounds;
      document.getElementById("commands").checked = items.commands;
  });
}

// Add listeners to load and store data
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
