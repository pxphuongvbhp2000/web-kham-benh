import axios from "../axios"

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword });
}

const handleGetAllUsersApi = (inputId) => {
    // return axios.get(`/api/get-all-users?id=${inputId}`);
    return axios.get(`/api/get-all-users`, { params: { id: inputId } });
}

const handleCreateNewUserApi = (data) => {
    return axios.post(`/api/create-new-user`, data);
}

const handleEditUserApi = (data) => {
    return axios.put(`/api/edit-user`, data);
}

const handleDeleteUserApi = (userId) => {
    return axios.delete(`/api/delete-user`, { data: { id: userId } });
}

const handleGetAllCodeApi = (type) => {
    return axios.get(`/api/get-all-codes`, { params: { type: type } });
}

const getTopDoctorsHomePageApi = (limit) => {
    return axios.get(`/api/top-doctor-home`, { params: { limit: limit } });
}

const getAllDoctorsApi = () => {
    return axios.get(`/api/get-all-doctors`);
}

const saveDetailInforDoctorApi = (data) => {
    return axios.post('/api/save-detail-infor-doctor', data);
}

const getDetailInforDoctorApi = (id) => {
    return axios.get('/api/get-detail-doctor-by-id', { params: { id: id } });
}

const saveBulkScheduleDoctorApi = (data) => {
    return axios.post('/api/bulk-create-schedule', data);
}

const getScheduleDoctorByDateAPi = (doctorId, date) => {
    return axios.get('/api/get-schedule-doctor-by-date', { params: { doctorId: doctorId, date: date } });
}

const getExtraInforDoctorById = (doctorId) => {
    return axios.get('/api/get-extra-infor-doctor-by-id', { params: { doctorId: doctorId } });
}

const getProfileDoctorById = (doctorId) => {
    return axios.get('/api/get-profile-doctor-by-id', { params: { doctorId: doctorId } });
}

const savePatientBookAppointmentApi = (data) => {
    return axios.post('/api/patient-book-appointment', data);
}

const saveVerifyBookAppointmentApi = (data) => {
    return axios.post('/api/verify-book-appointment', data);
}

const createNewSpecialtyApi = (data) => {
    return axios.post('/api/create-new-specialty', data);
}

const getAllSpecialtiesApi = () => {
    return axios.get('/api/get-all-specialties');
}

const getDetailSpecialtyByIdApi = (data) => {
    return axios.get('/api/get-detail-specialty-by-id', { params: { specialtyId: data.specialtyId, location: data.location } });
}

const createNewClinicApi = (data) => {
    return axios.post('/api/create-new-clinic', data);
}

const getAllClinicApi = () => {
    return axios.get('/api/get-all-clinic');
}

const getDetailClinicByIdApi = (data) => {
    return axios.get('/api/get-detail-clinic-by-id', { params: { clinicId: data.clinicId } });
}

const getAllPatientForDoctorApi = (data) => {
    return axios.get('/api/get-list-patient-for-doctor', { params: { doctorId: data.doctorId, date: data.date } });
}

const postSendRemedy = (data) => {
    return axios.post('/api/send-remedy', data);
}


export {
    handleLoginApi,
    handleGetAllUsersApi,
    handleCreateNewUserApi,
    handleEditUserApi,
    handleDeleteUserApi,
    handleGetAllCodeApi,
    getTopDoctorsHomePageApi,
    getAllDoctorsApi,
    saveDetailInforDoctorApi,
    getDetailInforDoctorApi,
    saveBulkScheduleDoctorApi,
    getScheduleDoctorByDateAPi,
    getExtraInforDoctorById,
    getProfileDoctorById,
    savePatientBookAppointmentApi,
    saveVerifyBookAppointmentApi,
    createNewSpecialtyApi,
    getAllSpecialtiesApi,
    getDetailSpecialtyByIdApi,
    createNewClinicApi,
    getAllClinicApi,
    getDetailClinicByIdApi,
    getAllPatientForDoctorApi,
    postSendRemedy,
}

