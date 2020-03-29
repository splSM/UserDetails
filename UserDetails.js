
vars.$L_exit = 'normal';
var fun = system.functions;

function get() {
   var action = vars.$L_extaccess_file.action_names[0].toString();
   if ( action != 'GET' )
       {
        print('ERROR: The requested web service action was not found!');
        vars.$L_exit = 'badval';
        }
   else
       {
        if ( vars.$L_file.user == null)
            {
             print('ERROR: No user was provided! Use this format as your POST data (without backslashes, obviously): { "UserTickets": { "User" : "<insert username here>" } }');
             vars.$L_exit = 'badval';
             }
        else
            {
             vars.$L_file.tickets = '';
///////////////////////////////////////////////////////////////////////////// SDs:
             var query = 'callback.contact="' + vars.$L_file.user + '"'
             
             if ( vars.$L_file.timeOpened != null )  { query = query + "and open.time>'" + vars.$L_file.timeOpened + "'" }
             if ( vars.$L_file.timeUpdated != null ) { query = query + "and update.time>'" + vars.$L_file.timeUpdated + "'" }
             if ( vars.$L_file.timeClosed != null )  { query = query + "and close.time>'" + vars.$L_file.timeClosed + "'" }
             
             var SD = new SCFile( 'incidents' );
             var rc = SD.doSelect( query );

             while ( rc == RC_SUCCESS )
                    {
                     vars.$L_file.tickets = vars.$L_file.tickets + SD.incident_id + '|' + SD.title + '|' + SD.open + '`';
                     rc = SD.getNext();
                     }

///////////////////////////////////////////////////////////////////////////// IMs:
             query = fun.strrep(query, 'callback.contact', 'contact.name')             

             var IM = new SCFile( 'probsummary' );
             var rc = IM.doSelect( query );

             while ( rc == RC_SUCCESS )
                    {
                     vars.$L_file.tickets = vars.$L_file.tickets + IM.number + '|' + IM.brief_description + '|' + IM.problem_status + '`';
                     rc = IM.getNext();
                     }
///////////////////////////////////////////////////////////////////////////// RFs:
             var query = 'requested.for="' + vars.$L_file.user + '"'
             
             if ( vars.$L_file.timeOpened != null )  { query = query + "and submit.date>'" + vars.$L_file.timeOpened + "'" }
             if ( vars.$L_file.timeUpdated != null ) { query = query + "and update.date>'" + vars.$L_file.timeUpdated + "'" }
             if ( vars.$L_file.timeClosed != null )  { query = query + "and close.date>'" + vars.$L_file.timeClosed + "'" }
             
             var RQ = new SCFile( 'request' );
             var rc = RQ.doSelect( query );

             while ( rc == RC_SUCCESS )
                    {
                     vars.$L_file.tickets = vars.$L_file.tickets + RQ.number + '|' + RQ.brief_description + '|' + RQ.status + '`';
                     rc = RQ.getNext();
                     }
///////////////////////////////////////////////////////////////////////////// PMs:
             var query = 'contact.name="' + vars.$L_file.user + '"'
             
             if ( vars.$L_file.timeOpened != null )  { query = query + "and open.time>'" + vars.$L_file.timeOpened + "'" }
             if ( vars.$L_file.timeUpdated != null ) { query = query + "and update.time>'" + vars.$L_file.timeUpdated + "'" }
             if ( vars.$L_file.timeClosed != null )  { query = query + "and close.time>'" + vars.$L_file.timeClosed + "'" }
             
             var PM = new SCFile( 'rootcause' );
             var rc = PM.doSelect( query );

             while ( rc == RC_SUCCESS )
                    {
                     vars.$L_file.tickets = vars.$L_file.tickets + PM.id + '|' + PM.brief_description + '|' + PM.rcStatus + '`';
                     rc = PM.getNext();
                     }
///////////////////////////////////////////////////////////////////////////// RFCs:
             var query = 'requested.by="' + vars.$L_file.user + '"'
             
             if ( vars.$L_file.timeOpened != null )  { query = query + "and orig.date.entered>'" + vars.$L_file.timeOpened + "'" }
             if ( vars.$L_file.timeUpdated != null ) { query = query + "and date.entered>'" + vars.$L_file.timeUpdated + "'" }
             if ( vars.$L_file.timeClosed != null )  { query = query + "and close.time>'" + vars.$L_file.timeClosed + "'" }
             
             var CR = new SCFile( 'cm3r' );
             var rc = CR.doSelect( query );

             while ( rc == RC_SUCCESS )
                    {
                     vars.$L_file.tickets = vars.$L_file.tickets + CR.number + '|' + CR.brief_description + '|' + CR.current_phase + '`';
                     rc = CR.getNext();
                     }
///////////////////////////////////////////////////////////////////////////// remove trailing characters:
              if ( vars.$L_file.tickets.substr( vars.$L_file.tickets.length - 1, 1 ) == ',' )
                  {
                   vars.$L_file.tickets = vars.$L_file.tickets.substr( 0, vars.$L_file.tickets.length - 1 );
                   }
              if ( vars.$L_file.tickets.substr( vars.$L_file.tickets.length - 1, 1 ) == '`' )
                  {
                   vars.$L_file.tickets = vars.$L_file.tickets.substr( 0, vars.$L_file.tickets.length - 1 );
                   }
///////////////////////////////////////////////////////////////////////////// Devices:
             vars.$L_file.devices = '';
             var query = 'owner="' + vars.$L_file.user + '"'
             
             var CM = new SCFile('device');
             var rc = CM.doSelect( query );

             while ( rc == RC_SUCCESS )
                    {
                     vars.$L_file.devices = vars.$L_file.devices + CM.display_name + '|' + CM.asset_tag + '|' + CM.ip_address + '|' + CM.manufacturer + '|' + CM.model + '`';
                     rc = CM.getNext();
                     } 
///////////////////////////////////////////////////////////////////////////// remove trailing characters:
              if ( vars.$L_file.devices.substr( vars.$L_file.devices.length - 1, 1 ) == ',' )
                  {
                   vars.$L_file.devices = vars.$L_file.devices.substr( 0, vars.$L_file.devices.length - 1 );
                   }
              if ( vars.$L_file.devices.substr( vars.$L_file.devices.length - 1, 1 ) == '`' )
                  {
                   vars.$L_file.devices = vars.$L_file.devices.substr( 0, vars.$L_file.devices.length - 1 );
                   }
///////////////////////////////////////////////////////////////////////////// Contact:
             vars.$L_file.contact = '';
             var query = 'contact.name="' + vars.$L_file.user + '"'
             
             var CN = new SCFile( 'contacts' );
             var rc = CN.doSelect( query );
             
             if ( rc == RC_SUCCESS )
                 {
                  vars.$L_file.contact = vars.$L_file.contact + CN.user_id + '|' + CN.dept_name + '|' + CN.title + '|' + CN.email + '|' + CN.contact_phone + '|' + CN.manager  
                  }
             }
        }
}


