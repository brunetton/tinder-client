import axios from 'axios';

/**
 * https://github.com/fbessez/Tinder
 * https://gist.github.com/rtt/10403467
*/

const GENDERS = Object.freeze({
  male: 0,
  female: 1,
});

const GENDER_SEARCH_OPTIONS = Object.freeze({
  male: 0,
  female: 1,
  both: -1,
});

class TinderClient {
  constructor(client) {
    if (!client) {
      throw new Error('Call create method');
    }

    this.client = client;
  }

  static create({ facebookUserId, facebookToken }) {
    return axios.post('https://api.gotinder.com/auth', {
      facebook_id: facebookUserId,
      facebook_token: facebookToken,
    }).then(response => axios.create({
      baseURL: 'https://api.gotinder.com',
      headers: {
        'X-Auth-Token': response.data.token,
        'Content-Type': 'application/json',
        'User-Agent': 'Tinder Android Version 2.2.3',
        os_version: '16',
      },
    })).then(client => new TinderClient(client));
  }

  getProfile() {
    return this.client({
      method: 'get',
      url: '/profile',
    }).then(response => response.data);
  }

  updateProfile({ userGender, searchPreferences }) {
    const {
      maximumAge,
      minimumAge,
      genderPreference,
      maximumRangeInKilometers,
    } = searchPreferences;

    return this.client({
      method: 'post',
      url: '/profile',
      data: {
        age_filter_min: minimumAge,
        age_filter_max: maximumAge,
        gender_filter: genderPreference,
        gender: userGender,
        distance_filter: maximumRangeInKilometers,
      },
    }).then(response => response.data);
  }

  getRecommendations() {
    return this.client({
      method: 'get',
      url: '/user/recs',
    }).then(response => response.data);
  }

  getUser(userId) {
    return this.client({
      method: 'get',
      url: `/user/${userId}`,
    }).then(response => response.data);
  }

  getMetadata() {
    return this.client({
      method: 'get',
      url: '/meta',
    }).then(response => response.data);
  }

  changeLocation({ latitude, longitude }) {
    return this.client({
      method: 'post',
      url: '/user/ping',
      data: { lat: latitude, lon: longitude },
    }).then(response => response.data);
  }

  like(userId) {
    return this.client({
      method: 'get',
      url: `/like/${userId}`,
    }).then(response => response.data);
  }

  pass(userId) {
    return this.client({
      method: 'get',
      url: `/pass/${userId}`,
    }).then(response => response.data);
  }

  superLike(userId) {
    return this.client({
      method: 'post',
      url: `/like/${userId}/super`,
    }).then(response => response.data);
  }

  messageMatch({ matchId, message }) {
    return this.client({
      method: 'post',
      url: `/user/matches/${matchId}`,
      data: { message },
    }).then(response => response.data);
  }

  getMatch(matchId) {
    return this.client({
      method: 'get',
      url: `/matches/${matchId}`,
    }).then(response => response.data);
  }

  getMessage(messageId) {
    return this.client({
      method: 'get',
      url: `/message/${messageId}`,
    }).then(response => response.data);
  }

  getUpdates(fromTimestamp = '') {
    return this.client({
      method: 'post',
      url: '/updates',
      data: { last_activity_date: fromTimestamp },
    }).then(response => response.data);
  }

  resetTemporaryLocation() {
    return this.client({
      method: 'post',
      url: '/passport/user/reset',
    }).then(response => response.data);
  }

  temporarilyChangeLocation({ latitude, longitude }) {
    return this.client({
      method: 'post',
      url: '/passport/user/travel',
      data: {
        lat: latitude,
        lon: longitude,
      },
    }).then(response => response.data);
  }
}

export { TinderClient, GENDERS, GENDER_SEARCH_OPTIONS };
