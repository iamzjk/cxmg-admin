import fetch from '@/utils/fetch'

export function getTrackingStatus(tracking, carrier) {
  var data = {
    'tracking_number': tracking,
    'carrier': carrier
  }
  return fetch({
    url: '/tracking/',
    method: 'post',
    data
  })
}
