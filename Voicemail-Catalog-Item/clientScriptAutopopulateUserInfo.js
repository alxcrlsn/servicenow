function onChange(control, oldValue, newValue, isLoading) {  
	user = g_form.getReference('caller_id'); 
	g_form.setValue('email', user.email);
	
	/* Vitaly's ACL prevents me from querying IDs/phone numbers unless ITIL user. This is to catch those and prevent 'undefined' from autopopulating in fields that can't be queried by the script.
	   'Undefined' happens to be 9 chars long, so if you turn this off, you run the risk that a user passes form validation and submits the form with 'undefined' filled in instead of DU ID. Also it looks tacky.
	   Email is not protected by ACL which is why it's outside the if statement. */
	
	if (user.user_name != null /* i.e. the ACL prevents script from reading the required info */) {
		g_form.setValue('phone', user.phone);
		g_form.setValue('department', user.u_department);
	}
} 
