-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 06, 2025 at 06:27 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `youtube_clone`
--

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `id` bigint(20) NOT NULL,
  `channel_title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `duration` bigint(20) DEFAULT NULL,
  `first_viewed_at` datetime(6) DEFAULT NULL,
  `last_viewed_at` datetime(6) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `video_id` varchar(255) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`id`, `channel_title`, `description`, `duration`, `first_viewed_at`, `last_viewed_at`, `thumbnail_url`, `title`, `video_id`, `user_id`) VALUES
(3, 'Sơn Tùng M-TP Official', 'Hãy cùng thưởng thức ca khúc ĐỪNG LÀM TRÁI TIM ANH ĐAU ngay tại đây nhé: 👉🏻 👉🏻 👉🏻  https://vivienm.lnk.to/DLTTAD 💍❤️‍🩹🧩\n\n#DLTTAD #SonTungMTP #DungLamTraiTimAnhDau \n\n🚫🤲🏻♥️🙆🏻‍♂️😢\n\n▶ More information about Sơn Tùng M-TP: \nhttps://www.facebook.com/MTP.Fan\nhttps://www.instagram.com/sontungmtp\nhttps://www.youtube.com/sontungmtp\nhttps://www.tiktok.com/@tiger050794 \nhttps://twitter.com/sontungmtp777\n@Spotify: https://spoti.fi/2HPWs20\n@Itunes: https://apple.co/2rlSl3w\n\n▶More information about M-TP Talent:\nhttps://www.facebook.com/mtptalent\nhttps://www.instagram.com/mtptalent\nhttps://twitter.com/mtptalent\n\n▶ More about M-TP ENTERTAINMENT\nhttps://www.facebook.com/mtptown\nhttps://mtpentertainment.com \nhttps://twitter.com/mtpent_official\nhttps://www.instagram.com/mtpent_official\n\n▶ CLICK TO SUBSCRIBE:  http://popsww.com/sontungmtp\n#sontungmtp #sontung #mtp #mtpentertainment', 326, '2025-05-04 13:13:09.000000', '2025-05-05 15:44:24.000000', 'https://i.ytimg.com/vi/abPmZCZZrFA/hqdefault.jpg', 'SƠN TÙNG M-TP | ĐỪNG LÀM TRÁI TIM ANH ĐAU | OFFICIAL MUSIC VIDEO', 'abPmZCZZrFA', 1),
(4, 'VTV24', 'Lễ diễu binh, diễu hành kỷ niệm 50 năm Ngày Giải phóng miền Nam, thống nhất đất nước (30/4/1975 - 30/4/2025) trở thành khoảnh khắc lịch sử đáng nhớ với hình ảnh hào hùng của các khối Quân đội Nhân dân Việt Nam. Những bước chân đều tăm tắp, dứt khoát thể hiện bản lĩnh, kỷ luật và lòng trung thành son sắt với Tổ quốc.\n--------------\n\"Nối Vòng Tay Lớn\" – chiến dịch do VTV Digital thực hiện trên các nền tảng số của VTV24, hướng tới kỷ niệm 50 năm ngày Giải phóng miền Nam, thống nhất đất nước.\n#NoiVongTayLon #50nam30thang4cungVTV #A50\n----------\nĐồng hành cùng VTV Digital tại:\n\nỨng dụng VTVgo\nAndroid: https://bit.ly/305aQLs\niOS: https://apple.co/3g8yMTS\nhoặc xem trực tiếp trên https://vtvgo.vn/\n\nBáo điện tử: https://VTV.vn\n\nFanpage:\nTin tức, Xã hội: https://fb.com/tintucvtv24\nChuyên trang Tài Chính: https://fb.com/VTVMoney\nBáo điện tử VTV: https://fb.com/baodientuvtv\n\nYoutube: https://youtube.com/vtv24\nZalo: https://zalo.me/1571891271885013375\nInstagram: htt', 1035, '2025-05-05 10:14:31.000000', '2025-05-05 10:14:31.000000', 'https://i.ytimg.com/vi/SxWzyf4taho/hqdefault.jpg', 'Lễ diễu binh, diễu hành 30/4: Quân đội Nhân dân Việt Nam - Những bước chân hào hùng  | VTV24', 'SxWzyf4taho', 1),
(5, 'RHYDER OFFICIAL', 'RHYDER, Dương Domic, Pháp Kiều - HÀO QUANG I OFFICIAL LYRICS VIDEO\n#rhyder #anhtraisayhi #anhtrai #duongdomic #phapkieu \n\nXem Full tập 5 Anh Trai Say Hi tại: https://bit.ly/4bSLUbB\n\nFollow kênh phát sóng Video Performance: \nhttp://www.youtube.com/@UC2fu6CiFfNYz5UFORvFyc0w \n\nSong Credits:\nHào Quang\nTác giả: BAOVU\nLời viết mới: RHYDER\nLời rap mới: Pháp Kiều\nProducer: DARRYS. x Trần Việt Hoàng\nTrình diễn: RHDYER, Dương Domic, Pháp Kiều\nBiên đạo: Lan Nhi\nVũ đoàn: Bước Nhảy\n-----------------------\nMore about RHYDER:\n- Facebook: https://www.facebook.com/quanganhrhyder\n- Instagram: https://www.instagram.com/rhyder.dgh/\n\nContact:\n- Email: mai.pr.nguyen@gmail.com (PR Manager)\n\n© Bản quyền thuộc về RHYDER\n© Copyright by RHYDER  ☞ Do not reup', 243, '2025-05-05 12:38:10.000000', '2025-05-05 12:38:16.000000', 'https://i.ytimg.com/vi/EKgvDwdoLYs/hqdefault.jpg', 'RHYDER, Dương Domic, Pháp Kiều - HÀO QUANG I OFFICIAL LYRICS VIDEO', 'EKgvDwdoLYs', 1),
(6, 'Ô Kìa Hiệp', 'Xin chào các bạn, nếu thích thì share và subscribe cho mình để xem nhiều video mới hơn nhé!!!! \r\n\r\n--------------------\r\nNgoài ra thì tớ hoạt động chủ yếu trên Facebook nha :3\r\n► Fanpage: http://fb.com/hiepdo95\r\n► Instagram: http://instagram.com/hiep.fanxychild\r\n► Facebook: http://fb.com/okiahiep\r\n--------------------\r\nLiên hệ quảng cáo viral :\r\nEmail: jihyoholic@gmail.com.\r\nTrực tiếp qua fb cá nhân.\r\n---------------------\r\n© Bản quyền thuộc về HiepDo', 59, '2025-05-05 12:38:20.000000', '2025-05-05 12:38:20.000000', 'https://i.ytimg.com/vi/AEXc8qIu47s/hqdefault.jpg', 'trường học bờ rên rốt tập 2 #shorts', 'AEXc8qIu47s', 1),
(7, 'Sơn Tùng M-TP Official', 'SON TUNG M-TP - \"HÃY TRAO CHO ANH\" | GIVE IT TO ME\nM-TP ENTERTAINMENT\n\nAvailable on Nhaccuatui: @http://nhaccuatui.com/sontungmtp/haytraochoanh\nAvailable on Spotify: @https://spoti.fi/2YodgS6\nAvailable on iTunes: @https://apple.co/2xknmaI\n\nExecutive Producer: Nguyen Thanh Tung \nComposer: Son Tung M-TP \nMusic Producer: ONIONN\nArtist: Son Tung M-TP\nFeaturing with: Snoop Dogg (Snoop Dogg appears courtesy of Doggy Style Records)\nMain Actress: Madison Beer\nProject Producer: M&M House\n\nProject management: Chau LE\nMarketing Director: Henry Nguyen\nPR Executive: Nhat Duy\nTalent Manager: Tran Song Hanh Nhan\n\nPRODUCTION TEAM\nMusic Video Production: August Frogs \nDirector: Korlio\nProducer: Sunok Hong\nLocal Producer: Christopher Lee\nAssistant Director: Kyuho Sung\nCGI: Jiun Kim\nPhotographer: Jiun Kim\nPoster Designer: Jiun Kim\nStylist: Hary Hong\nHair Stylist: Hyunwoo Lee\nMakeup: Eunyeong Baek\nChoreographer: Luana Simpson Fowler\nDancer: Geovane Fidelis\n\nSPECIAL THANKS TO\nArtist Agency (Project Execute', 263, '2025-05-05 15:44:26.000000', '2025-05-05 15:47:26.000000', 'https://i.ytimg.com/vi/knW7-x7Y7RE/hqdefault.jpg', 'SƠN TÙNG M-TP | HÃY TRAO CHO ANH ft. Snoop Dogg | Official MV', 'knW7-x7Y7RE', 1);

-- --------------------------------------------------------

--
-- Table structure for table `liked_videos`
--

CREATE TABLE `liked_videos` (
  `id` bigint(20) NOT NULL,
  `channel_title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `liked_at` datetime(6) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `video_id` varchar(255) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `liked_videos`
