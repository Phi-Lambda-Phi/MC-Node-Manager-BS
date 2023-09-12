--	setup.sql
--	MySQL Database setup for PhiLambdaPhi.org

--
--	Database: `prod`
--

--
--	Table structure for table `tblUsers`
--

CREATE TABLE `tblUsers` (
	`intId` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`txtGUID` varchar(36) NOT NULL DEFAULT (UUID()),
	`intRole` int DEFAULT 1,
	`txtDisplayName` text DEFAULT (''),
	`txtGivenName` text DEFAULT (''),
	`txtSurname` text DEFAULT (''),
	`txtBio` text DEFAULT (''),
	`txtEmail` text DEFAULT (''),
	`txtPrincipalName` text DEFAULT (''),
	`txtPhone` text DEFAULT (''),
	`txtStreetAddress` text DEFAULT (''),
	`txtCity` text DEFAULT (''),
	`txtState` text DEFAULT (''),
	`txtPostalCode` text DEFAULT (''),
	`txtJobTitle` text DEFAULT (''),
	`txtDepartment` text DEFAULT (''),
	`txtCompanyName` text DEFAULT (''),
	`intInDirectory` tinyint DEFAULT 2,		--	0/1/2/3 - Depending on how visible they want to appear. 0 for invisible, 1 for name, 2 +history, 3 +contact info
	`intChapter` int DEFAULT 2,				--	FK tblChapters.intChapterId | DEFAULT Alpha chapter
	`intOrder` int DEFAULT 0,				--	Value must be [0,4]
	`txtGradTerm` text DEFAULT ('SP'),		--	Value must be ['WI','SP','SU','FA']
	`intGradYear` int DEFAULT 2023,			--	Value must be > 1968
	`txtRecruitTerm` text DEFAULT ('FA'),	--	Value must be ['WI','SP','SU','FA']
	`intRecruitYear` int DEFAULT 1969,		--	Value must be > 1968
	`intBrotherBig` int DEFAULT NULL,		--	FK tblUsers.intId 
	`intBrotherLittle` int DEFAULT NULL, 	--		Foreign keys to build family tree
	`txtStatus` text DEFAULT ('Requested'),	--	Active / Archived
	`dtCreatedTime` datetime DEFAULT NULL
);

--
--	Table structure for table `tblChapters`
--

CREATE TABLE `tblChapters` (
	`intChapterId` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`txtGUID` varchar(36) NOT NULL DEFAULT (UUID()),
	`txtName` text DEFAULT (''),
	`txtNick` text DEFAULT (''),
	`txtAddress` text DEFAULT (''),
	`txtEmail` text DEFAULT (''),
	`txtDesc` text DEFAULT (''),
	`txtCampus` text DEFAULT (''),
	`txtCampusAddress` text DEFAULT (''),
	`txtMapLink` text DEFAULT (''),
	`txtMapEmbed` text DEFAULT (''),
	`intAdvisorId` int DEFAULT NULL			--	Advisor should be in roster, thus FK tblUsers.intId
);

--
--	Table structure for table `tblRoster`
--	Composite photos should be stored in a file structure that matches the roster data
--		/public/roster/${year}/${txtMembers.name}.jpg
--

CREATE TABLE `tblRoster` (
	`intRosterId` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`txtGUID` varchar(36) NOT NULL DEFAULT (UUID()),
	`intRosterYear` int NOT NULL,			--	Value must be > 1968
	`intChapter` int DEFAULT NULL,			--	FK tblChapters.intChapterId
	`intId` int DEFAULT NULL,				--	FK tblUsers.intId
	`txtTitle` text DEFAULT ('')
);

--
-- Table structure for table `tblEvents`
--

CREATE TABLE `tblEvents` (
	`intEventId` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`txtGUID` varchar(36) NOT NULL DEFAULT (UUID()),
	`dtTimestamp` datetime DEFAULT NULL,
	`txtTitle` text DEFAULT (''),
	`intOrganizer` int DEFAULT NULL,		-- FK tblUsers.intId
	`intOrganization` int DEFAULT NULL,		-- FK tblChapters.intChapterId
	`txtLocation` text DEFAULT (''),
	`txtDescription` text DEFAULT (''),
	`txtShortDesc` text DEFAULT (''),
	`txtTags` text DEFAULT ('')
);

