-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 10, 2016 at 11:51 PM
-- Server version: 10.1.9-MariaDB
-- PHP Version: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dit`
--

-- --------------------------------------------------------

--
-- Table structure for table `answers`
--

CREATE TABLE `answers` (
  `id` int(11) NOT NULL,
  `session_id` varchar(50) NOT NULL,
  `question` varchar(50) NOT NULL,
  `answer` varchar(50) NOT NULL,
  `datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `answers`
--

INSERT INTO `answers` (`id`, `session_id`, `question`, `answer`, `datetime`) VALUES
(1, '', 'Q1', 'Y1', '0000-00-00 00:00:00'),
(2, '', 'Q2', '18-22', '0000-00-00 00:00:00'),
(3, '', 'Q1', 'Y5', '0000-00-00 00:00:00'),
(4, '', 'Q2', '48-52', '0000-00-00 00:00:00'),
(5, '', 'Q1', 'Y5', '0000-00-00 00:00:00'),
(6, '', 'Q2', '38-42', '0000-00-00 00:00:00'),
(7, '', 'Q1', 'Y2', '0000-00-00 00:00:00'),
(8, '', 'Q2', '23-27', '0000-00-00 00:00:00'),
(9, '', 'Q1', 'Y1', '0000-00-00 00:00:00'),
(10, '', 'Q2', '48-52', '0000-00-00 00:00:00'),
(11, '', 'Q1', 'Y4', '2016-03-29 00:00:00'),
(12, '', 'Q2', '38-42', '2016-03-29 00:00:00'),
(13, '1m646ji6k1i3aglphshm5d7uh1', 'Q1', 'Y1', '2016-03-29 00:00:00'),
(14, '1m646ji6k1i3aglphshm5d7uh1', 'Q2', '18-22', '2016-03-29 00:00:00'),
(15, '1m646ji6k1i3aglphshm5d7uh1', 'Q1', 'Y2', '2016-03-29 01:25:40'),
(16, '1m646ji6k1i3aglphshm5d7uh1', 'Q2', '18-22', '2016-03-29 01:25:40');

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `docid` int(11) NOT NULL,
  `title` varchar(250) NOT NULL,
  `contributor` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`docid`, `title`, `contributor`) VALUES
