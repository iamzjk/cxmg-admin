import fetch from '@/utils/fetch'

export function getTrackingStatus(tracking, carrier) {
  return fetch({
    url: '/tracking/' + tracking + '/' + carrier,
    method: 'get'
  })
}
