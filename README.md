# hugobot-filter
Chrome Extension for ignoring unwanted Hugo Bot and viewer messages in Hugo_One's channel on Twitch.


The ultimate goal is to provide users a flexible way to ignore both bot commands and bot responses. For example, allowing
the user to see `!spin` and Hugo Bot's response in chat when they use the command but not see these messages when other
viewers use the commands. A future goal allows users to see only the output of a command they use but hide their message.

## Options

* Hard Mute (disable everything)
* Mute only hugo bot (won't hide commmands)
* Spins
  * Show `!spin` only when I use it
  * Never show `!spin`
  * Only show results of my spin
  * Show big winners
  * (default show all)
* Heist 
  * Show heist reminders
  * Show gathering crew
  * Show Start
  * Only show output of heists I'm in
  * (default show all heist)
* Broadcast
  * Hide all broadcasts
* Quotes
  * Show `!quote` only when I use it
  * Never show `!quote`
  * Note to self: ignore messages beginning with Quote #
* Name/Highlight (Exception)
  * Allow users to enter a name?
  * Never hide messages that include my username
* Sounds (NOTE THIS ONLY HIDES TEXT IT'S NOT POSSIBLE TO MUTE SOUND - or is it? use delay and mute stream temporarily)
  * Only show `!<sound>` when I use it
  * Hide all `!<sound>` messages, including messages about paying to use someone else's sound
  * Hide when someone pays to use my sound
  * (default show when someone pays for a sound)
* Misc Commands
  * Only show output of commands I use (see quote)
  * Only show `!<command>` when I use it
  * Hide all `!<command>` messages
  
## Design 

* Add Hugo's color scheme
* Add Hugo's icon
* Make text look better, use better phrases
