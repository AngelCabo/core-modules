/*

  OQ: How can we write tests for ensuring audio gets played?

*/

Parallels.Audio.player = {

  _folderPath: "/sounds/",

  play: function(soundFileName){

    if (Session.equals('isAudioEnabled', true)){
      Parallels.log.debug("audio:play: via Howler: ", soundFileName);
      new Howl({ urls: [ this._folderPath + soundFileName + ".wav"] }).play();
    }

    else {
      Parallels.log.debug("audio:simulate play: ", soundFileName);
    }
  }
}
