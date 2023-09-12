/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');
var router = express.Router();
var fetch = require('../fetch');
const path = require('path');
const fs = require('fs');
var { GRAPH_ME_ENDPOINT } = require('../authConfig');
const axios = require('axios');
const multer = require("multer");
var upload = multer({ dest: './public/res/app/photos/temp' ,
  
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }});
const sharp = require('sharp');

var profileHeadspace = '10';
		
function resize(path, format, width, height) {
	const readStream = fs.createReadStream(path)
	let transform = sharp()

	if (format) {
		transform = transform.toFormat(format)
	}

	if (width || height) {
		transform = transform.resize(width, height)
	}
	return readStream.pipe(transform)
}

const handleError = (err, res) => {
	res.status(500)
		.contentType("text/plain")
		.end("Oops! Something went wrong!");
};

//	Custom middleware to check auth state
async function isAuthenticated(req, res, next) {	
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/signin'); // redirect to sign-in route
    }
	
	try {
		if(!req.session.activeUser || !req.session.env || req.session.reauth){
			graph = await fetch(GRAPH_ME_ENDPOINT, req.session.accessToken);
			
			DB.query(`SELECT * FROM tblUsers WHERE txtGUID = '${graph.id}'`, function(error, data){
				if(error) {throw error;} else {
					local = data[0];
					if( data.length ) {
						if( local.txtStatus == 'Invited' ) { DB.query(`UPDATE tblUsers SET txtStatus = 'Active' WHERE txtGUID= '${graph.id}'`, function(error, out){}); }
						req.session.activeUser = {
							'local':local,
							'graph':graph,
						}
					}
					
					next();
				}
			});
		} else {
			next();
		}
	} catch (error) {
		next(error);
	}
};

async function axiosPatch(url, data, options) {
    const response = await axios.patch(url, data, options)
    return response.data
}

async function axiosPost(url, data, options) {
    const response = await axios.post(url, data, options)
    return response.data
}

