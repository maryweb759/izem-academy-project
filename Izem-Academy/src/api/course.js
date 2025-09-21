import api from './base'

export const getCourses=async()=>{
    const res = await api.get('/courses', {
		headers: {
		'Content-Type': 'application/json', 
		},
	})
    return res.data
}