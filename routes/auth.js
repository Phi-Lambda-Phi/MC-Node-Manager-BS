/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');

const authProvider = require('../auth/AuthProvider');
const { REDIRECT_URI, POST_LOGOUT_REDIRECT_URI } = require('../authConfig');

const router = express.Router();

redir = '';

router.get('/signin', authProvider.login({
    scopes: [],
    redirectUri: REDIRECT_URI,
    successRedirect: '/auth/acquireToken'
}));

router.get('/acquireToken', authProvider.acquireToken({
	scopes: ['User.Invite.All','User.ReadWrite.All','Directory.ReadWrite.All'],
    redirectUri: REDIRECT_URI,
    successRedirect: '/users/me'
}));

router.post('/redirect', authProvider.handleRedirect());

router.get('/signout', authProvider.logout({
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI
}));

router.post('/requestAccess', function (req, res, next) {
	Object.keys(req.body).forEach( key => {
		s = new String(req.body[key]);
		if (s.indexOf('"') != -1) {
			s = s.replace(/"/g, ``);
		}
		req.body[key] = s;
	});
	insertQuery = `INSERT INTO tblUsers (txtDisplayName,txtGivenName,txtSurname,txtBio,txtEmail,intInDirectory,intRecruitYear,intGradYear) VALUES ("${req.body.txtDisplayName}","${req.body.txtGivenName}","${req.body.txtSurname}","${req.body.txtBio}","${req.body.txtEmail}",1,${req.body.intRecruitYear},${req.body.intGradYear})`;
	DB.query(insertQuery, function(error, output){
		if(error) {throw error;} else {
			res.redirect('/auth/requestSubmitted');
		}
	});
});

router.get('/requestSubmitted', function (req, res, next) {
	res.render('pages/basicText', { 
		env: req.session.env, 
		isAuthenticated: req.session.isAuthenticated,
		title: 'Request Submitted',
		subtitle: 'Thank you!',
		page:{content:[
			{parallax:{rem:'15',url:'/res/plp/graphics/philamb_flag.png'}, hero: {title: `Request Submitted!`, 
			content: `Once your roster status is confirmed we'll email you your login credentials.`}}
		]}
	});
});

router.get('/unauthorized', function (req, res, next) {
	res.render('pages/basicText', { 
		env: req.session.env, 
		isAuthenticated: req.session.isAuthenticated,
		title: 'Unauthorized!',
		subtitle: 'The page you attempted to access is not allowed with your current permissions. If you believe this is in err, contact your site administrator.',
		page:{content:[
			{parallax:{rem:'15',url:'/res/plp/graphics/philamb_flag.png'}, hero: {title: `Unauthorized!`, 
			content: `The page you attempted to access is not allowed with your current permissions. If you believe this is in err, contact your site administrator.`}}
		]}
	});
});


module.exports = router;