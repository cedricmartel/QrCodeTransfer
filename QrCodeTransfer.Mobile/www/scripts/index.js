$(function () {
    $("#btnCapture").click(function () {
        qrController.clickScan("Please scan first code");
    });
});


var qrController = new function () {
    var that = this;

    that.clickScan = function (message) {
        cordova.plugins.barcodeScanner.scan(that.readCode, that.readError, {
            formats: "QR_CODE",
            prompt: message
        });
    };

    that.fileName = null;
    that.numberOfParts = 0;
    that.fileData = [];

    that.readCode = function (result) {
        if (!!result.cancelled) {
            that.log("CANCELED");
            return;
        }

        var indexCode = 1;
        if (result.text[0] === "#") {
            // first code
            var res = result.text.split("#");
            that.numberOfParts = parseInt(res[1]);
            that.fileName = res[2];
            that.data = [];
            that.log("READING NEW FILE: " + that.fileName + " (1/" + that.numberOfParts + ")");
        } else {
            indexCode = parseInt(result.text.split("#")[0]);
            var prefixLength = (indexCode + "#").length;
            that.fileData[indexCode] = result.text.substr(prefixLength, result.text.length - prefixLength);
            that.log("READ " + result.format + " - LENGTH " + result.text.length + " ##" + that.fileData[indexCode] + "##");
            console.log(that.fileData[indexCode]);
        }

        var nextCode = indexCode + 1;
        
        if (indexCode === that.numberOfParts) {
            // file save at last message 
            var fileDirectory = cordova.file.externalApplicationStorageDirectory;

            var byteArrays = [];
            for (var idx = 2; idx <= that.numberOfParts; idx++) {
                var byteCharacters = atob(that.fileData[idx]);
                var byteNumbers = new Array(byteCharacters.length);
                for (var i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            var contentType = "";
            var dataObj = new Blob(byteArrays, { type: "image/png" });

            window.resolveLocalFileSystemURL(fileDirectory, function (dir) {
                dir.getFile(
                    that.fileName,
                    { create: true },
                    function (file) {
                        file.createWriter(function (fileWriter) {

                            fileWriter.onwriteend = function () {
                                that.log("File saved " + fileDirectory + that.fileName);
                            };

                            fileWriter.onerror = function (e) {
                                that.log("Failed file write: " + e.toString());
                            };

                            fileWriter.write(dataObj);
                        });
                    });
            });
        } else {
            // scan next code 
            that.clickScan("please scan code nb " + nextCode);
        }
    };

    that.readError = function (error) {
        that.log("SCAN FAILED: " + error);
    };

    that.log = function (message) {
        $("#messages").append("<br/>" + message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
    }
};

