export const currentUser = {
  id: 'u1',
  name: 'Aline Mutesi',
  username: 'aline.loop',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  cover: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80',
  bio: 'Class of 2026. Collecting the little moments that made school feel infinite.',
  school: 'Nyabugogo Modern Academy',
  followers: '18.4K',
  following: 842,
  posts: 128,
};

export const people = [
  {
    id: 'u2',
    name: 'Kevin Ishimwe',
    username: 'kevin.frames',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    school: 'Green Hills',
  },
  {
    id: 'u3',
    name: 'Maya Keza',
    username: 'maya.archive',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    school: 'Lycee Notre Dame',
  },
  {
    id: 'u4',
    name: 'Cedric Ntwari',
    username: 'cedric.reels',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    school: 'APACE',
  },
  {
    id: 'u5',
    name: 'Nadia Umuhoza',
    username: 'nadia.gold',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    school: 'Fawe Girls',
  },
];

export const stories = [
  { id: 's1', user: people[0], image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=500&q=80', label: '2019 Trip' },
  { id: 's2', user: people[1], image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=500&q=80', label: 'Grad Day' },
  { id: 's3', user: people[2], image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500&q=80', label: 'Library' },
  { id: 's4', user: people[3], image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=500&q=80', label: 'Club Night' },
];

export const posts = [
  {
    id: 'p1',
    author: people[1],
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    caption: 'Found this from graduation rehearsal. We thought we were stressed, but we were actually glowing.',
    likes: '12.8K',
    comments: 248,
    shares: 62,
    time: '12 min',
  },
  {
    id: 'p2',
    author: people[0],
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
    caption: 'The canteen table where every serious life plan was created and immediately forgotten.',
    likes: '8.9K',
    comments: 174,
    shares: 41,
    time: '1 hr',
  },
  {
    id: 'p3',
    author: currentUser,
    image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e9e3?auto=format&fit=crop&w=1200&q=80',
    caption: 'Before vs now hits different when the old uniform still fits.',
    likes: '21.2K',
    comments: 519,
    shares: 132,
    time: '3 hr',
  },
];

export const memories = [
  { id: 'm1', title: 'First Year Energy', year: '2021', type: 'Old Photo', image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80', note: 'The group photo before everyone learned their angles.' },
  { id: 'm2', title: 'Before vs Now', year: '2026', type: 'Glow Up', image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80', note: 'Same friends, better cameras, stronger stories.' },
  { id: 'm3', title: 'Sports Day', year: '2023', type: 'Funny Moment', image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=900&q=80', note: 'The race was lost, the legend was born.' },
];

export const reels = [
  { id: 'r1', author: people[2], image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80', caption: 'POV: the teacher says the test is open-book.', likes: '44K', comments: '1.2K' },
  { id: 'r2', author: people[3], image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e9e3?auto=format&fit=crop&w=900&q=80', caption: 'Class photo transition, 2020 to 2026.', likes: '31K', comments: 984 },
  { id: 'r3', author: currentUser, image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80', caption: 'Library silence lasted exactly four seconds.', likes: '18K', comments: 430 },
];

export const conversations = [
  {
    id: 'c1',
    user: people[0],
    last: 'Send the old group photo.',
    unread: 3,
    messages: [
      { id: 'c1m1', from: 'them', text: 'Did you find the photo from senior picnic?' },
      { id: 'c1m2', from: 'me', text: 'Yes. It is dramatic in the best way.' },
      { id: 'c1m3', from: 'them', text: 'Send the old group photo.' },
    ],
  },
  {
    id: 'c2',
    user: people[1],
    last: 'That reel is too accurate.',
    unread: 0,
    messages: [
      { id: 'c2m1', from: 'them', text: 'That reel is too accurate.' },
      { id: 'c2m2', from: 'me', text: 'Our class monitor era was cinema.' },
    ],
  },
  {
    id: 'c3',
    user: people[3],
    last: 'Meet at 5?',
    unread: 1,
    messages: [
      { id: 'c3m1', from: 'them', text: 'Meet at 5?' },
      { id: 'c3m2', from: 'me', text: 'I will bring the photo album.' },
    ],
  },
];

export const notifications = [
  { id: 'n1', user: people[1], text: 'liked your memory from 2021', time: '4 min' },
  { id: 'n2', user: people[2], text: 'commented on your reel', time: '22 min' },
  { id: 'n3', user: people[0], text: 'started following you', time: '1 hr' },
  { id: 'n4', user: people[3], text: 'shared your graduation post', time: '3 hr' },
];
