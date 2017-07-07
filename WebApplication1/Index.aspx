<%@ Page Title="" Language="C#" MasterPageFile="~/QrCodeTransfer.Master" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="cmartel.QrCodeTransfer.Web.Index" %>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContent" runat="server">
    <script src="Index.js"></script>
</asp:Content>

<asp:Content ID="Content1" ContentPlaceHolderID="PageContent" runat="server">
    <h2>Qr-Code File Transfer tool
    </h2>
    <form action="#" onsubmit="return false;">
        <div style="margin: 1em;">
            Please select file to convert to QR Code, for transfer to phone
        - bytes per code:
            <input type="text" value="900" id="bytesPerCode" />


            <input type="file" id="fileinput" />
            <input type="button" id="btnLoad" value="Load file" onclick="qctController.loadFile()" class="btn btn-success" />

        </div>
    </form>

    <div style="margin-left: 50px;">
        <div>
            <button type="button" class="btn" onclick="qctController.incrementQrCode(-1)">Prev</button>
            <span id="lblQrCodeNumber"></span>
            <button type="button" class="btn" onclick="qctController.incrementQrCode(1)">Next</button>
        </div>
        <div id="qrcode" style=""></div>
        <div id="qrCodeContent"></div>

    </div>

</asp:Content>
