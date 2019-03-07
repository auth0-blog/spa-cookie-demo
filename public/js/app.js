Vue.component('Navigation', {
  props: ['isAuthenticated', 'user'],
  template: `
    <div>
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/profile" class="nav-link" v-if="isAuthenticated">Profile</router-link>
      <span v-if="isAuthenticated" style="float: right">Logged in as <router-link to="/profile"><strong>{{ user.name }}</strong></router-link> | <a href="/logout">Log out</a></span>
    </div>
  `
});

Vue.component('App', {
  data() {
    return {
      user: {},
      isAuthenticated: false
    };
  },
  template: `
    <v-app>
      <v-content>
        <div id="nav">
          <v-container>
            <navigation :isAuthenticated="isAuthenticated" :user="user" />
          </v-container>
        </div>

        <v-container>
          <router-view :user="user" :isAuthenticated="isAuthenticated" />
        </v-container>
      </v-content>
    </v-app>
  `,
  created() {
    axios.get('/api/user').then(({ data }) => {
      this.user = data;
      this.isAuthenticated = true;
    });
  }
});

var Home = Vue.component('Home', {
  props: {
    isAuthenticated: Boolean,
    requiresAuth: Boolean
  },
  template: `
    <div>
      <v-alert :value="pingFailed" type="warning" transition="scale-transition" outline>
        Your authentication session has expired. <a href="/login">Re-authenticate</a>
      </v-alert>

      <h1>SPA OIDC Demo Application</h1>
      <p>This is an application designed to demonstrate how to authenticate a SPA when you also have a backend server.</p>

      <div v-if="!isAuthenticated && requiresAuth">
        <v-btn color="info" href="/login">Log in</v-btn>
      </div>

      <div v-if="isAuthenticated || !requiresAuth">
        <v-btn color="info" @click="callApi">Call API</v-btn>

        <div id="server-response" v-if="hasResponse">
          <p>Response from the API call:</p>
          <pre>{{ JSON.stringify(serverResponse, {}, 2).trim() }}</pre>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      hasResponse: false,
      serverResponse: {},
      pingFailed: false
    };
  },
  methods: {
    callApi() {
      axios.get('/api/ping').then(
        ({ data }) => {
          this.serverResponse = data;
          this.hasResponse = true;
          this.pingFailed = false;
        },
        result => {
          this.pingFailed = true;
        }
      );
    }
  }
});

var Profile = Vue.component('Profile', {
  props: {
    user: Object
  },
  template: `
    <div id="profile">
      <v-layout row wrap justify-start>
        <v-layout column shrink>
          <v-flex>
              <v-avatar>
              <img :src="user.picture" />
            </v-avatar>
          </v-flex>
        </v-layout>

        <v-layout column style="margin-left: 20px">
          <v-flex grow>
            <h1>{{user.name}}</h1>
          </v-flex>
          <v-flex>
            {{user.email}}
          </v-flex>
          <v-flex><strong>Nickname</strong>: {{user.nickname}}</v-flex>
        </v-layout>
      </v-layout>
    </div>
  `
});

var routes = [
  {
    path: '/',
    component: Home,
    props: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    component: Profile
  }
];

var router = new VueRouter({ routes, mode: 'history' });

var app = new Vue({
  el: '#app',
  template: '<App/>',
  router,
  created() {}
});
