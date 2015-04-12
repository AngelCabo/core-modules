[![Build Status](https://travis-ci.org/parallelsio/core-modules.svg?branch=master)](https://travis-ci.org/parallelsio/core-modules)

<img src="http://i.imgur.com/lI0HhvV.png" />

##[Parallels](http://parallels.io) : A free, digital tool for creativity + play, enabling you to fluidly create, remix + share documents as networks of ideas. 

When we say document, we imagine playing with fragments, or bits, of media just like digital Lego. These documents are more like digital collections, that you can create and remix on your own, work on together with a group of friends and co-workers, or publish for people you've yet to meet. 

Parallels is an engine for the discovery of ideas.

* [Motivation, goals, open research questions](http://bit.ly/1JbkU4y)
* [Blog](http://parallels.ghost.io)

Currently consists of 2 main components which need to run side by side, included in this repository:
   

###[/meteor-app](https://github.com/parallelsio/core-modules/tree/master/meteor-app)
---
The web application: a digital canvas where documents are created + remixed. Based on the [Meteor JS](http://www.meteor.com)

      

###[/extensions/chrome](https://github.com/parallelsio/core-modules/tree/master/extensions/chrome)
---
A Chrome extension for easily tagging + saving browser content found on the web, to your Parallels canvas

---  
#### Notes
 
* This is an alpha version, a proof of concept. It is incomplete, with bugs and continuously changing code, design + features
* It currently only works locally (on your computer) - the extension is not yet published to the Extension Store, and the web app is not yet hosted as a service. You'll need to point this extension to your source code in Chrome after enabling Developer mode. This means all of the data you create while running this stays private to you.

---  
### Tested with latest versions:

* OSX / Linux (Windows dev may work, but it has not been tested)
* Node (0.10.26)
* NPM (1.4.28) 
* [Meteor JS](https://www.meteor.com) 
* git (2.1.0)
* [Evergreen](http://eisenbergeffect.bluespire.com/evergreen-browsers) (self-updating, modern) browsers: Chrome, Firefox, Safari, FireFox, IE10+
 
---

### Contact + tools we use

* Twitter: [@makeparallels](http://www.twitter.com/makeparallels)

* [Slack](http://parallelsio.slack.com) for realtime chat + collaboration. [Email](mailto:steven@parallels.io) or [tweet](http://www.twitter.com/makeparallels) for access

* [Trello](https://trello.com/b/XtenDuNO/parallels-design-dev) for keeping track of stories (units of design + development work)


* [TravisCI](http://www.travis-ci.com), a Continous Integration system to run automate running our tests and deployment.

* [Saucelabs](https://www.saucelabs.com) Automated cross-browser testing on various platforms

<br/>
#### Special thanks for the free licenses + support from:

* [Screenhero](https://www.screenhero.com) for remote screenshare / pairing

* [Doodle](https://www.doodle.com), great for scheduling team meetings across time zones

* [Ghost](https://ghost.org/about) Simple, open source blogging platform 

---

### Contribute

We're a [diverse, distributed](https://hackpad.com/Parallels-Cast-Friends-XGzlw9Mxg39) team of designers, developers and researchers with a goal of changing the way we organize and connect ideas. We'd love you to join us: get in touch if would like to contribute. No contribution is too small.


#### Current challenges:

* A zoomable user interface (ZUI) with coordinate system for map-based layout/content
* Modeling documents in graph-based data structures (potential candidates are Neo4J, MongoDB, TitanDB, OrientDB, Datomic, Arango, ReThink DB) 
* Browser extensions for clipping web content
* Physics-based UI animations + transitions, via WebGL, CSS3, Canvas + JS 
* Interactive documentation, think Bret Vector's definition of [reactive documents](http://worrydream.com/ExplorableExplanations/), to help prevent [this](https://i.imgur.com/Ssz6pjF.png)
* iOS / Android apps
* Decentralized (cloud-less) infrastructure / file storage

For code contributions: fixes + features:

```
# Fork the project
# https://help.github.com/articles/fork-a-repo

# Modify the code

# Run the end-to-end test suite when finished with a unit of work.
# This runs all the tests which ensure the components still work (clipper, web canvas)  
$ grunt e2e-tests 

# If tests pass, submit a Github Pull Request
$ https://help.github.com/articles/using-pull-requests
```

---

### License

GNU Affero General Public License. Pay it forward.


---  
### Setup, Building + Developing

Having any trouble at all? Ping us on Twitter [@makeparallels](http://www.twitter.com/makeparallels), or [email](mailto:steven@parallels.io) to arrange for a remote pairing session to set you up!

---

#### Install node.js + NPM ( [OSX, via Homebrew](http://thechangelog.com/install-node-js-with-homebrew-on-os-x ) ) ( [Linux via Apt ] (https://www.digitalocean.com/community/tutorials/how-to-use-npm-to-manage-node-js-packages-on-a-linux-server) )


```
# to install Meteor:
$ curl install.meteor.com | sh
```

```
# enter the directory where you wish to store your source code:
$ mkdir your-code-directory         # if it doesn't yet exist
$ cd your-code-directory
```

```
# make a copy of this repository to your computer
$ git clone https://github.com/parallelsio/core-modules.git
$ cd core-modules
```

```
# install Bower, a dependency manager which will download all the 
# front-end assets (libraries) needed to run this project
$ npm install bower -g 
```

```
# install Mongo DB
# a Mongo instance is used for the end to end tests, to avoid conflicting with local Mongo install used together with the Meteor app
# directions: http://docs.mongodb.org/manual/installation
```

```
# download + install all the JS libraries this project requires, 
# using Npm, the node packaging system
$ npm install
```

```
#  install grunt, the Javascript-based task runner
$ npm install grunt-cli -g
```


``` 
# CONFIGURE THE EXTENSION
# Before you install the Chrome extension, you'll need to set 
# the destination for bits that you clip / save

# To do so, build the extension in one of three ways:

    # 1: When clipper is used, pushes bits to http://localhost:3000
    # (local development). No one will see your data with this option.
    # Your data is persistent, in that it will survive reloading Meteor
    # and when you run your local end-to-end tests
    $ grunt build:local

    # ---------- OR ------------

    # 2: When clipper is used, pushes bits to the CI (Continous Integration)
    # server at http://parallels-ci.meteor.com
    # This data is public, but not persistent: it gets cleared whenever 
    # someone pushes new code to master
    $ grunt build:ci 
  
    # ---------- OR ------------

    # 3: When clipper is used, pushes bits to our sandbox environment
    # at http://parallels.meteor.com. This link is public and persists,
    # being shared all over the Interwebs + beyond.
    # Please take care what you clip here.
    $ grunt build:dist

```

```
# INSTALL EXTENSION
# Point the Chrome browser to the extension source code folder. 
# You only need to do this once, the first time. Details here: 
# https://developer.chrome.com/extensions/getstarted#unpacked

```

```
# PREP + COMPILE FILES
# Runs the local web server and loads the extension
$ grunt

# This does several things, including:
# ---- Checks the quality of the JS code via jshint

# ---- Compiles the SCSS files into CSS via Compass

# ---- Compiles the Jade template files

# ---- Boots up a local Meteor JS Server, and listens for changes 
#      to the Meteor source code, which lives in /meteor-app

# ---- Runs a watcher, listening for changes to your extension source code, 
#      which lives in /extensions/chrome
```


```
# When grunt is complete, your terminal output should look something like this:
```
<img src="http://i.imgur.com/5zxxnoC.png" />

```
# This means 2 things are running in the background:
# --- the core Meteor app, available on http://localhost:3000
# --- AND ---
# --- the associated web clipper, as a Chrome Extension
```

```
# When Chrome prompts you for the project directory, point it to the 
# /extensions/chrome folder of this repository

# --------------------
# EDIT SOURCE CODE now
# --------------------

# you should now be able to click the Extension icon in Chrome on a web page to
# bring up the web clipper dialog box

# Currently, the clipper will only work on http websites, not https
# This is only locally during dev, as Chrome places restrictions on SSL (https) content

# Save a web page using the web clipper. You should see that 'bit' instantly on 
# your Parallels canvas. This defaults to http://localhost:3000, unless you 
# congfigured the destination manually, 
# as described in the CONFIGURE THE EXTENSION section 


```
<img src="http://i.imgur.com/yMwBRaY.png" />



```
# RUNNING PARTS MANUALLY
# sometimes Chrome gets funky when trying to reload changes
# recompiling manually sometimes does the trick

# SCSS, with:
$ grunt sass 

# and your Jade templates, with:
$ grunt jade

# if all else fails, and your changes are not being picked up by the extension
# disable, then re-enable the extension via Chrome Settings: 
# http://chrome://extensions
```

---

### FAQ

Q: I know I've installed Npm, but when I try to run it `npm install`, I'm getting all sorts of errors.

A: You might've installed Npm with `sudo` (root permissions). This can be problematic. Follow [this](https://gist.github.com/DanHerbert/9520689) tutorial to re-install it

-------

Q: Why do you combine the 2 modules (Meteor app + Chrome extension)? Isn't it better to be modular and separate the repositories out?

A: Yes, generally it is. However, since the 2 parts depend on each other at this early stage, we wanted to get integration tests running across the 2 modules, to make sure when a page, or bit, as we call them is clipped, it indeeds arrives onto the canvas. 

By combining everything under one umbrella, testing is now signficantly easier. Once the 2 codebases mature, we'll consider separating them

----------

Q: How do I run the end to end tests manually?

A: `grunt e2e-tests`

----------

Q: Can I see test output in one place?

A: Yup, go to http://localhost:9000/_SpecRunner.html after you have your local server running 

------

Q: Why I made changes to the Chrome extension source code. My changes aren't being recognized by the extension when I try to clip/save a tab? 

A: The system which listens  for changes # automatically reload your newest changes, *without you having to reconfigure the extension, unpack or copy files anywhere. However, you *will need to refresh the tab in which you are testing the clipper, every time you edit the source code

----------

#### Still having trouble? 

Tweet to us [@makeparallels](http://www.twitter.com/makeparallels), [email](mailto:steven@parallels.io), or [post a Github Issue](https://github.com/parallelsio/core-modules/issues/new). 

We'll get back to you pronto, and if necessary, arrange for a remote pairing session to set you up!

-----------
