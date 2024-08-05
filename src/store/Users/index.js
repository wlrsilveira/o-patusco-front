import {
  USER,
  USER_DIALOG,
  READ_ONLY,
  LIST_USERS,
  LOADING,
  TOTAL_ITEMS
} from "./getters";

import {
  SET_USER,
  SET_USER_DIALOG,
  SET_READ_ONLY,
  FETCH_USERS,
  SET_LOADING
} from "./actions";
import api from '@/axios';
const userModule = {
  state: {
    user: null,
    userDialog: false,
    readonly: false,
    loading: false,
    listUsers: [],
    totalItems: 0
  },
  getters: {
    [USER]: (state) => {
      return state.user;
    },
    [USER_DIALOG]: (state) => {
      return state.userDialog;
    },
    [READ_ONLY]: (state) => {
      return state.readonly;
    },
    [LIST_USERS]: (state) => {
      return state.listUsers;
    },
    [LOADING]: (state) => {
      return state.loading;
    },
    [TOTAL_ITEMS]: (state) => {
      return state.totalItems;
    }
  },
  mutations: {
    [USER]: (state, payload) => {
      state.user = payload;
    },
    [USER_DIALOG]: (state, payload) => {
      state.userDialog = payload;
    },
    [SET_READ_ONLY]: (state, payload) => {
      state.readonly = payload;
    },
    [LIST_USERS]: (state, payload) => {
      state.listUsers = payload;
    },
    [LOADING]: (state, payload) => {
      state.loading = payload;
    },
    [TOTAL_ITEMS]: (state, payload) => {
      state.totalItems = payload;
    }
  },
  actions: {
    [SET_USER]: async ({commit}, userData) => {
      await commit(USER, userData);
    },
    [SET_USER_DIALOG]: async ({commit}, userDialog) => {
      await commit(USER_DIALOG, userDialog);
    },
    [SET_READ_ONLY]: async ({commit}, readOnly) => {
      await commit(SET_READ_ONLY, readOnly);
    },
    [FETCH_USERS]: async ({commit}, props) => {
      commit(LOADING, true)
      const fetchOptions = {
        page: props?.page || 1,
        perPage: props?.itemsPerPage || 10,
        sortBy: props?.sortBy || [],
        search: props?.search || null
      }
      api.get('/' + props.namespace, {
        params:fetchOptions
      })
      .then(response => {
        commit(LIST_USERS, response.data.data);
        commit(LOADING, false)
        commit(TOTAL_ITEMS, response.data.meta.total)
      })
      .catch(error => {
        commit(LOADING, false)
      });
    },
    [SET_LOADING]: async ({commit}, loading) => {
      await commit(SET_LOADING, loading);
    }
  }
};

export default userModule;