/* General REST PATCH / SQL update. */
function sqlPatch(req, res, next){
	table = req.session.table;
	response = 200;
	data = req.body;
	
	tableKey = {
		'tblUsers':'int',
		'tblSQLHistory':'intSQLHistory',
		'tblRoster':'intRoster',
		'tblPhil':'intPhil',
		'tblPayment':'intPayment',
		'tblLeaders':'intLeader',
		'tblHistory':'intHistory',
		'tblFAQ':'intFAQ',
		'tblEvents':'intEvent',
		'tblEnv':'intEnv',
		'tblChapter':'intChapter',
	};
	
	id_key = `${tableKey[table]}Id`;

	pos = 0;
	let id_value;
	
	length = Object.keys(data).length;

	// Start the query string
	let query = `UPDATE ${table} SET `;
	
	// For loop to populate the query string based on the passed parameters in the request body
	for(let i=0; i < length; i++){
		let key = Object.keys(data)[i];
		
		s = Object.values(data)[i];
		if (s.indexOf('"') != -1) {
			s = s.replace(/"/g, `\\"`);
		}
		value = s;
		
		if(value && key != id_key){
			if(pos > 0){query = query + ", ";}
			query = query + `${key}="${value}"`;
			pos++;
		} 
		
		if (key === id_key){
			id_value = value;
		}
	}
	
	// Finish the query
	query = query + ` WHERE ${id_key} = ${id_value}`;
	// Execute the query
	DB.query(query, function(error, output){
		if(error){
			response = 500;
			throw error;
		} else {
			next();
			response = 201;
		} 
	});
	
	return response;
}

router.get('/me',
    isAuthenticated, // check if user is authenticated
    function (req, res, next) {
		DB.query(`SELECT * FROM tblRoster WHERE intId = ${req.session.activeUser.local.intId} ORDER BY intRosterYear`, function(error, roster){
			if(error) {throw error;} else {
				req.session.activeUser.roster = roster;
				
				rosterTable = '';
				for( i=0; i<roster.length;i++) {
					rosterTable += `<tr><td>${roster[i].intRosterYear}-${roster[i].intRosterYear+1}</td><td>${roster[i].txtTitle}</td></tr>`;
				}
				
				displayEmploy = req.session.activeUser.local.txtJobTitle.length ? `Employment<br>
									<div class="text-muted">${req.session.activeUser.local.txtJobTitle} in ${req.session.activeUser.local.txtDepartment}<br>${req.session.activeUser.local.txtCompanyName}</div>` : `<br>No employment on file<br>` ;
				displayBio = req.session.activeUser.local.txtBio.length ? `Bio<br>
									<div class="text-muted">${req.session.activeUser.local.txtBio}<br></div>` : `<br>No bio on file<br>` ;
				displayStreet = req.session.activeUser.local.txtStreetAddress.length ? `Current Address<br>
									<div class="text-muted">${req.session.activeUser.local.txtStreetAddress}<br>${req.session.activeUser.local.txtCity}, ${req.session.activeUser.local.txtState} ${req.session.activeUser.local.txtPostalCode}</div>` : `<br>No address<br>` ;
									
				res.render('pages/basicText', { 
					env: req.session.env, 
					isAuthenticated: req.session.isAuthenticated,  
					activeUser: req.session.activeUser,
					title: 'Profile',
					subtitle: 'My PLP information',
					page:{content:[
						{parallax:{rem:profileHeadspace,url:'/res/plp/graphics/philamb_flag.png'}, hero: {title: `<div>${req.session.activeUser.local.txtDisplayName}</div>
							<div class="btn-group" role="group" aria-label="buttons">
								<a class="btn btn-secondary" href="/users/me/edit">Edit Profile</a>
								<a class="btn btn-secondary" href="/users/me/roster/edit">Edit Roster</a>
							</div>`, 
						content: `</p>
							<div class="row justify-content-center">
								<div class="my-auto col-md-4 col-lg-3 col-sm-12" style="text-align:left!important;">Email
									<div class="text-muted">${req.session.activeUser.local.txtEmail.length == 0 ? 'No E-mail' : req.session.activeUser.local.txtEmail }</div>
									<div class="text-muted">${req.session.activeUser.local.txtPrincipalName}</div>
									<hr>Enrollment
									<div class="text-muted">Recruit ${req.session.activeUser.local.txtRecruitTerm} ${req.session.activeUser.local.intRecruitYear} - ${req.session.activeUser.local.intGradYear} ${req.session.activeUser.local.txtGradTerm} Graduate</div>
									<hr>In Directory
									<div class="text-muted">
										${req.session.env.inDirectory[req.session.activeUser.local.intInDirectory]}
									</div>
									<hr>Order
									<div class="text-muted">
										${req.session.env.orders[req.session.activeUser.local.intOrder]}
									</div>
									<hr>${displayBio}
									<hr>${displayStreet}
									<hr>${displayEmploy}
								</div>
								<div class="my-auto col-md-6 col-lg-6 col-sm-12">
									<h3 class="text-muted py-3">Enrollment</h3>
									<table id="rosterTable" class="my-3 table table-striped table-hover">
										<thead>
											<th class="px-3"><h5>Year</h5></th>
											<th class="px-3"><h5>Exec. Position <small class="text-muted" style="font-size:.85rem;">(blank if NA)</h5></th>
										</thead>
										<tbody class="text-muted">
											<form method="post" id="compositePhoto" action="/users/photo/upload/bulk" enctype="multipart/form-data">
												<input  id="photoType" name="photoType" value="composite" style="display:none;"></input>
												<input  id="intChapter" name="intChapter" value="${req.session.activeUser.local.intChapter}" style="display:none;"></input>
												${rosterTable}
											</form>
										</tbody>
									</table>
								</div>
								<div class="my-auto col-md-12 col-sm-12 col-lg-3">
									<img class="mx-auto my-3 d-block border border-secondary border-3 rounded shadow" src='/res/app/photos/profile/${req.session.activeUser.local.txtGUID}.png' style="max-height:15rem; max-width:10rem; object-fit:cover; object-position: 50% 0%;">
										<form method="post" id="profilePhoto" action="/users/photo/upload/" enctype="multipart/form-data">
											<input name="photoType" value="profile" style="display:none;"></input>
											<input name="photo" style="max-width:15rem;" accept=".jpg,.jpeg,.png" type="file" class="my-3">
											<br>
											<button id="savePhoto" form="profilePhoto" class="btn btn-success" href="#" type="submit">Save photo</button>
										</form>
									<br>
								</div>
							</div>
						`}}
					]}
				});
			}
		});
    }
);

router.get('/me/edit',
    isAuthenticated, // check if user is authenticated
    function (req, res, next) {		
		STATES = '';
		STATE_array = req.session.env.states;
		for( i=0; i<STATE_array.length; i++) {
			selected = '';
			if(req.session.activeUser.local.txtState == STATE_array[i]){selected='selected';}
			STATES += `<option value='${STATE_array[i]}' ${selected}>${STATE_array[i]}</option>`;
		}	
		STATUS = '';
		STATUS_array = req.session.env.status;
		for( i=0; i<STATUS_array.length; i++) {
			selected = '';
			if(req.session.activeUser.local.txtStatus == STATUS_array[i]){selected='selected';}
			STATUS += `<option value='${STATUS_array[i]}' ${selected}>${STATUS_array[i]}</option>`;
		}
		DIRECTORY = '';
		DIRECTORY_array = req.session.env.inDirectory;
		for( i=0; i<DIRECTORY_array.length; i++) {
			selected = '';
			if(req.session.activeUser.local.intInDirectory == i){selected='selected';}
			DIRECTORY += `<option value='${i}' ${selected}>${DIRECTORY_array[i]}</option>`;
		}
		rTERMS = '';
		TERM_array = req.session.env.terms;
		for( i=0; i<TERM_array.length; i++) {
			selected = '';
			if(req.session.activeUser.local.txtRecruitTerm == TERM_array[i]){selected='selected';}
			rTERMS += `<option value='${TERM_array[i]}' ${selected}>${TERM_array[i]}</option>`;
		}
		
		gTERMS = '';
		for( i=0; i<TERM_array.length; i++) {
			selected = '';
			if(req.session.activeUser.local.txtGradTerm == TERM_array[i]){selected='selected';}
			gTERMS += `<option value='${TERM_array[i]}' ${selected}>${TERM_array[i]}</option>`;
		}
		
		req.session.table = 'tblUsers';
		
		res.render('pages/basicText', { 
			env: req.session.env, 
			isAuthenticated: req.session.isAuthenticated,  
			activeUser: req.session.activeUser,
			title: 'Profile',
			subtitle: 'My PLP information',
			page:{content:[
				{parallax:{rem:profileHeadspace,url:'/res/plp/graphics/philamb_flag.png'}, hero: {title: `<div>${req.session.activeUser.local.txtDisplayName}</div>
					<div class="btn-group" role="group" aria-label="buttons">
						<a class="btn btn-secondary" href="/users/me">Cancel</a>
						<button form="profile_edit" class="btn btn-success" href="#" type="submit">Save</button>
					</div>`, 
				content: `</p>
					<div class="row">
						<div class="col my-auto">
							<div class="row justify-content-center">
								<div class="col-sm-8 col-lg-3">
								<img class="mx-auto my-3 d-block border border-secondary border-3 rounded shadow" src='/res/app/photos/profile/${req.session.activeUser.local.txtGUID}.png' style="max-height:20rem; max-width:15rem; object-fit:cover; object-position: 50% 0%;">
								</div>
							<div class="mx-3 col-lg-6 col-sm-8" style="text-align:left!important;">
								<form class="plp-form" method="post" action="/users/me/edit" id="profile_edit">
									Preferred Name<br><span class="text-xsmall text-muted">Publicly visible only to brothers</span><br>
										<div class="lead"> 
											<input style="max-width:47.5%" name="txtGivenName" placeholder="Given Name" type="text" value="${req.session.activeUser.local.txtGivenName}" required></input>
											<input style="max-width:47.5%" name="txtSurname" placeholder="Surname" type="text" value="${req.session.activeUser.local.txtSurname}" required></input>
										</div>
									<br>Display Name
										<div class="lead"> 
											<input name="txtDisplayName" placeholder="Display Name" type="text" value="${req.session.activeUser.local.txtDisplayName}" required></input>
										</div>
									<br>Email
									<div class="text-muted">
										<div class="lead"> 
											<input style="width:100%;" name="txtEmail" placeholder="E-Mail" type="email" value="${req.session.activeUser.local.txtEmail}"></input>
										</div>
									</div>
									<div class="text-muted">
										${req.session.activeUser.local.txtPrincipalName}
									</div>
									<br>In Directory
									<div class="row">
										<div class="col-lg-6 col-sm-12 text-muted">
											<select style="width:100%;" id="intInDirectory" name="intInDirectory" type="text">${DIRECTORY}</select>
										</div>
									</div>
									<br>Enrollment
									<table>
										<tr>
											<td class="text-muted">Recruit</td>
											<td><select class="mx-3" style="max-width:5rem;" id="txtRecruitTerm" name="txtRecruitTerm" type="text">${rTERMS}</select></td>
											<td><input style="max-width:5rem;" name="intRecruitYear" placeholder="Pledge year" type="number" value="${req.session.activeUser.local.intRecruitYear}" required></input></td>
										</tr>
										<tr>
											<td class="text-muted">Alumnus</td>
											<td><select class="mx-3" style="max-width:5rem;" id="txtGradTerm" name="txtGradTerm" type="text">${gTERMS}</select>
											<td><input style="max-width:5rem;" name="intGradYear" placeholder="Alumnus year" type="number" value="${req.session.activeUser.local.intGradYear}" required></input></td>
										</tr>
									</table>
									<br>Current Address<br><span class="text-xsmall text-muted">Private. Used for Alumni newsletter and outreach</span><br>
									<div class="lead">
										<input name="txtStreetAddress" placeholder="Address" type="text" value="${req.session.activeUser.local.txtStreetAddress}"></input>
										<br>
										<input name="txtCity" placeholder="City" type="text" value="${req.session.activeUser.local.txtCity}"></input>, <select id="txtState" name="txtState" type="text">${STATES}</select>
										<input name="txtPostalCode" placeholder="ZIP" type="number" value="${req.session.activeUser.local.txtPostalCode}"></input>
									</div>
									<br>Employment<br>
									<div class="text-muted">
										<input placeholder="Title" name="txtJobTitle" type="text" value="${req.session.activeUser.local.txtJobTitle}"></input> in <input name="txtDepartment" placeholder="Department" type="text" value="${req.session.activeUser.local.txtDepartment}" style="width:75%;"></input> at
										<br><input name="txtCompanyName" placeholder="Company" type="text" value="${req.session.activeUser.local.txtCompanyName}" style="width:100%;"></input>
										<input name="intId" type="number" value="${req.session.activeUser.local.intId}" style="display:none;"></input>
									</div>
									<br>Bio<br><span class="text-xsmall text-muted">Publicly visible if you were a chapter exec</span><br>
									<div class="lead">
										<textarea style="width:100%;" name="txtBio" placeholder="Biography" type="text" value="${req.session.activeUser.local.txtBio}">${req.session.activeUser.local.txtBio}</textarea>
										<br>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
				<script>
						$("#txtState").val('${req.session.activeUser.local.txtState}');
				</script>`}}
			]}
		});
    }
);

router.post('/me/edit',
    isAuthenticated, // check if user is authenticated
	sqlPatch,
    function (req, res, next) {
//		Update Azure as well
		
		const endpoint = `https://graph.microsoft.com/v1.0/users/${req.session.activeUser.local.txtGUID}/`;
		
		local = req.body;
		
		const user = {
			displayName: local.txtDisplayName,
			employeeId: local.intId,
			givenName: local.txtGivenName,
			mail: local.txtPrincipalName,
			mailNickname: local.txtGivenName.substring(0,1).toLowerCase() + local.txtSurname.toLowerCase(),
			surname: local.txtSurname,
			userPrincipalName: local.txtPrincipalName,
		};
		
		if(local.txtCompanyName) { user['companyName'] = local.txtCompanyName; }
		if(local.txtDepartment) { user['department'] = local.txtDepartment; }
		if(local.txtJobTitle) { user['jobTitle'] = local.txtJobTitle; }
		if(local.txtPostalCode) { user['postalCode'] = local.txtPostalCode; }
		if(local.txtStreetAddress) { user['streetAddress'] = local.txtStreetAddress; }
		
		try {
			axiosPatch(endpoint, user, {
				'headers':{
					'Authorization': `Bearer ${req.session.accessToken}`,
					'Content-Type': 'application/json',
					'Accept-Encoding': 'application/json'
				}
			}).then( value => {
				console.log(`user updated GUID ${value.id}`);
			});
		} catch (error) {
			next(error);
		}
//		Setting reauth will reload the req.session.activeUser var with new values
		req.session.reauth = 1;
		res.redirect('/users/me');
    }
);

router.get('/me/roster/edit',
    isAuthenticated, // check if user is authenticated
    function (req, res, next) {		
		profile = req.session.activeUser.local;		
		req.session.table = 'tblUsers';
		
		currentYear = new Date().getFullYear();
		function getRosterYears(activeYear) {
			foundingYear = 1969;
			yearSpan = 1 + currentYear - 1969;
			yearsArray = Array.from({length: yearSpan}, (_, i) => currentYear - i);
			rosterYears = '';
			
			for( i=0; i<yearsArray.length; i++ ) {
				selected = '';
				if(activeYear == yearsArray[i]){selected='selected';}
				rosterYears += `<option value='${yearsArray[i]}' ${selected}>${yearsArray[i]}-${yearsArray[i]+1}</option>`;
			}
			return rosterYears;
		}
		
		
		req.session.table = 'tblUsers';
		
		DB.query(`SELECT intChapterId,txtName FROM tblChapters`, function(error, chapters){
			if(error) {throw error;} else {
				chapterSelect = '';
				chapter = {};
				for( i=0; i<chapters.length; i++) {
					chapter[chapters[i].intChapterId] = chapters[i].txtName;
				}
				
				roster = req.session.activeUser.roster;
				rosterTable = '';
				for( j=0; j<roster.length; j++ ){
					rosterTitle = roster[j].txtTitle;
					rosterTable += `<tr id='rosterTableRow${j}'><td><select name='rosterYear${j}' class='my-1'>${getRosterYears(roster[j].intRosterYear)}</select></td><td><input name='rosterPosition${j}' class='my-1' type='text' value='${roster[j].txtTitle}'></input></td><td><button onclick="removeRow(${j})" class='btn' type='button' id='rosterTableRemoveRow'><i class='fa-solid fa-trash-can'></i></button></td></tr>`;
				}
				
				Object.keys(chapter).forEach( elem => {
					if(chapter[elem]!='Alumni'){
						selected = '';
						if(req.session.activeUser.local.intChapter == elem){selected=' selected';}
						chapterSelect += `<option value='${elem}'${selected}>${chapter[elem]}</option>`;
					}
				});
				
				res.render('pages/basicText', { 
					env: req.session.env, 
					isAuthenticated: req.session.isAuthenticated,  
					activeUser: req.session.activeUser,
					title: 'Profile',
					subtitle: 'My PLP information',
					isAuthenticated: req.session.isAuthenticated,
					page:{content:[
						{parallax:{rem:profileHeadspace,url:'/res/plp/graphics/philamb_flag.png'}, hero: {title: `<div>${req.session.activeUser.local.txtDisplayName}</div>
							<div class="btn-group" role="group" aria-label="buttons">
								<a class="btn btn-secondary" href="/users/me">Cancel</a>
								<button form="rosterEditForm" class="btn btn-success" type="submit">Save</button>
							</div>`, 
						content: `</p>
						<div class="container-fluid">
							<div class="row">
								<div class="col">
									<form id="rosterEditForm" method="post" action="/users/me/roster/edit" class="plp-form">
										<br>
										<div class="row">
											<div class="col my-auto">Chapter <select name="intChapter">${chapterSelect}</select></div>
											<div class="col my-auto"><h3 class="text-muted py-3">Enrollment</h1></div>
											<div class="col my-auto">
												<div class="btn-group" role="group" aria-label="buttons">
													<button type="button" onclick="addRow();" class="btn btn-secondary">Add Row</button>
												</div>
											</div>
										</div>
										<br>
										<div class="my-3 container-fluid" style="overflow: auto;">
											<table id="rosterTable" class="table table-striped table-hover">
												<thead>
													<tr>
														<th class="px-3 col"><h5>Year</h5></th>
														<th class="px-3 col"><h5>Exec. Title <small class="text-muted" style="font-size:.85rem;">(blank if NA)</h5></th>
														<th class="px-3 col"><h5>Remove</h5></th>
													</tr>
												</thead>
												<tbody id="rosterTableBody" class="text-muted">
													${rosterTable}
												</tbody>
											</table>
										</div>
									</form>
								</div>
							</div>
						</div>
						<script>
							function recountRows() {
								$('#rosterTableBody tr').each(function(i, obj) {
									console.log('tr' + i);
									$(this).attr("id","rosterTableRow" + i);
								});
								$('#rosterTableBody button').each(function(i, obj) {
									console.log('button' + i);
									$(this).unbind();
									
									$(this).on('click', function() {removeRow(i)});
								});
								$('#rosterTableBody select').each(function(i, obj) {
									$(this).attr('name','rosterYear' + i);
								});
								$('#rosterTableBody input').each(function(i, obj) {
									$(this).attr('name','rosterPosition' + i);
								});
							}							
							function addRow() {
								let rowNumber = $('#rosterTableBody tr').length;
								$('#rosterTableBody').append("<tr id='rosterTableRow"+rowNumber+"'><td><select name='rosterYear"+rowNumber+"' class='my-1'>${getRosterYears(currentYear)}</select></td><td><input name='rosterPosition"+rowNumber+"' class='my-1' type='text'></input></td><td><button class='btn' type='button' id='rosterTableRemoveRow"+rowNumber+"'><i class='fa-solid fa-trash-can'></i></button></td></tr>");
								recountRows();
							}							
							function removeRow(rowNumber) {
								$('#rosterTableRow' + rowNumber).remove();
								$('#rosterTableBody select').each(function(i, obj) {
									$(this).attr('name','rosterYear' + i);
								});
								$('#rosterTableBody input').each(function(i, obj) {
									$(this).attr('name','rosterPosition' + i);
								});
							}
						</script>`}}
					]}
				});
			}
		});
	}
);

router.post('/me/roster/edit',
    isAuthenticated, // check if user is authenticated
    function (req, res, next) {
		console.log(req.body);
		intChapter = req.body.intChapter;
		
		delete req.body['txtChapter'];
		
		intRosterRows = Math.floor(Object.keys(req.body).length / 2);
		objRoster = {};
		
		insertQuery = 'INSERT INTO tblRoster (intRosterYear,intChapter,txtTitle,intId) VALUES ';
		
		for( i=0; i<intRosterRows; i++ ) {
			objRoster[req.body['rosterYear'+i]] = req.body['rosterPosition'+i];
			insertQuery += `(${req.body['rosterYear'+i]},${intChapter},'${req.body['rosterPosition'+i]}',${req.session.activeUser.local.intId})`;
			if( i+1 != intRosterRows ) {
				insertQuery += ',';
			}
		}
		
		DB.query(`DELETE FROM tblRoster WHERE intId = ${req.session.activeUser.local.intId}`, function(error, chapters){
			if(error) {throw error;} else {
				DB.query(insertQuery, function(error, chapters){
					if(error) {throw error;} else {
						res.redirect('/users/me');
					}
				});
			}
		});
    }
);

router.post('/photo/upload',
    isAuthenticated, // check if user is authenticated
	upload.single('photo'), function (req, res) {
		const tempPath = req.file.path;
		let targetPath = path.join(__dirname, `../public/res/app/photos/profile/${req.session.activeUser.local.txtGUID}.png`);
		ws = fs.createWriteStream(targetPath)
		resize(tempPath,'png',500,500).pipe(ws);
		
		res.redirect('/users/me');
	}
);

router.post('/photo/upload/bulk',
    isAuthenticated, // check if user is authenticated
	upload.fields([{name:'photo', maxCount: 10}]), function (req, res) {
		tempPath = '';
		targetPath = '';
		
		console.log(req.files.photo);
		
		Object.keys(req.files.photo).forEach( elem => {
			tempPath = req.files.photo[elem].path;
			targetPath = path.join(__dirname, `../public/res/app/photos/composite/${req.body.intChapter}/${req.body.year[elem]}/${req.session.activeUser.local.txtGUID}.png`);
			ws = fs.createWriteStream(targetPath)
			resize(tempPath,'png',500,500).pipe(ws);
		});
	}
);

module.exports = router;