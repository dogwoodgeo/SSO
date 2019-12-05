---

---

# SSO
This web map application allows the user to query for Sanitary Sewer Overflows on their occurrence date.  Run the query without a date entry to load all SSOs. 

Application is not designed to be viewed on small screens (i.e., smartphones).  Also, Safari for macOS doesn't support "date picker" inputs: 

<input type="date" name="sso-date" id='ssoDate' placeholder="YYYY-MM-DD">

Date must be entered as text formatted as specified in 'placeholder'.  I'm a Mac user, but I didn't want to add a bunch of JQuery for a small subset of users.

This application was created with the Esri's ArcGIS API for Javascript 4.13.

Application can be viewed live [here](https://gis.lrwu.com/sso).







### 
