# draw-together
Draw Together is a realtime collaborative drawing canvas, like Google Docs for MS Paint.

# Setup
## Development
Run the development server (which reloads when you make changes to the server code) with:
```bash
$ npm run dev
```
Then open `http://localhost:3000` and start drawing! Connect other devices on your local network and draw together!

Or run a server and draw with the world...

## Production
This project includes a CircleCI config that deploys to a cloud VM when you push to the master branch. You'll probably want to modify this file `.circleci/config.yml` for your needs.

It also includes a robust, production-ready Nginx reverse-proxy setup with PM2 as the process manager, so you'll need to make sure a recent version of Nginx is installed on the VM you're planning on deploying to. You'll also want to edit the Nginx config `draw-together.nginx.conf`, such as to set your server's hostname. Open an issue for guidance if necessary.

# How it Works
The app is quite simple. It runs a Koa + socketIO app that listens for connections, and ...
1. If a user lands on /, generate a sketch id for them and redirect them there.
2. If a user lands on /sketches/<sketch-id>, they join room <sketch-id> on the
   /sketches namespace.
3. When a user connects to a room they get sent a recap of all the strokes and
   replay these to reconstruct the sketch up to the current moment. From then on...
4. ... Any connected user in a room gets all `stroke` events whenever anyone in that
   room draws a stroke
  
# A Sorely Missing Feature
There is one blatant omission: persistent sketch storage.

Currently, sketches are stored in memory and so are ephemeral.

If you're intending on using this for more than one-off sketch jam sessions with buddies, you'll probably want to add a database to store data durably. This should be quite straightforward: you may want to simply use SQLite, or perhaps connect to a free MongoDB Atlas database instance, or something else. You should be able to more-or-less replace the `strokes` object with whatever persistent solution you're going with. There shouldn't need to be any other changes to the codebase.
  
# Contributing
You're invited to comment, critique and contribute.