(1, 'Internet Marketing and Sales Strategies', 'Cates'),
(2, 'Option Theory', 'James'),
(3, 'Simple Rules of Risk : Revisiting the Art of Financial Risk Management', 'Banks'),
(4, 'Quantitative Methods in Derivatives Pricing', 'Tavella'),
(5, 'Financial Statement Analysis : A Practitioner''s Guide', 'Alvarez'),
(6, 'Kellogg on Marketing', 'Kotler'),
(7, 'Risk Management Process : Business Strategy and Tactics', 'Culp'),
(8, 'Global Asset Allocation', 'Oertmann'),
(9, 'Wharton on Making Decisions', 'Hoch'),
(10, 'Real Options Solution : Finding Total Value in a High-Risk World', 'Boer'),
(11, 'Salomon Smith Barney Guide to Mortgage-Backed and Asset-Backed Securities', 'Hayre'),
(12, 'Book of Risk', 'Borge'),
(13, 'Credit Risk Measurement : New Approaches to Value at Risk and Other Paradigms', 'Allen'),
(14, 'Fixed Income Securities  : Tools for Today''s Markets Ed. 2', 'Tuckman'),
(15, 'Six Sigma Revolution : How General Electric and Others Turned Process into Profits', 'Eckes'),
(16, 'Valuation of Companies in Emerging Markets : A Practical Approach', 'Pereiro'),
(17, 'Handbook of Financial Instruments', 'Fabozzi'),
(18, 'Project Marketing : Beyond Competitive Bidding', 'Ghauri'),
(19, 'Ownership and Value Creation : Strategic Corporate Governance in the New Economy', 'Carlsson'),
(20, 'Implementing Derivatives Models', 'Strickland'),
(21, 'Fisherman and the Rhinoceros : How International Finance Shapes Everyday Life', 'Briys'),
(22, 'Managerial Accounting', 'Jiambalvo'),
(23, 'Prime Movers : Define Your Business or Have Someone Define It Against You', 'Wallin'),
(24, 'Understanding Marketing : A European Casebook', 'Phillips'),
(25, 'Pricing Convertible Bonds', 'Connolly'),
(26, 'Monte Carlo Methods in Finance', 'Jaeckel'),
(27, 'Accelerating International Growth', 'Gilbert'),
(28, 'Insurance : From Underwriting to Derivatives', 'de Varenne'),
(29, 'Introduction to Econometrics', 'Maddala'),
(30, 'International Marketing Research : Concepts and Methods', 'Douglas'),
(31, 'Paul Wilmott on Quantitative Finance Volume 1', 'Wilmott'),
(32, 'Risk Management and Analysis Volume 2 : New Markets and Products', 'Alexander'),
(33, 'Risk Management in Banking', 'Bessis'),
(34, 'CultureShock! Bolivia Ed. 3', 'Cramer'),
(35, 'Buying Business Services', 'Wynstra'),
(36, 'Strategic Flexibility : Managing in a Turbulent Environment', 'O''Neal'),
(37, 'Paul Wilmott on Quantitative Finance Volume 2', 'Wilmott'),
(38, 'Risk Management and Analysis Volume 1 : Measuring and Modeling Financial Risk', 'Alexander'),
(39, 'Advanced Modelling in Finance Using Excel and VBA', 'Staunton'),
(40, 'Value-Based Management : Context and Application', 'Davies'),
(41, 'Trust & Betrayal in the Workplace  : Building Effective Relationships in Your Organization Ed. 2', 'Reina'),
(42, 'International Economics : Global Markets and International Competition', 'Thompson'),
(43, 'Lectures on Corporate Finance', 'Oedegaard'),
(44, 'All Together Now : Common Sense for a Fair Economy', 'Bernstein'),
(45, 'Small-Mart Revolution : How Local Businesses Are Beating The Global Competition', 'Shuman'),
(46, 'Developing Business Strategies', 'Aaker'),
(47, 'Environmental Economics for Non-Economists', 'Asafu-Adjaye'),
(48, 'Capable Company', 'Diezemann'),
(49, 'The Geography of the Internet Industry', 'Zook'),
(50, 'Multinational Financial Management', 'Shapiro'),
(51, 'Loan Workouts and Debt for Equity Swaps : A Framework for Successful Corporate Rescues', 'Hedges'),
(52, 'Mergers and Acquisitions : Creating Integrative Knowledge', 'Javidan'),
(53, 'Making Scorecards Actionable : Balancing Strategy and Control', 'Olve'),
(54, 'Enterprise Risk Management : From Incentives to Controls', 'Lam'),
(55, 'Accounting Reference Desktop', 'Bragg'),
(56, 'Private Equity', 'Bierman'),
(57, 'True to Our Roots', 'Dolan'),
(58, 'Risk Budgeting : Portfolio Problem Solving with Value-at-Risk', 'Pearson'),
(59, 'Investing in REITs  : Revised and Updated Edition Ed. 2', 'Block'),
(60, 'Leap to Globalization : Creating New Value for Business Without Borders', 'Gomez'),
(61, 'Brands : Visions and Values', 'Callow'),
(62, 'Accounting  : Theory and Analysis Ed. 7', 'Clark'),
(63, 'Future of Leadership : Today''s Top Leadership Thinkers Speak to Tomorrow''s Leaders', 'Spreitzer'),
(64, 'Strategic Market Management', 'Aaker'),
(65, 'Quest for Global Dominance : Transforming Global Presence into Global Competitive Advantage', 'Gupta'),
(66, 'Management Consulting : A Complete Guide to the Industry', 'Twitchell'),
(67, 'Hedge Funds : Myths and Limits', 'L''habitant'),
(68, 'Leadership Challenge : How to Keep Getting Extraordinary Things Done in Organizations', 'Posner'),
(69, 'Foundations of Multinational Financial Management', 'Shapiro'),
(70, 'Delivering the Goods : The Art of Managing Your Supply Chain', 'Sander'),
(71, 'Hospitality Marketing Management', 'Bojanic'),
(72, 'Microeconomics : An Integrated Approach', 'Braeutigam'),
(73, 'CultureShock! Bulgaria Ed. 2', 'Sachsenroeder'),
(74, 'Essentials of Marketing Research', 'Aaker'),
(75, 'Handbook of Alternative Assets', 'Chen'),
(76, 'Communities of Practice - APQC''s Passport to Success Series : A Guide for Your Journey to Knowledge Management Best Practices', 'Hubert'),
(77, 'Managing Marketing Assets for Sustained Returns', 'American Productivity & Quality Center'),
(78, 'Balanced Scorecard Step-by-Step : Maximizing Performance and Maintaining Results', 'Niven'),
(79, 'Competitive and Business Intelligence : Leveraging Information for Action', 'American Productivity & Quality Center'),
(80, 'Management Ed. 7', 'Schermerhorn'),
(81, 'Collateralized Debt Obligations : Structures and Analysis', 'Fabozzi'),
(82, 'Corporate Aftershock : The Public Policy Lessons from the Collapse of Enron and Other Major Corporations', 'Niskanen'),
(83, 'Kellogg on Technology and Innovation', 'Sawhney'),
(84, 'User-Driven Competitive Intelligence : Crafting the Value Proposition', 'American Productivity & Quality Center'),
(85, 'Managing Content and Knowledge', 'American Productivity & Quality Center'),
(86, 'Wharton on Managing Emerging Technologies', 'Schoemaker'),
(87, 'Equity Risk Premium : The Long Run Future of the Stock Market', 'Cornell'),
(88, 'Pompeii : The Life of a Roman Town', 'Beard'),
(89, 'Catching Fire: How Cooking Made Us Human', 'Wrangham');

