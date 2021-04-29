/* eslint-env browser */
import Config from "./Config.js";
import { Event, Observable } from "./Observable.js";

//values for compression
const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: Config.IMAGE_COMPRESSOR.MAX_VALUE_FOR_IMAGE,
  useWebWorker: false,
};

/*
 * https://www.npmjs.com/package/browser-image-compression
 * Images, a user wants to upload, need compression, because Firebase Storage has a limit.
 */
class ImageCompressor extends Observable {

  //Compresses image with specified value (options) and returns it. Failure -> returns normal image  
  compressImage(image) {
    /* global imageCompression */
    return imageCompression(image, options).then(function(compressedImage) {
      return compressedImage;
    }).catch(() => {
      this.notifyAll(new Event(Config.IMAGE_COMPRESSOR.EVENT
      .ERROR_ACTION, {
        message: Config.IMAGE_COMPRESSOR
          .COMPRESSOR_ERROR,
      }));
      return image;
    });
  }

}

export default new ImageCompressor();