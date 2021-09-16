<h1 align="center">    
  <img src="https://i.imgur.com/vaW23Aw.png" width="300"> 

<b><a href="https://t.me/proxymus_bot">@proxymus_bot</a></b>

  <h2 align="center">
    <p>Yet another telegram bot that allow you get free proxies from <a href="https://www.proxyscan.io">https://www.proxyscan.io</a></p>
    <p>Bot was created using <a href="https://github.com/telegraf/telegraf">telegraf</a> Bot API framework for Node.js</p>
  </h2>   
</h1>

<h1>Features</h1>    
<ul>    
    <li>It`s free and opensource</li>    
    <li>Flexible settings. You can setting up proxy level, type, format and limits</li>    
    <li>All the proxies are subjected to a detailed check every 10 minutes (by <a href="https://www.proxyscan.io">proxyscan</a>)</li>    
    <li>Easy to use. Just press on button to get proxies</li>    
    <li>No registration required</li>    
</ul>    

<h1>Run bot</h1>    
<ul>    
    <li><a href="https://github.com/Sigmanor/proxymus_bot/archive/refs/heads/main.zip">Download</a> this repo & unzip to any folder</li>    
    <li>Install <a href="https://nodejs.org/">node.js</a> <b>v14.17.6</b></li>    
    <li>Open console and go to the project folder</li>         
    <li>Run command <code>npm install</code></li>    
    <li>Run command <code>npm start</code></li>    
    <li>To run bot in development mode use <code>npm run dev</code> command</li>  
</ul>    
<p>Do not forget create <b>.env</b> file in project root directory, and add there a few parameters:</p>
<ul>     
    <li>BOT_TOKEN=<b>your telegram bot token</b></li>    
    <li>MONGO=<b>your <a href="https://mongodb.com/">mongodb</a> connection string</b></li>
</ul>    


<h1>Deploy</h1>   
<p>Bot hosted on Heroku, so you also can host it there, or in any other hosting</p> 

<a href="https://heroku.com/deploy?template=https://github.com/Sigmanor/proxymus_bot">  <img src="https://www.herokucdn.com/deploy/button.svg"/></a>  


<h1>ToDo</h1>

- [ ] Make more complete readme
- [ ] Add the new resources where to parse proxy and let user to choose
