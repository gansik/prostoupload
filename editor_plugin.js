/**
 * @author Gansik (http://gansik.tagv.com)
 * @license 
 */

(function() {
	// Load plugin specific language pack
	//tinymce.PluginManager.requireLangPack('prostoupload');

	var _bookmark;

	tinymce.create('tinymce.plugins.prostoUploadPlugin', {

		init : function(ed, url) {

			tinymce.DOM.loadCSS(url + '/css/prostoupload.css');
			//ed.DOM.loadCSS();

			ed.addButton('prostoupload', {
				title : 'Prosto Upload',
				image : url + '/img/prostoupload.png'
			});

			ed.onPostRender.add(function(ed, cm) {

				// tinyMCE error: cm is "undefined"
				// var tu_but = cm.get("prostoupload");

				var tu_but = ed.controlManager.get("prostoupload");

				var tu_obj = ed.plugins.prostoupload.getElement();

				/* main form */
				var tu_form = ed.plugins.prostoupload.toElement('<form class="mceButtonNormal" method="post" enctype="multipart/form-data" style="position:relative;margin-top:-22px;width:20px;height:20px;overflow:hidden;"></form>');
			        tu_form.setAttribute('id', tu_but.id + '_form');
				tu_form.setAttribute('target', tu_but.id + '_iframe');
				tu_form.setAttribute('action', ed.getParam('plugin_prostoupload_uploader'));
				tu_obj.parentNode.appendChild(tu_form);

				/* target frame for form */
				var tu_iframe = ed.plugins.prostoupload.toElement('<iframe src="javascript:false;" name="' + tu_but.id + '_iframe" />');
				tu_iframe.setAttribute('id', tu_but.id + '_iframe');
				tu_iframe.style.display = 'none';
				tu_obj.parentNode.appendChild(tu_iframe);

				/* file field */
				var tu_form_file = ed.plugins.prostoupload.toElement('<input title="Prosto Upload" type="file" name="file" style="cursor:default;opacity:0;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=1);position:absolute;right:0;bottom:0;z-index:1000;font-size:120px;margin:0;padding:0;" />');
			        tu_form_file.setAttribute('id', tu_but.id + '_field');
				tu_form.appendChild(tu_form_file);


				tu_form_file.onclick = function(e){

					var ctrl = tinyMCE.activeEditor.controlManager.get("prostoupload");

					if (ctrl.isDisabled()){
						return false;
					}
				};

				/* IE error: lost selection after losing focus */
				/* Store a current selection */
				tu_form_file.onmouseover = function(e){
					tinyMCE.activeEditor.plugins.prostoupload.getBookmark();
				};

				tu_form_file.onchange = function(e){
					tinyMCE.activeEditor.setProgressState(true);
					this.form.submit();

					/* Restore a previously selection */
					tinyMCE.activeEditor.plugins.prostoupload.moveToBookmark();
				};
			});

			ed.onNodeChange.add(function(ed, cm, e) {
				if (e.nodeName == 'IMG'){
					ed.plugins.prostoupload.setDisabled(true);
				} else {
					ed.plugins.prostoupload.setDisabled(false);
				}
			});
		},

		createControl : function(n, cm) {
		        return null;
		},

		callback: function(url){
			tinyMCE.activeEditor.setProgressState(false);
			tinyMCE.activeEditor.plugins.prostoupload.moveToBookmark();
			tinyMCE.activeEditor.execCommand('mceInsertContent', false, '<img src="'+url+'" alt="Image" />');
		},

		setDisabled: function(state){
			var ed = tinyMCE.activeEditor;
			var cm = ed.controlManager;

			var ctrl = cm.get("prostoupload");

			if (state && !ctrl.isDisabled()){
				cm.setDisabled('prostoupload', true);
			} else if (!state && ctrl.isDisabled()) {
				cm.setDisabled('prostoupload', false);
			}

		},

		getElement: function(sufix){
			var ed = tinyMCE.activeEditor;
			var cm = ed.controlManager;

			var ctrl = cm.get("prostoupload");
			switch (sufix) {
				case "iframe":
					return document.getElementById(ctrl.id + "_iframe");
				case "form":
					return document.getElementById(ctrl.id + "_form");
				case "field":
					return document.getElementById(ctrl.id + "_field");
				default:
					// store like this._element for fast getting object
					if (! ctrl._element)
						ctrl._element = document.getElementById(ctrl.id);
					return ctrl._element;
			}
			return null;
		},


		toElement: function(html){
			var div = document.createElement('div');
			div.innerHTML = html;

			var element = div.firstChild;
			div.removeChild(element);

			return element;
		},

		getBookmark: function(){
			_bookmark = tinyMCE.activeEditor.selection.getBookmark();
		},

		moveToBookmark: function(){
			tinyMCE.activeEditor.selection.moveToBookmark(_bookmark);
		},

		getInfo : function() {
			return {
				longname : 'Prosto Upload Plugin for tinyMCE',
				author : 'Gansik',
				authorurl : 'http://gansik.tagv.com',
				infourl : '',
				version : "0.1"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('prostoupload', tinymce.plugins.prostoUploadPlugin);
})();
