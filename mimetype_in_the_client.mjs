// getFileMimeType
// @param {Object} the file object created by the input[type=file] DOM element.
// @return {Object} a Promise that resolves with the MIME type as argument or undefined
// if no MIME type matches were found.
const getFileMimeType = (file) => {
    // Making the function async.
    return new Promise((resolve) => {
       let fileReader = new FileReader();
       fileReader.onloadend = (event) => {
          const byteArray = new Uint8Array(event.target.result);
 
          // Checking if it's JPEG. For JPEG we need to check the first 2 bytes.
          // We can check further if more specific type is needed.
          if (byteArray[0] == 255 && byteArray[1] == 216) {
             resolve("image/jpeg");
             return;
          } else if (byteArray[0] === 12 && byteArray[1] === 237) {
             resolve("image/tiff");
             return;
          } else if (
             byteArray[0] === 73 &&
             byteArray[1] === 32 &&
             byteArray[2] === 73
          ) {
             resolve("image/tiff");
             return;
          } else if (
             byteArray[0] === 73 &&
             byteArray[1] === 73 &&
             byteArray[2] === 42 &&
             byteArray[3] === 0
          ) {
             resolve("image/tiff");
             return;
          } else if (
             byteArray[0] === 77 &&
             byteArray[1] === 77 &&
             byteArray[2] === 00 &&
             byteArray[3] === 42
          ) {
             resolve("image/tiff");
             return;
          } else if (
             byteArray[0] === 77 &&
             byteArray[1] === 77 &&
             byteArray[2] === 00 &&
             byteArray[3] === 43
          ) {
             resolve("image/tiff");
             return;
          } else if (
             byteArray[0] === 79 &&
             byteArray[1] === 103 &&
             byteArray[2] === 103 &&
             byteArray[3] === 83 &&
             byteArray[4] === 0 &&
             byteArray[5] === 2 &&
             byteArray[6] === 0 &&
             byteArray[7] === 0
          ) {
             resolve("video/ogg"); // https://www.garykessler.net/library/file_sigs.html
             return;
          } else if (
             byteArray[0] === 26 &&
             byteArray[1] === 69 &&
             byteArray[2] === 223 &&
             byteArray[3] === 163
          ) {
             resolve("video/webm"); // https://www.garykessler.net/library/file_sigs.html
             return;
          }
 
          // If it's not JPEG we can check for signature strings directly.
          // This is only the case when the bytes have a readable character.
          const td = new TextDecoder("utf-8");
          const headerString = td.decode(byteArray);
 
          // Array to be iterated [<string signature>, <MIME type>]
          const mimeTypes = [
             // Images
             ["PNG", "image/png"],
             ["GIF87a", "image/gif"],
             ["GIF89a", "image/gif"],
             // [
             //    // Audio
             //    ("ID3", "audio/mpeg")
             // ], // MP3
             // Video
             ["ftypmp4", "video/mp4"], // MP4
             ["ftypisom", "video/mp4"], // MP4
             ["ftypMSNV", "video/mp4"], // MP4 https://www.garykessler.net/library/file_sigs.html
             // // HTML
             // ["<!DOCTYPE html>", "text/html"],
             // // PDF
             // ["%PDF", "application/pdf"],
             // // Add the needed files for your case.
          ];
 
          // Iterate over the required types.
          for (let i = 0; i < mimeTypes.length; i++) {
             // If a type matches we return the MIME type
             if (headerString.indexOf(mimeTypes[i][0]) > -1) {
                resolve(mimeTypes[i][1]);
                return;
             }
          }
 
          // If not is found we resolve with a false argument
          resolve(false);
       };
       // Slice enough bytes to get readable strings.
       // I chose 32 arbitrarily. Note that some headers are offset by
       // a number of bytes.
       fileReader.readAsArrayBuffer(file.slice(0, 32));
    });
 };
 
 // The input[type=file] DOM element.
 const fileField = document.getElementById("myfile");
 // Event to detect when the user added files.
 fileField.onchange = (event) => {
    // We iterate over each file and log the file name and it's MIME type.
    // This iteration is asynchronous.
    Array.from(fileField.files, async (file) => {
       const trueType = await getFileMimeType(file);
       console.log(
          file.name,
          trueType,
          " was marked as file.type = ",
          file.type
       );
    });
 };