import api from './base'

export const getAllCourses=async(token)=>{
    const res = await api.get('/courses', {
		headers: {
            Authorization: `Bearer `+token
		},
	})
    return res.data
}
export const createCourse=async(data,token)=>{
    const res = await api.post('/courses', data, {
		headers: {
            Authorization: `Bearer `+token
		},
	})
    return res.data

  }
export  const  updateCourse=async(courseId, data,token )=>{
    const res = await api.put(`/courses/${courseId}`, data, {
		headers: {
            Authorization: `Bearer `+token
		},
	})
    return res.data
  } 

export const deleteCourse=async(courseId, token)=>{
    const res = await api.delete(`/courses/${courseId}`, {
		headers: {
            Authorization: `Bearer `+token
		},
	})
    return res.data
}
