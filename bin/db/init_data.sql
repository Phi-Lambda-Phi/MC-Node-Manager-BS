--	init_data.sql
--	MySQL Database sample roster for PhiLambdaPhi.org

--
--	Database: `prod`
--

--
-- Sample data for table `tblUsers`
--

INSERT INTO `tblUsers` (`txtDisplayName`,`intRole`,`txtGivenName`,`txtSurname`,`txtBio`,`txtPrincipalName`,`txtPhone`,`intInDirectory`,`intChapter`,`intOrder`,`intRecruitYear`,`intGradYear`,`intBrotherBig`,`intBrotherLittle`,`dtCreatedTime`) VALUES 
--	0 for Alpha Chapter
	('John Test', 0,'John','Test','','jtest@philambdaphi.org','',3,2,4,1969,2023,5,6,'2022-07-27 2:52:17'),
	('Blaine Harper', 4,'Blaine','Harper','B.S. in Statistics \'20<br>KTRM DJ | Khan Queso Rock Star','bharper@philambdaphi.org','',2,2,4,2017,2020,5,6,'2022-07-27 2:52:18'),
	('Josh Holtgrieve', 2,'Joshua','Holtgrieve','','jholtgrieve@philambdaphi.org','',0,2,4,2017,2020,5,6,'2022-07-27 2:52:19'),
	('Wesley Fitzsimmons', 2,'Wesley','Fitzsimmons','','wfitzsimmons@philambdaphi.org','',0,2,4,2017,2020,5,6,'2022-07-27 2:52:20'),
	('Raymond Featherston', 2,'Raymond','Featherston','','rfeatherston@philambdaphi.org','',0,2,4,2017,2020,5,6,'2022-07-27 2:52:21'),
	('Clayton Capriglione', 2,'Clayton','Capriglione','','ccapriglione@philambdaphi.org','3148032676',0,2,3,2022,2026,5,6,'2022-07-27 9:18:21'),
	('Aidan Spurgeon', 2,'Aidan','Spurgeon','','aspurgeon@philambdaphi.org','5738225386',0,2,3,2021,2025,5,6,'2022-07-27 9:18:21'),
	('Nate Boyd', 2,'Nate','Boyd','','nboyd@philambdaphi.org','5736442989',0,2,3,2022,2026,5,6,'2022-07-27 9:18:21'),
	('Luke Hinton', 2,'Luke','Hinton','','lhinton@philambdaphi.org','5735088252',0,2,2,2022,2026,5,6,'2022-07-27 9:18:21'),
	('Ben York', 2,'Ben','York','','byork@philambdaphi.org','',0,2,4,2017,2019,5,6,'2022-07-27 2:52:18'),
	('Sam Vaclavik', 2,'Samuel','Vaclavik','','jholtgrieve@philambdaphi.org','',0,2,4,2018,2023,5,6,'2022-07-27 2:52:19'),
	('Dan Owen', 2,'Dan','Owen','','dowen@philambdaphi.org','',0,2,4,2012,2017,5,6,'2022-07-27 2:52:19');

--
-- Sample data for table `tblRoster`
--

INSERT INTO `tblRoster` (`intRosterYear`,`intChapter`,`txtTitle`,`intId`) VALUES 
--	2 for Alpha Chapter
	(2019,2,'President',2),
	(2018,2,'President',2),
	(2018,2,'Secretary',3),
	(2019,2,'V. President',3),
	(2020,2,'President',3),
	(2019,2,'Treasurer',4),
	(2018,2,'Treasurer',4),
	(2018,2,'Sentinel',5),
	(2019,2,'Sentinel / Secretary',5),
	(2023,2,'President',6),
	(2023,2,'V. President / Sentinel',7),
	(2023,2,'Treasurer',8),
	(2023,2,'Secretary',9),
	(2018,2,'V. President',10),
	(2020,2,'V. President',11)
;

--
-- Sample data for table `tblChapters`
--

