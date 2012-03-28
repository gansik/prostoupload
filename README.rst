:Author:
	Gansik <gansik@tagv.com>

Prosto Upload
=============

It is `TinyMCE <http://www.tinymce.com/TinyMCE>`_ plugin for simple uploading of images. 
By pressing the  button of plugin, the system dialog window opens.
Right after selecting the image file, uploading of the chosen file on the server begins. 
During this process the editor window is blocked. 
After successful loading, the image will be inserted into the edited document.

Requirements
------------

 * TinyMCE 3.x
 * PHP (Python, Perl, etc) support on the server for a file connector
 * Prosto Upload works in browsers: FF 8 and up, Chrome 10 and up, IE 7 and up


Installation
------------

Copy the ``/prostoupload/`` directory into your TinyMCE plugins directory.

Copy (or create by yourself) a connector file (ex. ``prostoupload.asp``) to any place on the server, which is available from the web. 
This file must have permissions for writing in the directory where you store images.


Configuration
-------------

TinyMCE init section (minor details omitted)::

	tinyMCE.init({
		theme : "advanced",
		plugins : "prostoupload,...",
		...
		theme_advanced_buttons1 : "prostoupload,...",
		...
		plugin_prostoupload_uploader : '/utils/prostoupload.asp',
		...
	});

Option ``plugin_prostoupload_uploader`` will be have a URL to your connector file. 

About a connector file
----------------------

It is a simple server script. 
The input it receives a POST request with ``enctype="multipart/form-data"``, and stores the file on the server. 

This script should handle the data of that form correctly::

	<html><body>
		<form method="POST" action="/prostoupload.asp" enctype="multipart/form-data">
			<input type="file" name="file">
			<input type="submit">
		</form>
	</body><html>

This script should return the URL of the stored image in the format::

	<script type="text/javascript">
		top.tinyMCE.activeEditor.plugins.prostoupload.callback("http://example.com/path/image.gif");
	</script>


Basic example on PHP::

	<?php
	$uploaddir = './uploads/';
	$fname = $uploaddir.basename($_FILES['file']['name']);
	echo '<script type="text/javascript">\n';
	if (copy($_FILES['file']['tmp_name'], $fname)){
		echo '  var f = top.tinyMCE.activeEditor.plugins.prostoupload.callback;\n';
		echo '  f("http://myserver/uploads/'.$fname.'");\n';
	} else {
		echo '  top.tinyMCE.activeEditor.plugins.prostoupload.callback("error");\n';
	}
	echo '</script>\n';
	?>

**Do not forget**, you need to check variables like ``$_FILES['file']['type']`` and ``$_FILES['file']['size']`` in the production script.


Source
------

The source is available in a git repository at github::

	git://github.com/Gansik/prostoupload.git

Issue tracker
-------------

https://github.com/Gansik/prostoupload/issues

Distribution
------------

Free for all to modify, distribute, and use, but I am not liable for any issues or problems.
