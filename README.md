# Anagrams Trainer

Project by Nicholas Thies. A tool to practice GamePigeon Anagrams without spamming your friends!

Demo video: https://www.youtube.com/watch?v=Whi60rbpf5U

## To Run:
* Install Node.js modules: `npm install express` and `npm install sqlite-async`
* Setup the database: `node setub_db.mjs`
* Start the server: `node app.mjs`
* Navigate to the URL `http://localhost:3000/`

## To Play:
You are given 7 letters. The objective of the game is arrange those letters into as many words as possible before
the time runs out. Longer points are worth more words.

Besides the Start and Replay buttons (which must be clicked), the controls are keyboard input only. Use your keyboard
to input characters, BACKSPACE to delete characters, and ENTER to submit your anagram. Valid anagrams are at
least 3 letters long and are real English words.
