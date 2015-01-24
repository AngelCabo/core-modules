define(function () {

  function camlistore(dataBuffer, uploadDone) {
    var hash = Crypto.SHA1(new Uint8Array(dataBuffer, 0));
    var blobRef = 'sha1-' + hash;

    function doUpload(uploadUrl) {
      // XXX Use real random boundary.
      var boundary = 'randomboundaryXYZ';
      var contentType = 'multipart/form-data; boundary=' + boundary;

      var header =
        '--' + boundary + '\r\n' +
        'Content-Type: application/octet-stream\r\n' +
        'Content-Disposition: form-data; name="' + blobRef +
        '"; filename="1"\r\n\r\n';
      var footer = '\r\n--' + boundary + '--\r\n';

      var builder = new BlobBuilder();
      builder.append(header);
      builder.append(dataBuffer);
      builder.append(footer);
      var payload = builder.getBlob(contentType);

      var uploadXhr = new XMLHttpRequest();
      uploadXhr.open('POST', uploadUrl, true,
        options.username, options.password);
      uploadXhr.onreadystatechange = function () {
        if (uploadXhr.readyState == XMLHttpRequest.DONE && uploadXhr.status == 200) {
          // XXX Check for bad response format (not JSON).
          var responseJson = $.parseJSON(uploadXhr.responseText);

          if (responseJson.received &&
            responseJson.received.length == 1 &&
            responseJson.received[0].blobRef == blobRef) {
            console.log('Successful upload: ' + blobRef);
            uploadDone();
            return;
          }

          console.log('Camlistore upload response did not verify blob "' + blobRef + '": ' + uploadXhr.responseText);
        }
      };
      uploadXhr.setRequestHeader('Content-Type', contentType);
      uploadXhr.send(payload);
    }

    var statXhr = new XMLHttpRequest();
    statXhr.open('POST', 'http://localhost:3179/bs-recv/camli/stat', true);
    statXhr.onreadystatechange = function () {
      if (statXhr.readyState == XMLHttpRequest.DONE && statXhr.status == 200) {
        // XXX Check for bad response format (not JSON).
        var responseJson = $.parseJSON(statXhr.responseText);

        if (responseJson.stat &&
          responseJson.stat.length == 1 &&
          responseJson.stat[0].blobRef == blobRef) {
          console.log('Blob already present: ' + blobRef);
          uploadDone();
          return;
        }

        var uploadUrl = responseJson.uploadUrl;
        if (!uploadUrl) {
          console.log('Camlistore stat response missing "uploadUrl": ' + statXhr.responseText);
          return;
        }

        doUpload(uploadUrl);
      }
      // XXX: Handle request errors
    };
    statXhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    statXhr.send('camliversion=1&blob1=' + blobRef);
  }

  return {
    /**
     * Save a bit to the parallels server
     * @param bit
     */
    saveBit: function (bit) {
      console.log('doing nothing because we assume we will save on the update with the HTML page');
      console.log(bit);
    },

    /**
     * Update a bit on the parallels server
     * @param id
     * @param bit
     */
    updateBit: function (id, bit) {
      console.log('updating bit');
      console.log(bit);
      camlistore(bit, function() {
        console.log('Upload callback on success!');
      });
    },

    findByPageIdentifier: function (pageIdentifier) {
      //return bits.reactiveQuery({ pageIdentifier: pageIdentifier }).result;
    },

    ddp: {}
  }
});
