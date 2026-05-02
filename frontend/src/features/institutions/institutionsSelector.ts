import type {RootState} from "../../app/store/store.ts";

export const selectInstitutions = (state: RootState) => state.institution.institutions;

export const selectInstitution = (state: RootState) => state.institution.institution;

export const selectInstitutionsLoading = (state: RootState) => state.institution.loading.get;
export const selectInstitutionByIdLoading = (state: RootState) => state.institution.loading.getById;
export const selectInstitutionSendLoading = (state: RootState) => state.institution.loading.send;
export const selectInstitutionDeleteLoading = (state: RootState) => state.institution.loading.delete;
export const selectInstitutionError = (state: RootState) => state.institution.institutionError;
export const selectInstitutionGlobalError = (state: RootState) => state.institution.institutionErrorGlob;
