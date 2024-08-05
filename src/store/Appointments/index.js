import {
  APPOINTMENT,
  APPOINTMENT_DIALOG,
  APPOINTMENT_READ_ONLY,
  LIST_APPOINTMENTS,
  APPOINTMENT_LOADING,
  APPOINTMENT_TOTAL_ITEMS,
  APPOINTMENT_ANIMAL_TYPES
} from "./getters";

import {
  SET_APPOINTMENT,
  SET_APPOINTMENT_DIALOG,
  SET_READ_ONLY,
  FETCH_APPOINTMENTS,
  SET_LOADING,
  FETCH_ANIMAL_TYPES,
  SET_APPOINTMENT_DOCTOR,
  POST_APPOINTMENT,
  DELETE_APPOINTMENT,
  UPDATE_APPOINTMENT
} from "./actions";
import api from '@/axios';
const appointmentModule = {
  state: {
    appointment: null,
    appointmentDialog: false,
    readonly: false,
    loading: false,
    listAppointments: [],
    totalItems: 0,
    appointmentAnimalTypes: [{ description: 'Selecione', id: null }],
  },
  getters: {
    [APPOINTMENT]: (state) => {
      return state.appointment;
    },
    [APPOINTMENT_DIALOG]: (state) => {
      return state.appointmentDialog;
    },
    [APPOINTMENT_READ_ONLY]: (state) => {
      return state.readonly;
    },
    [LIST_APPOINTMENTS]: (state) => {
      return state.listAppointments;
    },
    [APPOINTMENT_LOADING]: (state) => {
      return state.loading;
    },
    [APPOINTMENT_TOTAL_ITEMS]: (state) => {
      return state.totalItems;
    },
    [APPOINTMENT_ANIMAL_TYPES]: (state) => {
      return state.appointmentAnimalTypes;
    }
  },
  mutations: {
    [APPOINTMENT]: (state, payload) => {
      state.appointment = payload;
    },
    [APPOINTMENT_DIALOG]: (state, payload) => {
      state.appointmentDialog = payload;
    },
    [APPOINTMENT_LOADING]: (state, payload) => {
      state.readonly = payload;
    },
    [LIST_APPOINTMENTS]: (state, payload) => {
      state.listAppointments = payload;
    },
    [APPOINTMENT_LOADING]: (state, payload) => {
      state.loading = payload;
    },
    [APPOINTMENT_TOTAL_ITEMS]: (state, payload) => {
      state.totalItems = payload;
    },
    [APPOINTMENT_ANIMAL_TYPES]: (state, payload) => {
      state.appointmentAnimalTypes = [{ description: 'Selecione', id: null }, ...payload];
    },
    [APPOINTMENT_READ_ONLY]: (state, payload) => {
      state.readonly = payload;
    }
  },
  actions: {
    [SET_APPOINTMENT]: async ({commit}, appointmentData) => {
      await commit(APPOINTMENT, appointmentData);
    },
    [SET_APPOINTMENT_DIALOG]: async ({commit}, appointmentDialog) => {
      await commit(APPOINTMENT_DIALOG, appointmentDialog);
    },
    [SET_READ_ONLY]: async ({commit}, readOnly) => {
      await commit(APPOINTMENT_READ_ONLY, readOnly);
    },
    [FETCH_APPOINTMENTS]: async ({commit}, props) => {
      commit(APPOINTMENT_LOADING, true)
      const fetchOptions = {
        page: props?.page || 1,
        perPage: props?.itemsPerPage || 10,
        sortBy: props?.sortBy || [],
        name: props?.name || null,
        email: props?.email || null,
        date: props?.date || null,
        animal_name: props?.animal_name || null,
        animal_type_id: props?.animal_type_id || null,
        doctor_id: props?.doctor_id || null,
      }
      const namespace = props.namespace || 'appointment';
      api.get('/' + namespace, {
        params:fetchOptions
      })
      .then(response => {
        commit(LIST_APPOINTMENTS, response.data.data);
        commit(APPOINTMENT_LOADING, false)
        commit(APPOINTMENT_TOTAL_ITEMS, response.data.meta.total)
      })
      .catch(error => {
        commit(APPOINTMENT_LOADING, false)
      });
    },
    [SET_LOADING]: async ({commit}, loading) => {
      await commit(SET_LOADING, loading);
    },
    [FETCH_ANIMAL_TYPES]: async ({commit}) => {
      api.get('/animalTypes')
      .then(response => {
        commit(APPOINTMENT_ANIMAL_TYPES, response.data);
      })
      .catch(error => {

      });
    },
    [POST_APPOINTMENT]: async ({commit}, appointmentData) => {
      return api.post('/appointment', appointmentData)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
    },
    [DELETE_APPOINTMENT]: async ({commit, dispatch}, appointmentId) => {
      return api.delete(appointmentId +'/appointment')
      .then(response => {
        dispatch(FETCH_APPOINTMENTS, {namespace: 'appointment'});
        return response;
      })
      .catch(error => {
        return error;
      });
    },
    [SET_APPOINTMENT_DOCTOR]: async ({commit, dispatch, getters}, doctorId) => {
      return api.put(getters[APPOINTMENT].id +'/appointment/attach/' + doctorId)
      .then(response => {
        dispatch(FETCH_APPOINTMENTS, {namespace: 'appointment'});
        return response;
      })
      .catch(error => {
        return error;
      });
    },
    [UPDATE_APPOINTMENT]: async ({commit, getters}, appointmentData) => {
      return api.put(getters[APPOINTMENT].id + '/appointment', appointmentData)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
    },
  }
};

export default appointmentModule;
