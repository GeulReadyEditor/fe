import Vuex, {Module} from 'vuex'
import Vue from 'vue'
import {RootState} from '@/store/index'
import { Auth } from 'aws-amplify'

Vue.use(Vuex)

interface authStore {
	user:{
		signedIn: boolean,
		userAccount: any,
		userInfo: any
	};
	accessToken:string;
}

const authModule:Module<authStore,RootState>={
  namespaced:true,
  state: {
    user: {
      signedIn: false,
      userAccount: new Object(),
      userInfo: new Object()
    },
    accessToken: ''
  },
  mutations: {
    changeSignedInState: function(state, user){
      Vue.set(state.user, 'signedIn', !!user)
      Vue.set(state.user, 'userAccount', user)
    },
    setAccessToken: function(state, token){
      Vue.set(state, 'accessToken', token)
    },
    setUserInfo: function(state, user){
      Vue.set(state.user, 'userInfo', user)
    }

  },
  getters: {
    getSignedIn: function(state){
      return state.user.signedIn
    }
  },
  actions: {
    findUser: function(){
      try{
        Auth.currentAuthenticatedUser()
          .then(user => {
                this.state.user.signedIn = !!user;
                this.state.user.userAccount = user;
                Auth.currentSession()
                    .then((result: any) => {
                        this.state.accessToken = result.accessToken.jwtToken;
                })

            })
          .catch(err => {
              console.log(err)
              this.state.user.signedIn = false;
              this.state.user.userAccount = {};

          });
      }
      catch (error) {
          console.log('not signed in', error);
      }
    },
    // setUserInfo: function(){
    //   if(this.state.user.userAccount){
    //     http
    //         .get('/users/'+this.state.user.userAccount.attributes.email)
    //         .then(response => {
    //             this.state.user.userInfo = response.data
    //             console.log(this.state.user.userInfo)
    //         })
    //   }
    // }
  },
  modules: {
  }
}

export default authModule