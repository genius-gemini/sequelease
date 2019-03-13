export const SET_LOADING = 'SET_LOADING';
export const UNSET_LOADING = 'UNSET_LOADING';

export const setLoading = loadingType => ({
  type: SET_LOADING,
  loadingType,
});

export const unsetLoading = loadingType => ({
  type: UNSET_LOADING,
  loadingType,
});