-- --------------------------------------------------------

--
-- Table structure for table `shelves`
--

CREATE TABLE `shelves` (
  `shelfid` int(11) NOT NULL,
  `shelf` varchar(250) NOT NULL,
  `docid` int(11) NOT NULL,
  `userid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `shelves`
--

INSERT INTO `shelves` (`shelfid`, `shelf`, `docid`, `userid`) VALUES
(1, 'Clement Shelf', 1, 1),
(2, 'Clement Shelf', 2, 1),
(3, 'Clement Shelf', 3, 1),
(4, 'Clement Shelf', 4, 1),
(5, 'Clement Shelf', 5, 1),
(6, 'Clement Shelf', 6, 1),
(7, 'Clement Shelf', 7, 1),
(8, 'Clement Shelf', 8, 1),
(9, 'Clement Shelf', 9, 1),
(10, 'Clement Shelf', 10, 1),
(11, 'Peter Super Shelf', 30, 2),
(12, 'Peter Super Shelf', 31, 2),
(13, 'Peter Super Shelf', 32, 2),
(14, 'Peter Super Shelf', 33, 2),
(15, 'Peter Super Shelf', 34, 2),
(16, 'Peter Super Shelf', 35, 2),
(17, 'Peter Super Shelf', 36, 2),
(18, 'Peter Super Shelf', 37, 2),
(19, 'Peter Super Shelf', 38, 2),
(20, 'Peter Super Shelf', 39, 2),
(21, 'Peter Super Shelf', 40, 2),
(22, 'Peter Super Shelf', 41, 2),
(23, 'Peter Super Shelf', 42, 2),
(24, 'Peter Super Shelf', 43, 2),
(25, 'Peter Super Shelf', 44, 2),
(26, 'Peter Super Shelf', 45, 2),
(27, 'Peter Super Shelf', 46, 2),
(28, 'Peter Super Shelf', 47, 2),
(29, 'Peter Super Shelf', 48, 2),
(30, 'Peter Super Shelf', 49, 2),
(31, 'Peter Super Shelf', 50, 2),
(32, 'Peter Super Shelf', 51, 2),
(33, 'Robert Books', 6, 3),
(34, 'Robert Books', 7, 3),
(35, 'Robert Books', 8, 3),
(36, 'Robert Books', 9, 3),
(37, 'Robert Books', 10, 3),
(38, 'Robert Books', 11, 3),
(39, 'Robert Books', 12, 3),
(40, 'Robert Books', 13, 3),
(41, 'Robert Books', 14, 3),
(42, 'Robert Books', 15, 3),
(43, 'Robert Books', 16, 3),
(44, 'Robert Books', 17, 3),
(45, 'Tom''s Bookshelf', 25, 4),
(46, 'Tom''s Bookshelf', 26, 4),
(47, 'Tom''s Bookshelf', 27, 4),
(48, 'Tom''s Bookshelf', 28, 4),
(49, 'Tom''s Bookshelf', 29, 4),
(50, 'Tom''s Bookshelf', 30, 4),
(51, 'Tom''s Bookshelf', 31, 4),
(52, 'Tom''s Bookshelf', 32, 4),
(53, 'Clement Shelf', 50, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userid` int(11) NOT NULL,
  `name` varchar(25) NOT NULL,
  `surname` varchar(25) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userid`, `name`, `surname`, `email`, `password`) VALUES
(1, 'Clement', 'Adler', 'Clement.Adler@dit.ie', '1234'),
(2, 'Peter', 'Frank', 'Peter.Frank@dit.ie', '5678'),
(3, 'Robert', 'Pieper ', 'Robert.Pieper @dit.ie', '9101'),
(4, 'Thomas', 'Galico', 'Thomas.Galico@dit.ie', '1213');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`docid`);

--
-- Indexes for table `shelves`
--
ALTER TABLE `shelves`
  ADD PRIMARY KEY (`shelfid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `docid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;
--
-- AUTO_INCREMENT for table `shelves`
--
ALTER TABLE `shelves`
  MODIFY `shelfid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
