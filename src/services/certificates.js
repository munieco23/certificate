import axios from 'axios'

//const basePath = 'http://192.168.30.11:5001'
const basePath = 'http://localhost:5001'
const baseEndpoint = `${basePath}/v1`
const api = axios.create({
  baseURL: `${baseEndpoint}`
})

export const getCertificationAuthorities = async (usrData) => {
  const authToken = btoa(`${usrData.username}:${usrData.password}`)
  let { data } = await api.get(`/certification-authorities`, {
    headers: {
      Authorization: `Basic ${authToken}`
    }
  })
  return data
}

export const certificateSignRequest = async (usrData, catName, template, obj) => {
  const authToken = btoa(`${usrData.username}:${usrData.password}`)
  let { data: data } = await api.post(
    `/certificates/${catName}?certificateTemplate=${template}`,
    {
      request: obj.request,
      requestAttributes: obj.requestAttributes
    },
    {
      headers: {
        Authorization: `Basic ${authToken}`
      }
    }
  )

  return data
}

const certificates = { getCertificationAuthorities, certificateSignRequest }
export default certificates
