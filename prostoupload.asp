<%@ Language = "JavaScript" %>
<% function err(txt){ %>
	<html><body>
		<script type="text/javascript">
			top.tinyMCE.activeEditor.plugins.prostoupload.callback('error: <% = txt %>');
		</script>
	</body></html>
<% Response.End(); }
	var url_path = "/img/upl/";

	var m=new Array();
	m[0]="01-jan";
	m[1]="02-feb";
	m[2]="03-mar";
	m[3]="04-apr";
	m[4]="05-may";
	m[5]="06-jun";
	m[6]="07-jul";
	m[7]="08-aug";
	m[8]="09-sep";
	m[9]="10-oct";
	m[10]="11-nov";
	m[11]="12-dec";

	var path = Server.MapPath(url_path);

	var dd = new Date();
	var fs = Server.CreateObject("Scripting.FileSystemObject");
	var oUpload = Server.CreateObject("aspSmartUpload.SmartUpload");
	oUpload.Upload();
	var file = oUpload.Files("file");

	if (! fs.FolderExists(path)) 
		err('no space for store');

	if (file.IsMissing) 
		err('no data in form');

	var fname = file.FileName.toLowerCase();
	fname = fname.substring(0, fname.lastIndexOf("."));
	fname = fname.replace(/[^a-z0-9\.]+/g,"-");

	var fext = file.FileExt.toLowerCase();

	if ((file.TypeMIME != "image") || (".png.gif.jpg.jpeg.".indexOf("."+fext+".") == -1)) 
		err('incorect file extension and (or) MIME type');


	path = path + "\\" + dd.getFullYear();
	url_path = url_path + "/" + dd.getFullYear();
	if (! fs.FolderExists(path)) {
		fs.CreateFolder(path);
	}

	path = path + "\\" + m[dd.getMonth()];
	url_path = url_path + "/" + m[dd.getMonth()];
	if (! fs.FolderExists(path)) {
		fs.CreateFolder(path);
	}

	if (fs.FileExists(path + "\\" + fname + "." + fext)){
		fname = fname + "-10";
		while (fs.FileExists(path + "\\" + fname + "." + fext)){
			var ind = fname.lastIndexOf("-");
			fname = fname.substring(0,ind) + "-" + (parseInt(fname.substring(ind + 1)) + 1);
		}
	}

	file.SaveAs(path + "\\" + fname + "." + fext);
%>
<html><body>
	<script type="text/javascript">
		top.tinyMCE.activeEditor.plugins.prostoupload.callback('http://www.techgenix.com<% = url_path %>/<% = fname %>.<% = fext %>');
	</script>
</body></html>
