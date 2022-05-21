import CookieManager from '@react-native-cookies/cookies';

export interface Cookie {
  name: string;
  value: string;
  path?: string;
  domain?: string;
  version?: string;
  expires?: string;
  secure?: boolean;
  httpOnly?: boolean;
}

export interface Cookies {
  [key: string]: Cookie;
}

// const set = CookieManager.set('http://example.com', {
//   name: 'myCookie',
//   value: 'myValue',
//   domain: 'some domain',
//   path: '/',
//   version: '1',
//   expires: '2015-05-30T12:30:00.00-05:00'
// }).then((done) => {
//   console.log('CookieManager.set =>', done);
// });

// Get cookies for a url