INSERT INTO `tblChapters` (`txtName`,`txtNick`,`txtAddress`,`txtEmail`,`txtDesc`,`txtCampus`,`txtCampusAddress`,`txtMapLink`,`txtMapEmbed`,`intAdvisorID`) VALUES 
	('Alumni','Alumni','','alumni@philambdaphi.org','Our alumni chapter was founded in 1969 with the founding of Lambda Chapter of Phi Lambda Chi.','','','https://lambdaalumniassociation.org/', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3047.837814976721!2d-92.59338738434865!3d40.19042267729548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87e80e70565092df%3A0x96ee9abfcd326099!2s610%20S%20Osteopathy%20Ave%2C%20Kirksville%2C%20MO%2063501!5e0!3m2!1sen!2sus!4v1679597365911!5m2!1sen!2sus',0),
	('Alpha','Alpha','610 S. Osteopathy Kirksville, MO','alpha@philambdaphi.org','Alpha chapter was founded on the campus of Truman State University by then brothers of Phi Lambda Chi in 2002. Alpha chapter is currently the only active chapter.','Truman State University','100 S. Normal Kirksville, MO','https://lambdaalumniassociation.org/', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3047.837814976721!2d-92.59338738434865!3d40.19042267729548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87e80e70565092df%3A0x96ee9abfcd326099!2s610%20S%20Osteopathy%20Ave%2C%20Kirksville%2C%20MO%2063501!5e0!3m2!1sen!2sus!4v1679597365911!5m2!1sen!2sus',0),
	('Beta','Beta','NA','beta@philambdaphi.org','Beta chapter was founded on the campus of Lindenwood University. Beta chapter is no longer affiliated with Phi Lambda Phi.','Lindenwood University','209 S Kingshighway St, St Charles, MO 63301','https://lambdaalumniassociation.org/', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3110.0292515693427!2d-90.50005212406855!3d38.78596377174805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87df2f19e20b6def%3A0x46b335b39c1db1b8!2sLindenwood%20University!5e0!3m2!1sen!2sus!4v1692682109964!5m2!1sen!2sus',0);
	
--
--	Sample data for table `tblEvents`
--

INSERT INTO `tblEvents` (`dtTimestamp`,`txtTitle`,`intOrganizer`,`intOrganization`,`txtLocation`,`txtDescription`,`txtShortDesc`) VALUES 
	('2023-07-20 8:00:00','Hello! Goodbye!',2,2,'Alpha House','Get together in Kirksville to say goodbye to graduating brothers, but hello to a new generation of alumni!','Hangout with brothers in Kirksivlle!'),
	('2023-07-27 16:00:00','Congratulations Mr. & Mrs. Barber!',2,1,'','Congratulations to Brother Colton and his new wife, Paula!','Congratulations to Brother Colton and his new wife, Paula!'),
	('2023-08-17 7:00:00','Truman Week 2023',2,2,'Alpha House','Gather together to welcome returning brothers as we kick off our fall semester.','Welcome Back!'),
	('2023-08-22 7:00:00','Start FA/23',2,2,'Alpha House','So begins the FA/23 semester!','So begins the FA/23 semester!')
;

--
-- Sample data for table `tblFAQ`
--

INSERT INTO `tblFAQ` (`txtQuery`,`txtResponse`,`txtShortResp`,`txtTags`) VALUES 
	("How do I join?","Join our fraternity by visiting our active chapter at Truman State University. Current and prospective students can inquire to join either at the FSL office in the SUB or by contacting <a href=\"mailto:recruitment@philamb.info\">recruitment@philamb.info</a>","",""),
	("Does Phi Lamb Haze?","No! Phi Lambda Phi (at the time, Chi) was one of the first fraternities on campus to outlaw hazing and the only fraternity on campus founded with the goal of eliminating hazing in our member's recruitment.","",""),
	("Why Phi Lamb?","As Phi Lambs we believe in putting our brotherhood, or namely our brothers, first.  We believe that by focusing on the well-being and scholastic success of our members we are better able to serve our members as well as our greater campus community. As a brother of Phi Lamb, you are immediately equal and will get a vote and voice in fraternity affairs.","",""),
	("Why join a fraternity in 2023?","While it's true that fratnerity and sorority life has seen a decline in numbers, especially at TSU, it's important to remember that collegiate men will always sought fraternal experiences. Brotherhood is a bond that transcends time and will always be a necessary part of any collegiate man's journey.","","")
;