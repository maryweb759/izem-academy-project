import api from './base'

export const getAllEnrollement=async(token,page, size)=>{
    const res = await api.get(`/admin/enrollments/pending?page=${page}&limit=${size}`, {
		headers: {
            Authorization: `Bearer `+token
		},
	})
    return res.data
}
export const processEnrollment = async (data,enrollmentId, token) => {
  const res = await api.patch(`/admin/enrollment/${enrollmentId}/process`, data, {
    headers: {
      Authorization: `Bearer ` + token,
    },
  });
  return res.data;
};