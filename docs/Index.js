var qctController = new function () {
    var that = this;

    var bytesTotal; // total bytes of selected file 
    var fileName; // name of selected file, without path
    var fileData; // raw content of selected file 

    var maxBytesPerQrCode;
    var totalNumberOfQrCodes = 0;
    var currentQrCode = 0;

    that.init = function () {
        if (typeof window.FileReader !== "function") {
            alert("Error - The file API isn't supported on this browser yet.");
            return;
        }
    };

    that.loadFile = function () {
        var input = document.getElementById("fileinput");

        maxBytesPerQrCode = parseInt($("#bytesPerCode").val()) || 600;

        if (!input.files) {
            alert("This browser doesn't seem to support the 'files' property of file inputs.");
            return;
        } else if (!input.files[0]) {
            alert("Please select a file");
            return;
        }

        var file = input.files[0];
        fileName = file.name;
        bytesTotal = file.size;
        console.log("loaded file " + fileName + " - size " + bytesTotal);

        var reader = new FileReader();
        reader.onloadstart = function (e) {
            console.log("Start loading...");
        };
        reader.onloadend = function (e) {
            fileData = btoa(this.result); // encode base 64
            bytesTotal = fileData.length;
            console.log("base 64 size: " + bytesTotal);

            //console.log("file content:");
            //console.log(fileData);

            if (e.target.readyState !== FileReader.DONE) {
                return;
            }
            console.log("Load finished");
            that.prepareQRCode();
        };
        reader.readAsBinaryString(file);
    };

    that.prepareQRCode = function () {
        // hash qr codes by size
        // 1st code : nb of parts + "#" + file name
        // 2nd code : "1#" + content 
        totalNumberOfQrCodes = parseInt(bytesTotal / maxBytesPerQrCode) + 1 + (bytesTotal % maxBytesPerQrCode === 0 ? 0 : 1);
        that.setCurrentQrCode(1);
    };

    that.incrementQrCode = function (d) {
        if (currentQrCode + d < 1 || currentQrCode + d > totalNumberOfQrCodes)
            return;
        that.setCurrentQrCode(currentQrCode + d);
    }

    that.setCurrentQrCode = function (i) {
        i = parseInt(i);
        if (!i)
            alert("Incorrect QR code number: " + i);
        currentQrCode = i;
        $("#lblQrCodeNumber").html(currentQrCode + "/" + totalNumberOfQrCodes);
        var data;
        if (i === 1) {
            data = "#" + totalNumberOfQrCodes + "#" + fileName;
        } else {
            data = i + "#" + fileData.substring(
                maxBytesPerQrCode * (i - 2),
                currentQrCode === totalNumberOfQrCodes ? fileData.length : maxBytesPerQrCode * (i-1));
        }
        that.generateQrCode(
            {
                width: 600,
                height: 600,
                text: data
            });
        $("#goToCode").val(i);
    };

    that.generateQrCode = function (content) {
        $("#qrcode").html("");
        $("#qrcode").qrcode(content);
        $("#qrCodeContent").html("length = " + content.text.length + " bytes");
         //"value=\"" + (content.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')) + "\"");
    }

    that.autoDuration = null;
    that.autoStart = function () {
        that.autoDuration = parseInt($("#codeDisplayDuration").val());
        if(!that.autoDuration)
        {
            alert("incorrect duration: " + $("#codeDisplayDuration").val());
            return;
        }
        setTimeout(that.autoTicker, that.autoDuration);
    };

    that.autoTicker = function () {
        if (!that.autoDuration)
            return;
        that.incrementQrCode(1);
        setTimeout(that.autoTicker, that.autoDuration);
    };

    that.autoStop = function () {
        that.autoDuration = null;
    };
};

$(qctController.init);