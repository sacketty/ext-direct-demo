/*

This file is a modified version of direct-grid.js found in the Ext JS 4 package.

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
Ext.onReady(function() {
	Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);
	
	//added model inside onready
	Ext.define('PersonalInfo', {
		extend: 'Ext.data.Model',
		fields: ['id', 'name', 'address', 'state']
	});

	var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
    		clicksToMoveEditor: 1,
    		autoCancel: false
	});

	var itemsPerPage = 15;   // set the number of items you want per page
	
	//separated store into unique var for guaranteeRange
	var store = Ext.create('Ext.data.Store', {
		model: 'PersonalInfo',
		pageSize: itemsPerPage, // items per page
		autoLoad: true,
		proxy: {
			type: 'direct',
			api: {
				create: Owner.create,
				read: Owner.read,
				update: Owner.update,
				destroy: Owner.destroy
			},
		        reader: {
		            type: 'json',
		            root: 'owners',
		            totalProperty: 'total'
		        }
		}
	});

	var alphaSpaceTest = /^[-\sa-zA-Z]+$/;

	Ext.apply(Ext.form.field.VTypes, {
	    //  vtype validation function
	    alphaSpace: function(val, field) {
	        return alphaSpaceTest.test(val);
	    },
	    // vtype Text property: The error text to display when the validation function returns false
	    alphaSpaceText: 'Not a valid state, must not contain numbers or special characters.',
	    // vtype Mask property: The keystroke filter mask
	    alphaSpaceMask: /^[-\sa-zA-Z]+$/
	});
	
	//create the grid
	var grid = Ext.create('Ext.grid.Panel', {
		height: 450,
		width: 700,
		cls: 'grid',
		title: 'Velociraptor Owners',
		store: store,
		plugins: [
		    rowEditing
		],
		dockedItems: [{
		    xtype: 'pagingtoolbar',
		    store: store,
		    dock: 'bottom',
		    items: [
			{
			    iconCls: 'add',
			    text: 'Add',
			    handler: function() {
				rowEditing.cancelEdit();
				// create a record
				var newRecord = Ext.create('PersonalInfo');

				// insert into store and start editing that record
				store.insert(0, newRecord);
				rowEditing.startEdit(0, 0);

				// get the selection model in order to get which record is selected
				var sm = grid.getSelectionModel();

				// after user clicks off from editing, sync the store, remove the record from the top and reload the store to see new changes
				grid.on('edit', function() {
				var record = sm.getSelection()
				store.sync();
				store.remove(record);
				store.load();
				});
			    }
			}, {
			    iconCls: 'delete',
			    text: 'Delete',
			    handler: function() {
				rowEditing.cancelEdit();
				var sm = grid.getSelectionModel();

				Ext.Msg.show({
			           title:'Delete Record?',
			           msg: 'You are deleting a record permanently, this cannot be undone. Proceed?',
			           buttons: Ext.Msg.YESNO,
			           icon: Ext.Msg.QUESTION,
			           fn: function(btn){
			              if (btn === 'yes'){
			                store.remove(sm.getSelection());
			                store.sync();
			              }
			           }
			      });
			    }
			}
		     ]
		}],
		columns: [{
			dataIndex: 'id',
			width: 50,
			text: 'ID'
		}, {
			dataIndex: 'name',
			flex: 1,
			text: 'Name',
			field: {
			    type: 'textfield',
			    allowBlank: false
			}
		}, {
			dataIndex: 'address',
			flex: 1.3,
			text: 'Address',
			field: {
			    type: 'textfield',
			    allowBlank: false
			}
		}, {
			dataIndex: 'state',
			flex: 1,
			text: 'State',
			field: {
			    type: 'textfield',
			    allowBlank: false,
			    vtype: 'alphaSpace'
			}
		}],
		renderTo: Ext.getBody()
	});

	grid.on('edit', function(editor, e) {
	    // commit the changes right after editing finished
	    editor.store.update();
	});
});
