
import { RNS3 } from 'react-native-aws3';


var s3_opts = {
  bucket: 'who-up',
  region: 'us-west-2',
  key: 'AKIAJF3GFV5M62EVE4XA',
  secret: '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',
  type: 'image/',
  path: 'images/',
  acl: 'public-read',
};

function upload(file_uri, callback, progressCallback) {


let uuid = _generateUUID();
let file = {
  // `uri` can also be a file system path (i.e. file://)
  uri: file_uri,
  name: uuid + '.png',
  type: "image/png"
}

let options = {
  keyPrefix: "images/",
  bucket: "who-up",
  region: "us-west-2",
  accessKey: 'AKIAJF3GFV5M62EVE4XA',
  secretKey: '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',
  successActionStatus: 201
}

RNS3.put(file, options).then(response => {
  if (response.status !== 201){
    console.log(response);
    callback(response);
    //throw new Error("Failed to upload image to S3");
  }
  callback(null,response.body.postResponse.location)
  /**
   * {
   *   postResponse: {
   *     bucket: "your-bucket",
   *     etag : "9f620878e06d28774406017480a59fd4",
   *     key: "uploads/image.png",
   *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
   *   }
   * }
   */
}).progress((e) => progressCallback(e.loaded / e.total));

  // let uuid = _generateUUID();
  //     let fi = [{
  //       name: 'file',
  //       filename: uuid + '.png',
  //       filepath: file,
  //       filetype: 'image/png',
  //     }];

  // let p = s3_policy(s3_opts);
  // // console.log(p.policy);
  // // console.log(p.signature);

  // let opts = {
  //   url: 'https://' + s3_opts.bucket + '.s3.amazonaws.com/',
  //   files: fi,
  //   params: {
  //     key: 'images/${filename}',
  //     acl: s3_opts.acl,
  //     'X-Amz-Signature': p.signature,
  //     'x-amz-credential': p.credential,
  //     'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
  //     'X-Amz-Date': p.date + 'T000000Z',
  //     'Content-Type': 'image/png',
  //     'policy': p.policy,
  //     'success_action_status': '201',
  //     'x-amz-meta-uuid': '14365123651274'
  //   }
  // };

  // RNUploader.upload( opts, ( err, res )=>{
  //     if( err ){
  //         console.log(err);
  //         //this.setState( { uploading: false, uploadStatus: err } );
  //         return;
  //     }

  //     var status = res.status;
  //     var responseJson = xml2json.parser( res.data );

  //     console.log('upload complete with status ' + status);
  //     console.log( responseJson );
  //     //this.setState( { uploading: false, uploadStatus: status } );
  //   });
};

function _generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

module.exports = upload;
