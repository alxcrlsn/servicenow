/*
Created by Sova Nhem
November 17, 2016

Call using javascript:new BackfillSupportGroup().BackfillSupportGroup(current.u_support_org) in reference qualifier field
*/

var BackfillSupportGroup = Class.create();
BackfillSupportGroup.prototype = {
	initialize: function() {
	},
	
	BackfillSupportGroup:function(a) {
		var gp = ' ';
		
				//return everything if the u_support_org value is empty
		if(!a)
			return;
 
		//sys_user_group has the group to support org relationship
		var grp = new GlideRecord('sys_user_group');
		grp.addQuery('u_support_team', a);
		grp.query();
		while(grp.next()) {
			if (gp.length > 0) {
				//build a comma separated string of groups if there is more than one
				gp += (',' + grp.sys_id);
			}
			else {
				gp = grp.sys_id;
			}
		}
    
		// return Groups where support org is in those groups we use IN for lists
		return 'sys_idIN' + gp;
	},
    type: 'BackfillSupportGroup'
};
