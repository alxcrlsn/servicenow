
1
/* 
Okay, this one's a little tricky but I believe it's adherent to ServiceNow best practices. Let me run you through it. 
This form relies on an execution plan called 'Firewall Exception Plan' (System Policy > Service Catalog > Execution Plans) in order to work.
Here's the ServiceNow KB: http://wiki.servicenow.com/index.php?title=Creating_a_Change_Management_Execution_Plan

This is what happens:
1. This is a record producer. Using the script below, it creates a change that goes to security.
2. At the moment the change is created, ServiceNow checks ALL execution plans to see if they have any criteria. This happens for EVERY change.
3. This change adds a distinct phrase to the short description to trigger the Execution Plan. If you change it without updating the execution plan things will break. 
4. The phrase is: 'This is a firewall exemption request generated through the Service Catalog.'
5. This execution plan creates tasks for telecom and computer operations for their respective parts of the firewall change. By default, they are in a pending state.
6. Once the change is made and matched with the plan, it awaits approval.
7. Once approval is granted on the CHANGE, the tasks go into an active state. At this point, telecom and comp ops do their thing.
8. If desired, a bonus final approval task can be added that goes to security for final approval. Talk to me if you want this. 
9. The tasks are linked to the change, so they can pull change info (Partially done right now. Could be more effective.)
10. From the change, network security can monitor progress. 
11. Right now everything is manual. There are NO notifications of new task, required approval, etc. They are just added to the queue and must be checked manually.
12. Hopefully, in the future, I can figure out notifications. 
13. Once the change tasks are complete, security can notify the client, update the parent change as needed, and close. 
14. Core functionality works at the moment, but we'll likely want to add additional features down the road.
*/

var s = 'Thank you for submitting your request.<br/>';
s += 'Your ticket number is: ' + current.number +'<br/>';
s += 'UTS will contact you if they need any further information.<br/>';
s += 'You can track status from the <a href="home.do" class="breadcrumb" >Homepage</a> <br/>';
gs.addErrorMessage(s); // Prints message above

current.approval.setDisplayValue('Requested'); // Sets approval to requested
current.risk.setDisplayValue(3); // Sets risk to low
current.type.setDisplayValue('Standard/Routine'); // Sets type to standard/routine
current.start_date.setDisplayValue(producer.startDate); // Sets start date
current.end_date.setDisplayValue(producer.endDate); // Sets end date
current.assignment_group.setDisplayValue('Security'); // Sets assignment group
current.u_category.setDisplayValue('Security > Firewall'); // Sets category
current.short_description = 'Firewall Exemption Request: ' + producer.duIP; // Sets short description

// Looooong... records form values in description
current.description = 'This is a firewall exemption request generated through the Service Catalog.' + '\n\n' + 'Start date: ' + producer.startDate + '\n' + 'End date:' + producer.endDate + '\n' + 'Description: ' + producer.requestDescription + '\n\n' + 'DU FQDN/IP: ' + producer.duFQDN + ' | ' + producer.duIP + '\n' + 'External FQDN/IP: ' + producer.externalFQDN + ' | ' + producer.externalIP + '\n' + 'External contact: ' + producer.externalName + ' | ' + producer.externalContact + '\n' + 'Port 1: ' + producer.port1 + ' | ' + producer.protocol1 + '\n' + 'Port 2: ' + producer.port2 + ' | ' + producer.protocol2 + '\n' + 'Port 3: ' + producer.port3 + ' | ' + producer.protocol3;
producer.redirect = "home.do"; // Redirects user home
