 .----------------.  .----------------.  .----------------.  .----------------. 
| .--------------. || .--------------. || .--------------. || .--------------. |
| | ____    ____ | || |  _________   | || | ____    ____ | || |  _________   | |
| ||_   \  /   _|| || | |_   ___  |  | || ||_   \  /   _|| || | |_   ___  |  | |
| |  |   \/   |  | || |   | |_  \_|  | || |  |   \/   |  | || |   | |_  \_|  | |
| |  | |\  /| |  | || |   |  _|  _   | || |  | |\  /| |  | || |   |  _|  _   | |
| | _| |_\/_| |_ | || |  _| |___/ |  | || | _| |_\/_| |_ | || |  _| |___/ |  | |
| ||_____||_____|| || | |_________|  | || ||_____||_____|| || | |_________|  | |
| |              | || |              | || |              | || |              | |
| '--------------' || '--------------' || '--------------' || '--------------' |
 '----------------'  '----------------'  '----------------'  '----------------' 
 .----------------.  .----------------.  .----------------.  .----------------. 
| .--------------. || .--------------. || .--------------. || .--------------. |
| |  ____  ____  | || |     ____     | || |     ____     | || |  ___  ____   | |
| | |_   ||   _| | || |   .'    `.   | || |   .'    `.   | || | |_  ||_  _|  | |
| |   | |__| |   | || |  /  .--.  \  | || |  /  .--.  \  | || |   | |_/ /    | |
| |   |  __  |   | || |  | |    | |  | || |  | |    | |  | || |   |  __'.    | |
| |  _| |  | |_  | || |  \  `--'  /  | || |  \  `--'  /  | || |  _| |  \ \_  | |
| | |____||____| | || |   `.____.'   | || |   `.____.'   | || | |____||____| | |
| |              | || |              | || |              | || |              | |
| '--------------' || '--------------' || '--------------' || '--------------' |
 '----------------'  '----------------'  '----------------'  '----------------' 

================================================================================

It is auto-scraper bot for stealing memes from VK popular groups, developed with
Node.js. This bot acts like a normal VK user with desktop computer. Due to lack 
of opportunity to get notifications from foreign VK groups as a user of VK Bot
Long Poll API, the bot intercepts user notifications about new publications.
After bot got the notification it will filter new publication and then extract
an image(s) and caption from it. After this work was done the bot will save all
necessary information about publication at it's database. Then it will push it 
to my own VK group ( https://vk.com/worldgutter ) and to my Telegram channel 
( t.me/worldgutter ) and then repeat all this work.

Specialties of this bot :
- acts like a human user
- bypasses VK daily group-official publication limit 
- almost not using VK API (only for wall clearing)
- completes regularly database clearing
- doesn't take a lot of resources
- due to last 2 specialties it brings to my group and channel hundreds of
  content units per day during more than a half of year working at free 
  hosting with free database and takes no money from his author :)
