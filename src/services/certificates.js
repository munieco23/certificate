import axios from 'axios'

//const basePath = 'http://localhost:5001' Use// for local app debug
//const basePath = 'https://localhost:7241' // for server neptune debug
//const basePath = 'http://192.168.1.5:5001' // live office
const basePath = 'http://25.47.221.214:5001' // live hamachi

export const baseEndpoint = `${basePath}/v1`
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