--

INSERT INTO `liked_videos` (`id`, `channel_title`, `description`, `liked_at`, `thumbnail_url`, `title`, `video_id`, `user_id`) VALUES
(4, 'COOLKID OFFICIAL', 'Sau Cơn Mưa - Coolkidnevasleep ft. Rhyder\n\nLyrics: \nCOOLKID:\nNhìn em đẹp hơn khi… nở nụ cười trên môi\nNhưng chỉ toàn u buồn, khi người ở bên tôi\nEm tìm 1 ai khác… em cần 1 vòng tay khác\nMột chàng trai khác khiến em vui hơn là anh\nVà rồi hàng triệu khúc mắc chỉ vỏn vẹn vài tíc tắc\nvà anh đã hiểu rằng…\nOh my girl e giấu nhiều điều nhưng chẳng phải là anh không biết đâu\nChỉ là trước khi rời đi lòng anh muốn nói… vài lời\n\nHook:\nĐừng để ai khiến em khóc thật nhiều như anh đã từng thế\nĐằng sau cơn mưa sẽ có cầu vồng cùng em trên lối về\nAnh chỉ cười thế thôi, ghì chặt khoé môi\nVì biết câu chuyện giờ cũng đã rồi\nNhững mẩu chuyện xé đôi \nKỷ niệm ghé chơi\nGiờ này 2 đứa 2 nơi\n\nRHYDER:\nNếu muốn khóc cứ để nước mắt rơi hết đi\nAnh không muốn phải thấy em bên đấy sẽ ướt mi thêm vì\nEm đã cố giấu bao nỗi đau\nDo anh đã cố chấp nên giờ đành phải lạc nhau\nChỉ một vài lời nói\nVô tình khiến em đau\nMặt trời không thể thắng được khi cơn giông dần đi tới\nEm cần một người mới\nMột người tốt hơn anh\nCả bầu trời c', '2025-04-28 03:34:23.000000', 'https://i.ytimg.com/vi/iFoLKvdqXk8/hqdefault.jpg', 'COOLKID - SAU CƠN MƯA (ft. RHYDER)', 'iFoLKvdqXk8', 1),
(5, 'Sơn Tùng M-TP Official', 'SON TUNG M-TP - \"HÃY TRAO CHO ANH\" | GIVE IT TO ME\nM-TP ENTERTAINMENT\n\nAvailable on Nhaccuatui: @http://nhaccuatui.com/sontungmtp/haytraochoanh\nAvailable on Spotify: @https://spoti.fi/2YodgS6\nAvailable on iTunes: @https://apple.co/2xknmaI\n\nExecutive Producer: Nguyen Thanh Tung \nComposer: Son Tung M-TP \nMusic Producer: ONIONN\nArtist: Son Tung M-TP\nFeaturing with: Snoop Dogg (Snoop Dogg appears courtesy of Doggy Style Records)\nMain Actress: Madison Beer\nProject Producer: M&M House\n\nProject management: Chau LE\nMarketing Director: Henry Nguyen\nPR Executive: Nhat Duy\nTalent Manager: Tran Song Hanh Nhan\n\nPRODUCTION TEAM\nMusic Video Production: August Frogs \nDirector: Korlio\nProducer: Sunok Hong\nLocal Producer: Christopher Lee\nAssistant Director: Kyuho Sung\nCGI: Jiun Kim\nPhotographer: Jiun Kim\nPoster Designer: Jiun Kim\nStylist: Hary Hong\nHair Stylist: Hyunwoo Lee\nMakeup: Eunyeong Baek\nChoreographer: Luana Simpson Fowler\nDancer: Geovane Fidelis\n\nSPECIAL THANKS TO\nArtist Agency (Project Execute', '2025-04-28 03:43:09.000000', 'https://i.ytimg.com/vi/knW7-x7Y7RE/hqdefault.jpg', 'SƠN TÙNG M-TP | HÃY TRAO CHO ANH ft. Snoop Dogg | Official MV', 'knW7-x7Y7RE', 2),
(6, 'Sơn Tùng M-TP Official', 'Hãy cùng thưởng thức ca khúc ĐỪNG LÀM TRÁI TIM ANH ĐAU ngay tại đây nhé: 👉🏻 👉🏻 👉🏻  https://vivienm.lnk.to/DLTTAD 💍❤️‍🩹🧩\n\n#DLTTAD #SonTungMTP #DungLamTraiTimAnhDau \n\n🚫🤲🏻♥️🙆🏻‍♂️😢\n\n▶ More information about Sơn Tùng M-TP: \nhttps://www.facebook.com/MTP.Fan\nhttps://www.instagram.com/sontungmtp\nhttps://www.youtube.com/sontungmtp\nhttps://www.tiktok.com/@tiger050794 \nhttps://twitter.com/sontungmtp777\n@Spotify: https://spoti.fi/2HPWs20\n@Itunes: https://apple.co/2rlSl3w\n\n▶More information about M-TP Talent:\nhttps://www.facebook.com/mtptalent\nhttps://www.instagram.com/mtptalent\nhttps://twitter.com/mtptalent\n\n▶ More about M-TP ENTERTAINMENT\nhttps://www.facebook.com/mtptown\nhttps://mtpentertainment.com \nhttps://twitter.com/mtpent_official\nhttps://www.instagram.com/mtpent_official\n\n▶ CLICK TO SUBSCRIBE:  http://popsww.com/sontungmtp\n#sontungmtp #sontung #mtp #mtpentertainment', '2025-05-04 12:25:09.000000', 'https://i.ytimg.com/vi/abPmZCZZrFA/hqdefault.jpg', 'SƠN TÙNG M-TP | ĐỪNG LÀM TRÁI TIM ANH ĐAU | OFFICIAL MUSIC VIDEO', 'abPmZCZZrFA', 1),
(7, 'Sơn Tùng M-TP Official', 'SON TUNG M-TP - \"HÃY TRAO CHO ANH\" | GIVE IT TO ME\nM-TP ENTERTAINMENT\n\nAvailable on Nhaccuatui: @http://nhaccuatui.com/sontungmtp/haytraochoanh\nAvailable on Spotify: @https://spoti.fi/2YodgS6\nAvailable on iTunes: @https://apple.co/2xknmaI\n\nExecutive Producer: Nguyen Thanh Tung \nComposer: Son Tung M-TP \nMusic Producer: ONIONN\nArtist: Son Tung M-TP\nFeaturing with: Snoop Dogg (Snoop Dogg appears courtesy of Doggy Style Records)\nMain Actress: Madison Beer\nProject Producer: M&M House\n\nProject management: Chau LE\nMarketing Director: Henry Nguyen\nPR Executive: Nhat Duy\nTalent Manager: Tran Song Hanh Nhan\n\nPRODUCTION TEAM\nMusic Video Production: August Frogs \nDirector: Korlio\nProducer: Sunok Hong\nLocal Producer: Christopher Lee\nAssistant Director: Kyuho Sung\nCGI: Jiun Kim\nPhotographer: Jiun Kim\nPoster Designer: Jiun Kim\nStylist: Hary Hong\nHair Stylist: Hyunwoo Lee\nMakeup: Eunyeong Baek\nChoreographer: Luana Simpson Fowler\nDancer: Geovane Fidelis\n\nSPECIAL THANKS TO\nArtist Agency (Project Execute', '2025-05-05 15:45:26.000000', 'https://i.ytimg.com/vi/knW7-x7Y7RE/hqdefault.jpg', 'SƠN TÙNG M-TP | HÃY TRAO CHO ANH ft. Snoop Dogg | Official MV', 'knW7-x7Y7RE', 1);

