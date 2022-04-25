# draw-together
Draw Together is a realtime collaborative drawing canvas, like Google Docs for MS Paint.

Try it out here (open two tabs or share your link with a friend):

[https://xtyrrell-draw-together.herokuapp.com](https://xtyrrell-draw-together.herokuapp.com/)

# How it Works
The app is quite simple. It runs a Koa + socketIO app that listens for connections, and ...
0. The user starts on the homepage, with links to (1) a new sketch and (2) join
  an existing sketch by entering its ID.
1. If a user clicks the link to /sketches/new, generate a sketch id for them and redirect them there.
2. If a user enters an ID of a sketch they want to join, they will end up at /sketches/<sketch-id>, thus joining room <sketch-id> on the
   /sketches namespace in socketio.
3. When a user connects to a room they get sent a recap of all the strokes and
   replays these to reconstruct the sketch up to the current moment. From then on...
4. ... Any connected user in a room gets all `stroke` events whenever anyone in that
   room draws a stroke

# Setup
## Development
Run the development server (which reloads when you make changes to the server code) with:
```bash
$ npm run dev
```
Then open `http://localhost:3000` and start drawing! Connect other devices on your local network and draw together!

Or run a server and draw with the world...

## Production
You could deploy this to Heroku. You could also deploy this to your own server. If you do, you might want to set that deployment pipeline up with GitHub Actions. This project includes a CircleCI config that deploys to a cloud VM when you push to the master branch; that's another option. You'll probably want to modify this file `.circleci/config.yml` for your needs if you go that route.

The CircleCI config also includes a robust, production-ready Nginx reverse-proxy setup with PM2 as the process manager, so you'll need to make sure a recent version of Nginx is installed on the VM you're planning on deploying to. You'll also want to edit the Nginx config `draw-together.nginx.conf`, such as to set your server's hostname. Open an issue for guidance if necessary.

# A Sorely Missing Feature
There is one blatant omission: persistent sketch storage.

Currently, sketches are stored in memory and so are ephemeral.

If you're intending on using this for more than one-off sketch jam sessions with buddies, you'll probably want to add a database to store data durably. This should be quite straightforward: you may want to simply use SQLite, or perhaps connect to a free MongoDB Atlas database instance, or something else. You should be able to more-or-less replace the `strokes` object with whatever persistent solution you're going with. There shouldn't need to be any other changes to the codebase.
  
# Contributing
You're invited to comment, critique and contribute.
