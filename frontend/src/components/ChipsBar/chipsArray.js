const categories = [
  { name: 'Trending', categoryId: null, regionCode: 'VN' }, // Trending không có categoryId cụ thể, sẽ lấy video phổ biến
  { name: 'Âm nhạc', categoryId: '10', regionCode: 'VN' },
  { name: 'Thể thao', categoryId: '17', regionCode: 'VN' },
  { name: 'Trò chơi', categoryId: '20', regionCode: 'VN' },
  { name: 'Học tập', categoryId: '27', regionCode: 'VN' }, // Education
  { name: 'Giải trí', categoryId: '24', regionCode: 'VN' }, // Entertainment
  { name: 'Tin tức', categoryId: '25', regionCode: 'VN' }, // News
  { name: 'Khoa học', categoryId: '28', regionCode: 'VN' }, // Science & Technology
  { name: 'Phim', categoryId: '1', regionCode: 'VN' }, // Film & Animation
  { name: 'Vlog', categoryId: '22', regionCode: 'VN' }, // People & Blogs
]

export default categories