--
-- Table structure for table `tblPhil`
--

CREATE TABLE `tblPhil` (
	`intPhilId` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`txtGUID` varchar(36) NOT NULL DEFAULT (UUID()),
	`txtName` text DEFAULT (''),
	`txtAddress` text DEFAULT (''),
	`txtPhone` text DEFAULT (''),
	`txtDescription` text DEFAULT (''),
	`txtShortDesc` text DEFAULT (''),
	`txtTags` text DEFAULT ('')
);

--
-- Table structure for table `tblFAQ`
--

CREATE TABLE `tblFAQ` (
	`intFAQId` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`txtGUID` varchar(36) NOT NULL DEFAULT (UUID()),
	`txtQuery` text DEFAULT (''),
	`txtResponse` text DEFAULT (''),
	`txtShortResp` text DEFAULT (''),
	`txtTags` text DEFAULT ('')
);

--
-- Table structure for table `tblPayments`
--

CREATE TABLE `tblPayments` (
	`intPaymentId` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`txtGUID` varchar(36) NOT NULL DEFAULT (UUID()),
	`intInvoiceId` int DEFAULT NULL,
	`dtTimestamp` datetime DEFAULT NULL,
	`txtDescription` text DEFAULT (''),
	`txtFormat` text DEFAULT (''),
	`txtTags` text DEFAULT (''),
	`decValue` decimal(20,2) DEFAULT NULL
);

--
-- Table structure for table `tblInvoices`
--

CREATE TABLE `tblInvoices` (
	`intInvoiceId` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`txtGUID` varchar(36) NOT NULL DEFAULT (UUID()),
	`dtTimestamp` datetime DEFAULT NULL,
	`dtDue` datetime DEFAULT NULL,
	`txtTitle` text DEFAULT (''),
	`txtDescription` text DEFAULT (''),
	`txtShortDesc` text DEFAULT (''),
	`txtTags` text DEFAULT (''),
	`status` text DEFAULT (''),
	`decValue` decimal(20,2) DEFAULT NULL
);

--
-- Table structure for table `tblHistory`
--

CREATE TABLE `tblHistory` (
	`intHistoryId` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`txtGUID` varchar(36) NOT NULL DEFAULT (UUID()),
	`intYear` int DEFAULT NULL,				--	Value must be > 1968
	`txtTitle` text DEFAULT (''),
	`txtDescription` text DEFAULT (''),
	`txtShortDesc` text DEFAULT (''),
	`txtTags` text DEFAULT NULL
);

--
-- Table structure for table `tblSQLHistory`
--

CREATE TABLE `tblSQLHistory` (
	`intSQLHistoryId` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`txtGUID` varchar(36) NOT NULL DEFAULT (UUID()),
	`dtTimestamp` datetime DEFAULT NULL,
	`txtSavedRecord` text DEFAULT (''),
	`txtUpdateTable` text DEFAULT (''),
	`intUpdateUserId` int DEFAULT NULL,
	`txtUpdateDisplay` text DEFAULT ('')
);

CREATE VIEW `viewUsers` AS
    SELECT tblUsers.*, txtName AS 'txtChapterName'
	FROM tblUsers 
	LEFT JOIN tblChapters ON tblUsers.intChapter = tblChapters.intChapterId;

CREATE VIEW `viewEvents` AS
    SELECT tblEvents.*, tblChapters.txtName AS 'txtChapterName', tblUsers.txtDisplayName AS 'txtDisplayName'
	FROM tblEvents 
	LEFT JOIN tblChapters ON tblEvents.intOrganization = tblChapters.intChapterId
	LEFT JOIN tblUsers ON tblEvents.intOrganizer = tblUsers.intId;

--
--	Table structure and initial values for table `tblEnv`
--

CREATE TABLE `tblEnv` (
	`intId` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`txtGUID` varchar(36) NOT NULL DEFAULT (UUID()),
	`txtKey` text DEFAULT (''),
	`txtValue` text DEFAULT (''),
	`txtType` text DEFAULT ('')
);

