import fetch from '@/utils/fetch'

export function getList(query) {
  return fetch({
    url: '/order',
    method: 'get',
    params: query
  })
}

export function createOrder(data) {
  console.log(data)
  return fetch({
    url: '/order',
    method: 'post',
    data
  })
}

export function updateOrder(data) {
  return fetch({
    url: '/order/' + data.order_id,
    method: 'put',
    data
  })
}

export function deleteOrder(order_id) {
  return fetch({
    url: '/order/' + order_id,
    method: 'delete'
  })
}
