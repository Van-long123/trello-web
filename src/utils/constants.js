let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:3000'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-55yz.onrender.com'
}

let webRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  webRoot = 'http://localhost:5173'
}
if (process.env.BUILD_MODE === 'production') {
  webRoot = 'https://trello-web-three-pink.vercel.app'
}

export const API_ROOT = apiRoot
export const WEB_ROOT = webRoot

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const CARD_MEMBER_ACTION = {
  REMOVE: 'REMOVE',
  ADD: 'ADD'
}