-- --------------------------------------------------------

--
-- Table structure for table `playlists`
--

CREATE TABLE `playlists` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `privacy` varchar(255) NOT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `video_count` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `playlist_items`
--

CREATE TABLE `playlist_items` (
  `id` bigint(20) NOT NULL,
  `added_at` datetime(6) DEFAULT NULL,
  `channel_title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `duration` bigint(20) DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `video_id` varchar(255) NOT NULL,
  `playlist_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` enum('ROLE_USER','ROLE_MODERATOR','ROLE_ADMIN') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'ROLE_USER'),
(2, 'ROLE_MODERATOR'),
(3, 'ROLE_ADMIN');

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` bigint(20) NOT NULL,
  `channel_id` varchar(255) NOT NULL,
  `channel_thumbnail_url` varchar(255) DEFAULT NULL,
  `channel_title` varchar(255) DEFAULT NULL,
  `subscribed_at` datetime(6) DEFAULT NULL,
  `subscriber_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `channel_id`, `channel_thumbnail_url`, `channel_title`, `subscribed_at`, `subscriber_id`) VALUES
(5, 'UCPjbFSSZXI7ERLRt3O0CGBQ', 'https://yt3.ggpht.com/SMKD2tv1VsFRdJ-ACEWZGusz5QP_3Zsv8c7-iJH2JVSSnQL_BGqSiapbAewEm6vWOuujnjzqtg=s240-c-k-c0xffffffff-no-rj-mo', 'RHYDER OFFICIAL', '2025-05-04 04:03:52.000000', 1),
(6, 'UClyA28-01x4z60eWQ2kiNbA', 'https://yt3.ggpht.com/c-Z7mIlntSpG6VyQ5ZqaPggqkZRhaySr-H5ZEazFN2iR1pP4eD1UGekwu0y--c4CSVhJJ1A4QT8=s88-c-k-c0x00ffffff-no-rj', 'Sơn Tùng M-TP Official', '2025-05-05 15:45:21.000000', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `channel_description` varchar(1000) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(120) DEFAULT NULL,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `subscriber_count` bigint(20) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `username` varchar(20) DEFAULT NULL,
  `verified` bit(1) NOT NULL,
  `youtube_channel_id` varchar(255) DEFAULT NULL,
  `banner_image_url` varchar(255) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `channel_description`, `created_at`, `email`, `password`, `profile_image_url`, `subscriber_count`, `updated_at`, `username`, `verified`, `youtube_channel_id`, `banner_image_url`, `location`, `website`) VALUES
(1, 'đây là kênh của Bùi Hữu Danh', '2025-04-28 02:37:07.000000', 'danh@gmail.com', '$2a$10$y34jf/BgKvi745t//TCqSON/jFnYxkUVBI4OS28BgZryy343jwyAe', '/api/users/1/avatar?v=1746450862095', 517, '2025-05-05 15:02:18.000000', 'huudanh', b'0', NULL, '/api/users/1/banner?v=1746450862135', 'Vietnam', 'facebook.com/tieuyeuquaii'),
(2, NULL, '2025-04-28 03:36:35.000000', 'khiem@gmail.com', '$2a$10$SZ98WYQk98PrbWFTAFGFi.FEldKNQr9uvZlR4Wm3fXNubCUmj2tbO', NULL, 0, '2025-04-28 03:36:35.000000', 'nhatkhiem', b'0', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` bigint(20) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(1, 1),
(2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `duration` bigint(20) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_size` bigint(20) NOT NULL,
  `like_count` int(11) NOT NULL,
  `privacy` varchar(255) NOT NULL,
  `processing_status` varchar(255) DEFAULT NULL,
  `published` bit(1) NOT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `video_id` varchar(255) NOT NULL,
  `view_count` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id`, `created_at`, `description`, `duration`, `file_path`, `file_size`, `like_count`, `privacy`, `processing_status`, `published`, `thumbnail_url`, `title`, `updated_at`, `video_id`, `view_count`, `user_id`) VALUES
(2, '2025-05-05 05:55:40.000000', '► Đăng ký kênh CGV Cinemas để xem trailers phim mới nhất tại: http://bit.ly/subscribeCGV\nXem thêm thông tin tại: \nWebsite CGV: https://www.cgv.vn/\nFanpage Facebook:   / cgvcinemavietnam  \nInstagram:   / cgvcinemasvietnam  \nZalo: https://zalo.me/1884424922722396289', 155, '84e98eb4-5276-4aec-b0e7-2c2189bb6069.mp4', 10841932, 0, 'public', 'complete', b'1', '4adecc71-6285-4451-9a9b-85194123edc9.jpg', 'YOLO THE MOVIE - BẠN CHỈ SỐNG MỘT LẦN _ OFFICIAL TRAILER', '2025-05-05 15:44:04.000000', 'ab7bf1b9-7a', 71, 1),
(5, '2025-05-05 10:13:27.000000', '', 70, '86fefb17-34b3-4ea3-982b-96cbc50ed9e3.mp4', 19998744, 0, 'public', 'complete', b'1', 'bee2f9c5-caa2-4de9-8b27-d1011da48ff1.jpg', 'Vlog Diễu Binh 30/4 từ những sinh viên', '2025-05-05 15:16:49.000000', '78aabbf2-26', 2460, 1),
(6, '2025-05-05 14:12:53.000000', '', 2, '9c35ddff-7abc-4863-bad9-8b61beafe585.mp4', 241859, 0, 'public', 'complete', b'1', 'ff313ba9-008e-4983-8f5c-7049640903d8.jpg', 'A few moments later meme', '2025-05-05 15:09:43.000000', '73dc5cd6-68', 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `watch_later`
--

CREATE TABLE `watch_later` (
  `id` bigint(20) NOT NULL,
  `added_at` datetime(6) DEFAULT NULL,
  `channel_title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `duration` bigint(20) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `video_id` varchar(255) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKq4kh99ws9lhtls5i3o73gw30t` (`user_id`);

--
-- Indexes for table `liked_videos`
--
ALTER TABLE `liked_videos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK1gba2xp5mqedryffu40b6xchh` (`user_id`);

--
-- Indexes for table `playlists`
--
ALTER TABLE `playlists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKtgjwvfg23v990xk7k0idmqbrj` (`user_id`);

--
-- Indexes for table `playlist_items`
--
ALTER TABLE `playlist_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKp26xlqvxmf4sy79clw8ardhk9` (`playlist_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKcl91bj6bsg2kvi3eity8yc4hk` (`subscriber_id`,`channel_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  ADD UNIQUE KEY `UK3bsuwb2htal0ucm797wny0ue3` (`youtube_channel_id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `FKh8ciramu9cc9q3qcqiv4ue8a6` (`role_id`);

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_pqi9gfsxrsiqbcnkams2re4e8` (`video_id`),
  ADD KEY `FK75696octon297ywni28sk19ek` (`user_id`);

--
-- Indexes for table `watch_later`
--
ALTER TABLE `watch_later`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKh23kbpa391go8v9hfpsjkgf93` (`user_id`,`video_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `liked_videos`
--
ALTER TABLE `liked_videos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `playlists`
--
ALTER TABLE `playlists`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `playlist_items`
--
ALTER TABLE `playlist_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `watch_later`
--
ALTER TABLE `watch_later`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `history`
--
ALTER TABLE `history`
  ADD CONSTRAINT `FKq4kh99ws9lhtls5i3o73gw30t` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `liked_videos`
--
ALTER TABLE `liked_videos`
  ADD CONSTRAINT `FK1gba2xp5mqedryffu40b6xchh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `playlists`
--
ALTER TABLE `playlists`
  ADD CONSTRAINT `FKtgjwvfg23v990xk7k0idmqbrj` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `playlist_items`
--
ALTER TABLE `playlist_items`
  ADD CONSTRAINT `FKp26xlqvxmf4sy79clw8ardhk9` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`);

--
-- Constraints for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `FKoodc4352epkjrvxx79odlxbji` FOREIGN KEY (`subscriber_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `FKh8ciramu9cc9q3qcqiv4ue8a6` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `FK75696octon297ywni28sk19ek` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `watch_later`
--
ALTER TABLE `watch_later`
  ADD CONSTRAINT `FKsqq3g34yy46eiw3b9ddgww3hh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
