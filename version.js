{
   "version": 2,
   "name": "tim-bet-on",
   "builds": [
      { "src": "app.js", "use": "@vercel/node" }
   ],
   "routes": [
      { "src": "/(.*)", "dest": "/app.js" }
   ]
}