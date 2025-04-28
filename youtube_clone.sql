-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 28, 2025 at 05:48 AM
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
(5, 'Sơn Tùng M-TP Official', 'SON TUNG M-TP - \"HÃY TRAO CHO ANH\" | GIVE IT TO ME\nM-TP ENTERTAINMENT\n\nAvailable on Nhaccuatui: @http://nhaccuatui.com/sontungmtp/haytraochoanh\nAvailable on Spotify: @https://spoti.fi/2YodgS6\nAvailable on iTunes: @https://apple.co/2xknmaI\n\nExecutive Producer: Nguyen Thanh Tung \nComposer: Son Tung M-TP \nMusic Producer: ONIONN\nArtist: Son Tung M-TP\nFeaturing with: Snoop Dogg (Snoop Dogg appears courtesy of Doggy Style Records)\nMain Actress: Madison Beer\nProject Producer: M&M House\n\nProject management: Chau LE\nMarketing Director: Henry Nguyen\nPR Executive: Nhat Duy\nTalent Manager: Tran Song Hanh Nhan\n\nPRODUCTION TEAM\nMusic Video Production: August Frogs \nDirector: Korlio\nProducer: Sunok Hong\nLocal Producer: Christopher Lee\nAssistant Director: Kyuho Sung\nCGI: Jiun Kim\nPhotographer: Jiun Kim\nPoster Designer: Jiun Kim\nStylist: Hary Hong\nHair Stylist: Hyunwoo Lee\nMakeup: Eunyeong Baek\nChoreographer: Luana Simpson Fowler\nDancer: Geovane Fidelis\n\nSPECIAL THANKS TO\nArtist Agency (Project Execute', '2025-04-28 03:43:09.000000', 'https://i.ytimg.com/vi/knW7-x7Y7RE/hqdefault.jpg', 'SƠN TÙNG M-TP | HÃY TRAO CHO ANH ft. Snoop Dogg | Official MV', 'knW7-x7Y7RE', 2);

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
  `verified` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `channel_description`, `created_at`, `email`, `password`, `profile_image_url`, `subscriber_count`, `updated_at`, `username`, `verified`) VALUES
(1, NULL, '2025-04-28 02:37:07.000000', 'danh@gmail.com', '$2a$10$y34jf/BgKvi745t//TCqSON/jFnYxkUVBI4OS28BgZryy343jwyAe', NULL, 0, '2025-04-28 02:37:07.000000', 'huudanh', b'0'),
(2, NULL, '2025-04-28 03:36:35.000000', 'khiem@gmail.com', '$2a$10$SZ98WYQk98PrbWFTAFGFi.FEldKNQr9uvZlR4Wm3fXNubCUmj2tbO', NULL, 0, '2025-04-28 03:36:35.000000', 'nhatkhiem', b'0');

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

--
-- Indexes for dumped tables
--

--
-- Indexes for table `liked_videos`
--
ALTER TABLE `liked_videos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK1gba2xp5mqedryffu40b6xchh` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `FKh8ciramu9cc9q3qcqiv4ue8a6` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `liked_videos`
--
ALTER TABLE `liked_videos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `liked_videos`
--
ALTER TABLE `liked_videos`
  ADD CONSTRAINT `FK1gba2xp5mqedryffu40b6xchh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `FKh8ciramu9cc9q3qcqiv4ue8a6` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