INSERT INTO `tblEnv` (`txtKey`, `txtValue`, `txtType`) VALUES
	("title","Phi Lambda Phi","text"),
	("subtitle","National Fraternity","text"),
	("uri","https://philambdaphi.org/","text"),
	("orders","[\"Default\",\"Neo-Phi\",\"Lambda\",\"Phi\",\"Alumni\"]","arr"),
	("inDirectory","[\"Invisible\",\"Name Only\",\"Name+Active Dates\",\"All Info\"]","arr"),
	("states","[\"AL\",\"AK\",\"AS\",\"AZ\",\"AR\",\"CA\",\"CO\",\"CT\",\"DE\",\"DC\",\"FM\",\"FL\",\"GA\",\"GU\",\"HI\",\"ID\",\"IL\",\"IN\",\"IA\",\"KS\",\"KY\",\"LA\",\"ME\",\"MH\",\"MD\",\"MA\",\"MI\",\"MN\",\"MS\",\"MO\",\"MT\",\"NE\",\"NV\",\"NH\",\"NJ\",\"NM\",\"NY\",\"NC\",\"ND\",\"MP\",\"OH\",\"OK\",\"OR\",\"PW\",\"PA\",\"PR\",\"RI\",\"SC\",\"SD\",\"TN\",\"TX\",\"UT\",\"VT\",\"VI\",\"VA\",\"WA\",\"WV\",\"WI\",\"WY\"]","arr"),
	("terms","[\"WI\",\"SP\",\"SU\",\"FA\"]","arr"),
	("roles","[\"System\",\"Standard\",\"Brother\",\"Executive\",\"Super\"]","arr"),
	("status","[\"System\",\"Inactive\",\"Requested\",\"Invited\",\"Active\"]","arr"),
	("forms","{\"intId\":{\"name\":\"intId\",\"format\":\"input\",\"type\":\"number\",\"label\":\"User Id\"},\"intRole\":{\"name\":\"intRole\",\"format\":\"select\",\"type\":\"select\",\"label\":\"Role\"},\"txtEmail\":{\"name\":\"txtEmail\",\"format\":\"input\",\"type\":\"text\",\"label\":\"E-Mail\"},\"intChapter\":{\"name\":\"intChapter\",\"format\":\"input\",\"type\":\"text\",\"label\":\"Chapter\"},\"txtChapterName\":{\"name\":\"txtChapterName\",\"format\":\"input\",\"type\":\"text\",\"label\":\"Chapter\"},\"intOrder\":{\"name\":\"intOrder\",\"format\":\"input\",\"type\":\"text\",\"label\":\"Order\"},\"intRecruitYear\":{\"name\":\"intRecruitYear\",\"format\":\"input\",\"type\":\"text\",\"label\":\"R. Year\"},\"txtRecruitTerm\":{\"name\":\"txtRecruitTerm\",\"format\":\"select\",\"type\":\"select\",\"label\":\"R. Term\"},\"intGradYear\":{\"name\":\"intGradYear\",\"format\":\"input\",\"type\":\"text\",\"label\":\"A. Year\"},\"txtGradTerm\":{\"name\":\"txtGradTerm\",\"format\":\"select\",\"type\":\"select\",\"label\":\"A. Term\"},\"txtDisplayName\":{\"name\":\"txtDisplayName\",\"format\":\"input\",\"type\":\"text\",\"label\":\"Display Name\"},\"txtShortDesc\":{\"name\":\"txtShortDesc\",\"format\":\"input\",\"type\":\"text\",\"label\":\"Description\"},\"intOrganizer\":{\"name\":\"intOrganizer\",\"format\":\"input\",\"type\":\"number\",\"label\":\"Organizer\"},\"intOrganization\":{\"name\":\"intOrganization\",\"format\":\"input\",\"type\":\"number\",\"label\":\"Chapter\"},\"txtTitle\":{\"name\":\"txtTitle\",\"format\":\"input\",\"type\":\"text\",\"label\":\"Title\"},\"txtStatus\":{\"name\":\"txtStatus\",\"format\":\"input\",\"type\":\"text\",\"label\":\"Status\"}}","obj");
	
--	,\"\":{\"name\":\"\",\"format\":\"input\",\"type\":\"text\",\"label\":\"\"}